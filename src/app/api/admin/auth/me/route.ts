import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/session';

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      role: session.role,
      expiresAt: new Date(session.exp * 1000).toISOString(),
    },
  });
}
