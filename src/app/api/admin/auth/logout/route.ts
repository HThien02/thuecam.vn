import { NextRequest, NextResponse } from 'next/server';
import { clearAdminSessionCookie } from '@/lib/security/session';

export async function POST(request: NextRequest) {
  const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
  const secureRequest = forwardedProtocol === 'https' || request.nextUrl.protocol === 'https:';
  await clearAdminSessionCookie({ secure: secureRequest });
  return NextResponse.json({
    success: true,
    message: 'Đã đăng xuất phiên quản trị.',
  });
}
