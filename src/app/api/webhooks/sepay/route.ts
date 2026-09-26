import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Thanh toán trực tuyến đã được tắt. Yêu cầu thuê cần được shop xác nhận thủ công.' },
    { status: 410, headers: { 'Cache-Control': 'no-store' } },
  );
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
