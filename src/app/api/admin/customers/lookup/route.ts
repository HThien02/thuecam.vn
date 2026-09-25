import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  const limited = enforceApiRateLimit(request, { limit: 30, windowMs: 60_000 });
  if (limited) return limited;
  if (!(await getAdminSession())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: { 'Cache-Control': 'no-store' } });
  }

  const customerId = request.nextUrl.searchParams.get('cccd')?.trim() ?? '';
  if (!/^(\d{9}|\d{12})$/.test(customerId)) {
    return NextResponse.json({ error: 'CCCD/CMND phải gồm 9 hoặc 12 chữ số.' }, { status: 400, headers: { 'Cache-Control': 'no-store' } });
  }

  const { data, count, error } = await createAdminClient()
    .from('bookings')
    .select('booking_code,customer_name,customer_phone,product_name,start_date,end_date,total_price,status,created_at', { count: 'exact' })
    .eq('customer_cccd', customerId)
    .order('created_at', { ascending: false })
    .limit(8);

  if (error) {
    return NextResponse.json({ error: 'Không thể tra cứu lịch sử khách hàng.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
  }

  const history = data ?? [];
  return NextResponse.json({
    exists: (count ?? history.length) > 0,
    bookingCount: count ?? history.length,
    customer: history[0] ? { name: history[0].customer_name, phone: history[0].customer_phone } : null,
    history,
  }, { headers: { 'Cache-Control': 'no-store' } });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
