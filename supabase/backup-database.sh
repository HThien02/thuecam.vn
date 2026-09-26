#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

usage() {
  cat <<'HELP'
Create one private archive containing a Supabase database dump, Storage objects,
Storage bucket settings, an Auth user snapshot, and tracked Supabase migrations.

Requirements: Supabase CLI, Docker, psql for restore, Python 3, and this repo's
installed @supabase/supabase-js dependency.

The script prompts for the database URL and service-role key without echoing
those secrets. It does not print record contents or object paths.

Output: one timestamped .tar.gz under ~/supabase-backups by default.
Set BACKUP_ROOT to use another directory outside this repository.

The archive contains sensitive customer data. Keep it private and out of Git.
HELP
}

fail() {
  printf 'Backup stopped: %s\n' "$1" >&2
  exit 1
}

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  usage
  exit 0
fi

if [[ $# -ne 0 ]]; then
  usage >&2
  exit 2
fi

for command_name in supabase docker node tar gzip; do
  command -v "$command_name" >/dev/null 2>&1 || fail "$command_name is required."
done

docker info >/dev/null 2>&1 || fail 'Docker is not running or is not accessible.'
node --input-type=module -e "import('@supabase/supabase-js')" >/dev/null 2>&1 || fail "Install this repository's dependencies before running the backup."

read -r -s -p 'Supabase database connection URL (input hidden): ' database_url
printf '\n'
[[ -n "$database_url" ]] || fail 'No database URL was provided.'
case "$database_url" in
  postgres://*|postgresql://*) ;;
  *) fail 'The database URL must start with postgres:// or postgresql://.' ;;
esac

read -r -p 'Supabase project URL: ' project_url
[[ "$project_url" =~ ^https://[A-Za-z0-9.-]+$ ]] || fail 'Enter the project HTTPS URL, such as https://<project-ref>.supabase.co.'
read -r -s -p 'Supabase service-role/secret key (input hidden): ' service_role_key
printf '\n'
[[ -n "$service_role_key" ]] || fail 'No service-role key was provided.'

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
cd "$repo_root"
backup_root="${BACKUP_ROOT:-${HOME:?HOME must be set}/supabase-backups}"
mkdir -p "$backup_root"
backup_root="$(cd "$backup_root" && pwd -P)"
case "$backup_root/" in
  "$repo_root/"|"$repo_root"/*) fail 'Choose a backup directory outside the repository to keep sensitive data out of Git.' ;;
esac
chmod 700 "$backup_root"

project_ref="${project_url#https://}"
project_ref="${project_ref%%.*}"
[[ -n "$project_ref" ]] || project_ref='supabase-project'
timestamp="$(date -u '+%Y%m%dT%H%M%SZ')"
work_dir="$(mktemp -d "$backup_root/.${project_ref}-${timestamp}.XXXXXX")"
cleanup() {
  if [[ -n "${work_dir:-}" && -d "$work_dir" ]]; then
    rm -rf -- "$work_dir"
  fi
  if [[ -n "${archive_tmp:-}" && -f "$archive_tmp" ]]; then
    rm -f -- "$archive_tmp"
  fi
}
trap cleanup EXIT
mkdir -p "$work_dir/storage/objects" "$work_dir/auth" "$work_dir/project-files"

run_dump() {
  local description="$1"
  shift
  if ! supabase "$@" >/dev/null 2>&1; then
    fail "$description failed. Check the database URL, permissions, and Docker; CLI output was suppressed to protect credentials."
  fi
}

printf 'Exporting database schema, records, and migration history.\n'
run_dump 'Role export' db dump --db-url "$database_url" -f "$work_dir/roles.sql" --role-only
run_dump 'Schema export' db dump --db-url "$database_url" -f "$work_dir/schema.sql"
run_dump 'Migration history schema export' db dump --db-url "$database_url" -f "$work_dir/history-schema.sql" --schema supabase_migrations
run_dump 'Data export' db dump --db-url "$database_url" -f "$work_dir/data.sql" --use-copy --data-only -x 'storage.buckets_vectors' -x 'storage.vector_indexes'
run_dump 'Migration history data export' db dump --db-url "$database_url" -f "$work_dir/history-data.sql" --use-copy --data-only --schema supabase_migrations

{
  printf '%s\n' '-- Private Supabase logical database backup. Contains exported schema and database records.'
  printf '%s\n' "-- Created at $(date -u '+%Y-%m-%dT%H:%M:%SZ'). Treat this archive as sensitive customer data."
  cat "$work_dir/roles.sql" "$work_dir/schema.sql" "$work_dir/history-schema.sql"
  printf '\n%s\n' 'SET session_replication_role = replica;'
  cat "$work_dir/data.sql" "$work_dir/history-data.sql"
} > "$work_dir/database.sql"
chmod 600 "$work_dir/database.sql"
rm -- "$work_dir/roles.sql" "$work_dir/schema.sql" "$work_dir/history-schema.sql" "$work_dir/data.sql" "$work_dir/history-data.sql"

printf 'Exporting Storage objects and Auth account metadata without printing record contents.\n'
SUPABASE_URL="$project_url" \
SUPABASE_SERVICE_ROLE_KEY="$service_role_key" \
BACKUP_STORAGE_DIR="$work_dir/storage" \
BACKUP_AUTH_FILE="$work_dir/auth/users.json" \
node --input-type=module <<'NODE'
import { createClient } from '@supabase/supabase-js'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve, sep } from 'node:path'

const client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})
const storageRoot = resolve(process.env.BACKUP_STORAGE_DIR, 'objects')
const manifest = { formatVersion: 1, createdAt: new Date().toISOString(), buckets: [] }
let totalFiles = 0

function validateSegment(segment) {
  if (!segment || segment === '.' || segment === '..' || /[\\/\0]/.test(segment)) {
    throw new Error('Invalid Storage path segment')
  }
}

const { data: buckets, error: bucketError } = await client.storage.listBuckets()
if (bucketError || !buckets) throw new Error('Could not list Storage buckets')

for (const bucket of buckets) {
  validateSegment(bucket.name)
  const bucketRoot = resolve(storageRoot, bucket.name)
  if (!bucketRoot.startsWith(`${storageRoot}${sep}`)) throw new Error('Invalid bucket path')
  const bucketRecord = {
    id: bucket.id,
    name: bucket.name,
    public: bucket.public,
    fileSizeLimit: bucket.file_size_limit ?? null,
    allowedMimeTypes: bucket.allowed_mime_types ?? null,
    files: [],
  }
  manifest.buckets.push(bucketRecord)

  async function walk(folder = '') {
    const pageSize = 100
    let offset = 0
    while (true) {
      const { data: entries, error } = await client.storage.from(bucket.name).list(folder, {
        limit: pageSize,
        offset,
        sortBy: { column: 'name', order: 'asc' },
      })
      if (error || !entries) throw new Error('Could not list Storage objects')
      for (const entry of entries) {
        validateSegment(entry.name)
        const objectPath = folder ? `${folder}/${entry.name}` : entry.name
        if (!entry.id || !entry.metadata) {
          await walk(objectPath)
          continue
        }
        const destination = resolve(bucketRoot, ...objectPath.split('/'))
        if (!destination.startsWith(`${bucketRoot}${sep}`)) throw new Error('Invalid object path')
        const { data: blob, error: downloadError } = await client.storage.from(bucket.name).download(objectPath)
        if (downloadError || !blob) throw new Error('Could not download a Storage object')
        await mkdir(dirname(destination), { recursive: true, mode: 0o700 })
        const contents = Buffer.from(await blob.arrayBuffer())
        await writeFile(destination, contents, { mode: 0o600 })
        bucketRecord.files.push({
          path: objectPath,
          size: contents.byteLength,
          contentType: entry.metadata.mimetype ?? 'application/octet-stream',
          cacheControl: entry.metadata.cacheControl ?? null,
          eTag: entry.metadata.eTag ?? null,
        })
        totalFiles += 1
      }
      offset += entries.length
      if (entries.length < pageSize) break
    }
  }

  await walk()
}

await mkdir(dirname(process.env.BACKUP_AUTH_FILE), { recursive: true, mode: 0o700 })
const users = []
for (let page = 1; ; page += 1) {
  const { data, error } = await client.auth.admin.listUsers({ page, perPage: 1000 })
  if (error || !data) throw new Error('Could not export Auth account metadata')
  users.push(...data.users)
  if (data.users.length < 1000) break
}

await writeFile(resolve(process.env.BACKUP_STORAGE_DIR, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`, { mode: 0o600 })
await writeFile(process.env.BACKUP_AUTH_FILE, `${JSON.stringify({ formatVersion: 1, users }, null, 2)}\n`, { mode: 0o600 })
console.log(`Storage objects archived: ${totalFiles}; Auth account records archived: ${users.length}.`)
NODE
unset service_role_key

if [[ -d "$repo_root/supabase/migrations" ]]; then
  cp -R "$repo_root/supabase/migrations" "$work_dir/project-files/migrations"
fi
if [[ -f "$repo_root/supabase/seed.sql" ]]; then
  cp "$repo_root/supabase/seed.sql" "$work_dir/project-files/seed.sql"
fi
if [[ -f "$repo_root/supabase/config.toml" ]]; then
  cp "$repo_root/supabase/config.toml" "$work_dir/project-files/config.toml"
fi

cat > "$work_dir/RESTORE.txt" <<'RESTORE'
PRIVATE SUPABASE PROJECT BACKUP

This archive contains sensitive database/customer records and Storage files.
Keep it encrypted at rest, share it only through a private channel, and never
commit it to Git or upload it to a public file host.

Contents
- database.sql: roles, dumpable project schema/data, and migration history.
- storage/manifest.json and storage/objects/: bucket settings and downloaded files.
- auth/users.json: Auth user/account metadata returned by the Admin API.
- project-files/: tracked Supabase migrations, seed, and local config when present.
- restore.sh and restore_storage.py: restore helpers.

Restore into a NEW, EMPTY, compatible Supabase project. Install psql and Python
3 first. Run ./restore.sh from the extracted archive. It prompts for the target
database URL and target Supabase URL/service-role key; inputs are not echoed.
Database restore happens before Storage upload. Do not restore over a live project.

Limits of a portable logical archive
- Supabase filters internal auth/storage schemas from db dump. auth/users.json
  preserves exported account/profile metadata for reference but omits password
  hashes and sessions, and does not automatically recreate user accounts.
  Users will need new accounts or password resets on the restored project.
- Bucket settings and file bytes are included. Custom Storage RLS policies in
  the managed storage schema must be recreated separately if they are not in
  tracked migrations.
- Project API keys, service-role secrets, OAuth provider secrets, SMTP settings,
  Edge Function secrets, encryption root keys, hosted Edge Function code that
  is not in this repository, and other dashboard-only settings are not included.
  Supabase does not provide a supported single-file dump that can restore all
  of these managed project resources and user credentials exactly.
- Restoring Supabase Vault/column-encrypted data needs the source encryption
  root key. This archive deliberately does not contain that key.
RESTORE

cat > "$work_dir/restore.sh" <<'RESTORE_SCRIPT'
#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

fail() {
  printf 'Restore stopped: %s\n' "$1" >&2
  exit 1
}

archive_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd -P)"
command -v psql >/dev/null 2>&1 || fail 'psql is required.'
command -v python3 >/dev/null 2>&1 || fail 'Python 3 is required.'

read -r -s -p 'Target database connection URL (input hidden): ' database_url
printf '\n'
[[ "$database_url" == postgres://* || "$database_url" == postgresql://* ]] || fail 'A PostgreSQL connection URL is required.'
printf 'Restoring SQL into the target database. Use a new, empty project.\n'
if ! psql --single-transaction --variable ON_ERROR_STOP=1 --file "$archive_dir/database.sql" --dbname "$database_url" >/dev/null 2>&1; then
  fail 'Database restore failed. Check the target project and connection; output was suppressed to protect credentials.'
fi
unset database_url

read -r -p 'Target Supabase project URL: ' project_url
[[ "$project_url" =~ ^https://[A-Za-z0-9.-]+$ ]] || fail 'Enter the target project HTTPS URL.'
read -r -s -p 'Target service-role/secret key (input hidden): ' service_role_key
printf '\n'
[[ -n "$service_role_key" ]] || fail 'A target service-role key is required.'
SUPABASE_URL="$project_url" SUPABASE_SERVICE_ROLE_KEY="$service_role_key" python3 "$archive_dir/restore_storage.py" "$archive_dir"
unset service_role_key
printf 'Database and Storage restore completed. Auth user records are archived for reference only; see RESTORE.txt.\n'
RESTORE_SCRIPT
chmod 700 "$work_dir/restore.sh"

cat > "$work_dir/restore_storage.py" <<'RESTORE_PYTHON'
#!/usr/bin/env python3
import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


def fail(message):
    print(f"Storage restore stopped: {message}", file=sys.stderr)
    raise SystemExit(1)


if len(sys.argv) != 2:
    fail("invalid archive path")
root = Path(sys.argv[1]).resolve()
base_url = os.environ.get("SUPABASE_URL", "").rstrip("/")
api_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
if not base_url.startswith("https://") or not api_key:
    fail("target URL or service-role key is missing")


def api(method, endpoint, body=None, content_type="application/json"):
    headers = {"apikey": api_key, "Authorization": f"Bearer {api_key}"}
    data = body
    if isinstance(body, dict):
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = content_type
    elif content_type:
        headers["Content-Type"] = content_type
    request = Request(f"{base_url}{endpoint}", data=data, headers=headers, method=method)
    try:
        with urlopen(request, timeout=120) as response:
            return response.read()
    except (HTTPError, URLError, TimeoutError, OSError):
        fail("request failed; check the target project, permissions, and that buckets are empty")


manifest_path = root / "storage" / "manifest.json"
try:
    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
except (OSError, json.JSONDecodeError):
    fail("Storage manifest is missing or invalid")

files_uploaded = 0
for bucket in manifest.get("buckets", []):
    name = bucket["name"]
    bucket_payload = {
        "id": name,
        "name": name,
        "public": bucket.get("public", False),
        "file_size_limit": bucket.get("fileSizeLimit"),
        "allowed_mime_types": bucket.get("allowedMimeTypes"),
    }
    api("POST", "/storage/v1/bucket", bucket_payload)
    bucket_root = (root / "storage" / "objects" / name).resolve()
    if root not in bucket_root.parents:
        fail("invalid bucket path")
    for item in bucket.get("files", []):
        object_path = item["path"]
        if any(part in ("", ".", "..") for part in object_path.split("/")):
            fail("invalid object path")
        local_file = (bucket_root / object_path).resolve()
        if bucket_root not in local_file.parents or not local_file.is_file():
            fail("an archived Storage object is missing")
        endpoint = "/storage/v1/object/" + quote(name, safe="") + "/" + quote(object_path, safe="/")
        headers = {
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Content-Type": item.get("contentType") or "application/octet-stream",
            "x-upsert": "true",
        }
        if item.get("cacheControl"):
            headers["cache-control"] = str(item["cacheControl"])
        request = Request(f"{base_url}{endpoint}", data=local_file.read_bytes(), headers=headers, method="POST")
        try:
            with urlopen(request, timeout=120):
                pass
        except (HTTPError, URLError, TimeoutError, OSError):
            fail("object upload failed; check the target project and Storage limits")
        files_uploaded += 1

print(f"Storage buckets restored: {len(manifest.get('buckets', []))}; objects uploaded: {files_uploaded}.")
RESTORE_PYTHON
chmod 600 "$work_dir/restore_storage.py" "$work_dir/RESTORE.txt"

archive_file="$backup_root/${project_ref}-${timestamp}.tar.gz"
[[ ! -e "$archive_file" ]] || fail 'A backup with this timestamp already exists; run the backup again.'
archive_tmp="$backup_root/.${project_ref}-${timestamp}.partial"
if ! tar -czf "$archive_tmp" -C "$work_dir" . >/dev/null 2>&1; then
  fail 'Could not create the archive.'
fi
if ! gzip -t "$archive_tmp" >/dev/null 2>&1; then
  fail 'Archive verification failed.'
fi
chmod 600 "$archive_tmp"
mv -- "$archive_tmp" "$archive_file"
rm -rf -- "$work_dir"
work_dir=''
trap - EXIT
printf 'One-file project archive created: %s\n' "$archive_file"
printf '%s\n' 'The archive contains sensitive data. Keep it private and do not commit it to Git.'
