#!/usr/bin/env bash
set -Eeuo pipefail
umask 077

usage() {
  cat <<'HELP'
Export a private, restorable SQL backup of a Supabase project's database.

Requirements: Supabase CLI, Docker, and a PostgreSQL connection URL.

Run this file locally after downloading/cloning the repository. It prompts for
the database URL without echoing it. The URL is never written to the backup.

Output: one timestamped database.sql file under ~/supabase-backups by default.
Set BACKUP_ROOT to choose a different directory outside this repository.

The dump contains custom database roles, schema, data, and Supabase migration
history. It does not export Storage object files, Auth-managed users/sessions,
Edge Function source/secrets, or project encryption keys.
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

command -v supabase >/dev/null 2>&1 || fail 'Supabase CLI is required.'
command -v docker >/dev/null 2>&1 || fail 'Docker is required by the Supabase CLI dump command.'
docker info >/dev/null 2>&1 || fail 'Docker is not running or is not accessible.'

read -r -s -p 'Supabase database connection URL (input hidden): ' database_url
printf '\n'
[[ -n "$database_url" ]] || fail 'No connection URL was provided.'
case "$database_url" in
  postgres://*|postgresql://*) ;;
  *) fail 'The connection URL must start with postgres:// or postgresql://.' ;;
esac

repo_root="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
backup_root="${BACKUP_ROOT:-${HOME:?HOME must be set}/supabase-backups}"
mkdir -p "$backup_root"
backup_root="$(cd "$backup_root" && pwd -P)"
case "$backup_root/" in
  "$repo_root/"|"$repo_root"/*) fail 'Choose a backup directory outside the repository to keep sensitive data out of Git.' ;;
esac
chmod 700 "$backup_root"

connection_authority="${database_url#*://}"
connection_authority="${connection_authority%%/*}"
connection_host="${connection_authority##*@}"
connection_host="${connection_host%%:*}"
project_ref='supabase-project'
case "$connection_host" in
  db.*.supabase.co|db.*.supabase.com)
    project_ref="${connection_host#db.}"
    project_ref="${project_ref%.supabase.co}"
    project_ref="${project_ref%.supabase.com}"
    ;;
  *.pooler.supabase.com)
    connection_user="${connection_authority%@*}"
    connection_user="${connection_user%%:*}"
    if [[ "$connection_user" == *.* ]]; then
      project_ref="${connection_user#*.}"
    fi
    ;;
esac

# Keep the generated SQL private and publish it only after every dump succeeds.
timestamp="$(date -u '+%Y%m%dT%H%M%SZ')"
work_dir="$(mktemp -d "$backup_root/.${project_ref}-${timestamp}.XXXXXX")"
cleanup() {
  if [[ -n "${work_dir:-}" && -d "$work_dir" ]]; then
    rm -rf -- "$work_dir"
  fi
}
trap cleanup EXIT

run_dump() {
  local description="$1"
  shift
  if ! supabase "$@" >/dev/null 2>&1; then
    fail "$description failed. Verify the connection URL, permissions, and Docker; CLI output was suppressed to protect credentials."
  fi
}

printf 'Exporting database schema and data. The URL and SQL contents will not be printed.\n'
run_dump 'Role export' db dump --db-url "$database_url" -f "$work_dir/roles.sql" --role-only
run_dump 'Schema export' db dump --db-url "$database_url" -f "$work_dir/schema.sql"
run_dump 'Migration history schema export' db dump --db-url "$database_url" -f "$work_dir/history-schema.sql" --schema supabase_migrations
run_dump 'Data export' db dump --db-url "$database_url" -f "$work_dir/data.sql" --use-copy --data-only -x 'storage.buckets_vectors' -x 'storage.vector_indexes'
run_dump 'Migration history data export' db dump --db-url "$database_url" -f "$work_dir/history-data.sql" --use-copy --data-only --schema supabase_migrations

backup_file="$work_dir/database.sql"
{
  printf '%s\n' '-- Private Supabase logical backup; contains all exported database records.'
  printf '%s\n' "-- Created at $(date -u '+%Y-%m-%dT%H:%M:%SZ'). Keep this file out of Git and share it only through a secure channel."
  cat "$work_dir/roles.sql" "$work_dir/schema.sql" "$work_dir/history-schema.sql"
  printf '\n%s\n' 'SET session_replication_role = replica;'
  cat "$work_dir/data.sql" "$work_dir/history-data.sql"
} > "$backup_file"
chmod 600 "$backup_file"

final_dir="$backup_root/${project_ref}-${timestamp}"
[[ ! -e "$final_dir" ]] || fail 'A backup with this timestamp already exists; run the backup again.'
mv -- "$work_dir" "$final_dir"
work_dir=''
trap - EXIT

printf 'Backup created: %s\n' "$final_dir/database.sql"
printf '%s\n' 'This file contains sensitive database records. Store it securely and do not commit it to Git.'
printf '%s\n' 'Restore only into a compatible, empty Supabase project using psql --single-transaction --variable ON_ERROR_STOP=1 --file <database.sql> --dbname <new-connection-url>.'
