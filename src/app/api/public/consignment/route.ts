import { NextRequest, NextResponse } from 'next/server';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { isValidEmail, isValidName, isValidVietnamPhone, sanitizeInput } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

function text(value: unknown, max: number) {
  return typeof value === 'string' ? sanitizeInput(value).slice(0, max) : '';
}

export async function POST(request: NextRequest) {
  const limited = enforceApiRateLimit(request, { limit: 3, windowMs: 10 * 60_000 });
  if (limited) return limited;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }

  // Honeypot field: real users never fill it.
  if (typeof body.website === 'string' && body.website.length > 0) {
    return NextResponse.json({ success: true });
  }

  const fullName = text(body.fullName, 100);
  const phone = text(body.phone, 20).replace(/[\s.-]/g, '');
  const email = text(body.email, 200).toLowerCase();
  const deviceName = text(body.deviceName, 150);
  const quantity = Number(body.quantity ?? 1);
  const purchaseYear = body.purchaseYear ? Number(body.purchaseYear) : null;

  if (!isValidName(fullName)) return NextResponse.json({ error: 'Vui lòng nhập họ tên (tối thiểu 2 ký tự).' }, { status: 400 });
  if (!isValidVietnamPhone(phone)) return NextResponse.json({ error: 'Số điện thoại phải gồm 10 số, bắt đầu bằng 0.' }, { status: 400 });
  if (email && !isValidEmail(email)) return NextResponse.json({ error: 'Email không đúng định dạng.' }, { status: 400 });
  if (deviceName.length < 2) return NextResponse.json({ error: 'Vui lòng nhập tên thiết bị muốn ký gửi.' }, { status: 400 });
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 50) return NextResponse.json({ error: 'Số lượng phải từ 1 đến 50.' }, { status: 400 });
  if (purchaseYear !== null && (!Number.isInteger(purchaseYear) || purchaseYear < 2000 || purchaseYear > 2100)) {
    return NextResponse.json({ error: 'Năm mua không hợp lệ.' }, { status: 400 });
  }

  try {
    const { error } = await createAdminClient().from('consignment_applications').insert({
      full_name: fullName,
      phone,
      email: email || null,
      city: text(body.city, 100),
      device_name: deviceName,
      device_brand: text(body.deviceBrand, 100),
      device_condition: text(body.deviceCondition, 100),
      quantity,
      purchase_year: purchaseYear,
      note: text(body.note, 2000),
    });
    if (error) throw error;
  } catch {
    return NextResponse.json({ error: 'Không thể gửi đơn lúc này. Vui lòng thử lại sau.' }, { status: 503 });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
