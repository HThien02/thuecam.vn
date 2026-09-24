import { cookies } from 'next/headers';
import crypto from 'crypto';

const SESSION_COOKIE_NAME = 'thuecam_admin_session';
const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || 'thuecam_admin_super_secret_session_key_2026_safe';
const SESSION_DURATION_SECONDS = 60 * 60 * 24; // 24 hours

export interface AdminSession {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

/**
 * Sign a payload with HMAC-SHA256
 */
export function signSession(payload: Omit<AdminSession, 'iat' | 'exp'>): string {
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
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedData, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', SESSION_SECRET)
    .update(encodedData)
    .digest('base64url');

  // Constant-time comparison to prevent timing attacks
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature))) {
    return null;
  }

  try {
    const sessionData: AdminSession = JSON.parse(
      Buffer.from(encodedData, 'base64url').toString('utf-8')
    );
    const now = Math.floor(Date.now() / 1000);
    if (sessionData.exp < now) {
      return null; // Expired
    }
    return sessionData;
  } catch {
    return null;
  }
}

/**
 * Set session cookie in Server Action or Route Handler
 */
export async function setAdminSessionCookie(sessionPayload: { email: string }): Promise<void> {
  const token = signSession({ email: sessionPayload.email, role: 'admin' });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_SECONDS,
  });
}

/**
 * Clear session cookie (Logout)
 */
export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });
}

/**
 * Get current admin session from cookies (Server Component / Route Handler)
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  return verifySession(token);
}

export { SESSION_COOKIE_NAME };
