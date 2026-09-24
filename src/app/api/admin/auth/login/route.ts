import { createHash, timingSafeEqual } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { setAdminSessionCookie } from '@/lib/security/session';
import { isValidEmail } from '@/lib/security/validation';

export async function POST(request: NextRequest) {
  const rateLimitResponse = enforceApiRateLimit(request, { limit: 5, windowMs: 60_000 });
  if (rateLimitResponse) return rateLimitResponse;

  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;
  if (!adminEmail || !adminPassword || adminPassword.length < 16 || !sessionSecret || sessionSecret.length < 32) {
    return NextResponse.json(
      { error: 'Admin login is not configured. Set the required server environment variables.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!isValidEmail(email) || password.length < 1 || password.length > 256) {
      return NextResponse.json({ error: 'Vui lòng cung cấp email và mật khẩu hợp lệ.' }, { status: 400 });
    }

    const suppliedDigest = createHash('sha256').update(password).digest();
    const configuredDigest = createHash('sha256').update(adminPassword).digest();
    const isAuthorized = email === adminEmail && timingSafeEqual(suppliedDigest, configuredDigest);
    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Email hoặc mật khẩu không chính xác hoặc tài khoản không có quyền Admin.' },
        { status: 401 }
      );
    }

    await setAdminSessionCookie({ email });
    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: { email, role: 'admin' },
    });
  } catch {
    return NextResponse.json({ error: 'Đã có lỗi xảy ra trong quá trình xác thực.' }, { status: 500 });
  }
}
