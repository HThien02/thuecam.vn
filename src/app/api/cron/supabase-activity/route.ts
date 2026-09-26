import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

const noStoreHeaders = { 'Cache-Control': 'no-store' };

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return Response.json({ error: 'Cron secret is not configured.' }, { status: 503, headers: noStoreHeaders });
  }

  if (request.headers.get('authorization') !== `Bearer ${cronSecret}`) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401, headers: noStoreHeaders });
  }

  const supabase = createAdminClient();
  const checks = await Promise.all([
    supabase.from('products').select('id').limit(1),
    supabase.from('categories').select('id').limit(1),
    supabase.from('brands').select('id').limit(1),
  ]);
  const error = checks.find((check) => check.error)?.error;

  if (error) {
    console.error('[supabase-activity-cron] Activity check failed:', error.message);
    return Response.json({ error: 'Database activity check failed.' }, { status: 503, headers: noStoreHeaders });
  }

  return Response.json({ ok: true, checkedTables: checks.length }, { headers: noStoreHeaders });
}
