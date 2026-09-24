import { NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/security/session';

export async function POST() {
  await clearAdminSessionCookie();
  return NextResponse.json({
    success: true,
    message: 'Đã đăng xuất phiên quản trị.',
  });
}
