import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

const activeBookingStatuses = ['PENDING', 'CONFIRMED', 'RENTING', 'PAID', 'ACTIVE'];
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: NextRequest) {
  const productId = request.nextUrl.searchParams.get('productId');
  const startDate = request.nextUrl.searchParams.get('startDate');
  const endDate = request.nextUrl.searchParams.get('endDate');
  if (!productId || !startDate || !endDate || !datePattern.test(startDate) || !datePattern.test(endDate) || startDate > endDate) {
    return NextResponse.json({ error: 'Invalid availability range.' }, { status: 400 });
  }

  const supabase = createAdminClient();
  const [{ data: product, error: productError }, { data: blocked, error: blockedError }, { data: bookings, error: bookingsError }] = await Promise.all([
    supabase.from('products').select('id,status,inventory_count').eq('id', productId).maybeSingle(),
    supabase.from('blocked_dates').select('date').gte('date', startDate).lte('date', endDate),
    supabase.from('bookings').select('product_id,start_date,end_date').in('status', activeBookingStatuses).lte('start_date', endDate).gte('end_date', startDate),
  ]);
  if (productError || blockedError || bookingsError) {
    return NextResponse.json({ error: 'Availability is temporarily unavailable.' }, { status: 503 });
  }
  if (!product) return NextResponse.json({ reservedDates: [] }, { headers: { 'Cache-Control': 'no-store' } });

  const first = Date.parse(`${startDate}T00:00:00.000Z`);
  const last = Date.parse(`${endDate}T00:00:00.000Z`);
  if (product.status !== 'ACTIVE' || Number(product.inventory_count) <= 0) {
    const reservedDates: string[] = [];
    for (let time = first; time <= last; time += 24 * 60 * 60 * 1000) {
      reservedDates.push(new Date(time).toISOString().slice(0, 10));
    }
    return NextResponse.json({ reservedDates }, { headers: { 'Cache-Control': 'no-store' } });
  }

  const reservedDates = new Set((blocked ?? []).map((row) => row.date));
  const productBookings = (bookings ?? []).filter((booking) => booking.product_id === productId);
  const capacity = Number(product.inventory_count);
  for (let time = first; time <= last; time += 24 * 60 * 60 * 1000) {
    const day = new Date(time).toISOString().slice(0, 10);
    const bookedCount = productBookings.filter((booking) => booking.start_date <= day && booking.end_date >= day).length;
    if (bookedCount >= capacity) reservedDates.add(day);
  }

  return NextResponse.json({ reservedDates: [...reservedDates] }, { headers: { 'Cache-Control': 'no-store' } });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
