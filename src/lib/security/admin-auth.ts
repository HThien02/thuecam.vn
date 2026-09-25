import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { SESSION_COOKIE_NAME, verifySession } from '@/lib/security/session';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = verifySession(cookieStore.get(SESSION_COOKIE_NAME)?.value);
  if (!session) return null;

  try {
    const { data, error } = await createAdminClient()
      .from('admin_users')
      .select('user_id')
      .eq('user_id', session.userId)
      .maybeSingle();

    if (error || !data) return null;
    return session;
  } catch {
    return null;
  }
}

export type { AdminSession } from '@/lib/security/session';
