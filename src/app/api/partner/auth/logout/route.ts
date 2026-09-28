import { NextRequest, NextResponse } from 'next/server';
import { clearPartnerSessionCookie } from '@/lib/security/partner-session';

export async function POST(request: NextRequest) {
  const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
  await clearPartnerSessionCookie(forwardedProto === 'https' || request.nextUrl.protocol === 'https:');
  return NextResponse.json({ success: true });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
