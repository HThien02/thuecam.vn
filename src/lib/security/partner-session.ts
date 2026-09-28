import crypto from 'crypto';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

export const PARTNER_SESSION_COOKIE_NAME = 'thuecam_partner_session';
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 7;
const JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SESSION_SECRET = JWT_SECRET
  ? crypto.createHash('sha256').update(`thuecam-partner-session-v1:${JWT_SECRET}`).digest('hex')
  : undefined;
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export interface PartnerSession {
  userId: string;
  email: string;
  role: 'partner';
  iat: number;
  exp: number;
}

function sign(data: string) {
  return crypto.createHmac('sha256', SESSION_SECRET as string).update(data).digest('base64url');
}

function verifyPartnerToken(token: string | undefined): PartnerSession | null {
  if (!token || !SESSION_SECRET) return null;
  const [encoded, signature] = token.split('.');
  if (!encoded || !signature) return null;
  const expected = Buffer.from(sign(encoded));
  const supplied = Buffer.from(signature);
  if (expected.length !== supplied.length || !crypto.timingSafeEqual(expected, supplied)) return null;

  try {
    const session = JSON.parse(Buffer.from(encoded, 'base64url').toString('utf-8')) as PartnerSession;
    const now = Math.floor(Date.now() / 1000);
    if (session.role !== 'partner' || !UUID_PATTERN.test(session.userId) || session.exp <= now || session.iat > now) return null;
    return session;
  } catch {
    return null;
  }
}

export async function setPartnerSessionCookie(payload: { userId: string; email: string }, secure: boolean) {
  if (!SESSION_SECRET) throw new Error('SUPABASE_JWT_SECRET is required to sign partner sessions.');
  const iat = Math.floor(Date.now() / 1000);
  const session: PartnerSession = { ...payload, role: 'partner', iat, exp: iat + SESSION_DURATION_SECONDS };
  const encoded = Buffer.from(JSON.stringify(session)).toString('base64url');
  const cookieStore = await cookies();
  cookieStore.set(PARTNER_SESSION_COOKIE_NAME, `${encoded}.${sign(encoded)}`, {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearPartnerSessionCookie(secure: boolean) {
  const cookieStore = await cookies();
  cookieStore.set(PARTNER_SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  });
}

/** Returns the session only if the partner account still exists and is active. */
export async function getPartnerSession() {
  const cookieStore = await cookies();
  const session = verifyPartnerToken(cookieStore.get(PARTNER_SESSION_COOKIE_NAME)?.value);
  if (!session) return null;
  try {
    const { data } = await createAdminClient()
      .from('consignment_partners')
      .select('user_id, active')
      .eq('user_id', session.userId)
      .maybeSingle();
    return data?.active ? session : null;
  } catch {
    return null;
  }
}
