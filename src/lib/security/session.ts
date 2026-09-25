import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'thuecam_admin_session';
const SUPABASE_JWT_SECRET = process.env.SUPABASE_JWT_SECRET;
const SESSION_SECRET = SUPABASE_JWT_SECRET
  ? crypto.createHash('sha256').update(`thuecam-admin-session-v1:${SUPABASE_JWT_SECRET}`).digest('hex')
  : undefined;
const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 hours

export interface AdminSession {
  userId: string;
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

/**
 * Sign a payload with HMAC-SHA256
 */
export function signSession(payload: Omit<AdminSession, 'iat' | 'exp'>): string {
  if (!SESSION_SECRET) {
    throw new Error('SUPABASE_JWT_SECRET is required to sign admin sessions.');
  }
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + SESSION_DURATION_SECONDS;
  const sessionData: AdminSession = { ...payload, iat, exp };

  const encodedData = Buffer.from(JSON.stringify(sessionData)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedData)
    .digest('base64url');

  return `${encodedData}.${signature}`;
}

/**
 * Verify HMAC-SHA256 session token
 */
export function verifySession(token: string | undefined | null): AdminSession | null {
  if (!token || !SESSION_SECRET) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedData)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  const suppliedSignature = Buffer.from(signature);
  const expectedSignatureBuffer = Buffer.from(expectedSignature);
  if (suppliedSignature.length !== expectedSignatureBuffer.length || !crypto.timingSafeEqual(suppliedSignature, expectedSignatureBuffer)) {
    return null;
  }

  try {
    const sessionData: AdminSession = JSON.parse(
      Buffer.from(encodedData, 'base64url').toString('utf-8')
    );
    const now = Math.floor(Date.now() / 1000);
    if (
      sessionData.role !== 'admin' ||
      typeof sessionData.userId !== 'string' ||
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(sessionData.userId) ||
      typeof sessionData.email !== 'string' ||
      typeof sessionData.iat !== 'number' ||
      typeof sessionData.exp !== 'number' ||
      sessionData.exp <= now ||
      sessionData.iat > now
    ) {
      return null;
    }
    return sessionData;
  } catch {
    return null;
  }
}

/**
 * Set session cookie in Server Action or Route Handler
 */
export async function setAdminSessionCookie(
  sessionPayload: { userId: string; email: string },
  options: { secure: boolean } = { secure: process.env.NODE_ENV === 'production' }
): Promise<void> {
  const token = signSession({ userId: sessionPayload.userId, email: sessionPayload.email, role: 'admin' });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: options.secure,
    sameSite: options.secure ? 'none' : 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearAdminSessionCookie(
  options: { secure: boolean } = { secure: process.env.NODE_ENV === 'production' }
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: options.secure,
    sameSite: options.secure ? 'none' : 'lax',
    path: '/',
    maxAge: 0,
  });
}

export { SESSION_COOKIE_NAME };
