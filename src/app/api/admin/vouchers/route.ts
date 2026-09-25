import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';

function responseError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function validDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value));
}

export async function GET() {
  if (!(await getAdminSession())) return responseError('Unauthorized', 401);
  const { data, error } = await createAdminClient()
    .from('vouchers')
    .select('id,code,discount_type,discount_value,max_uses,used_count,starts_at,expires_at,is_active,created_at,updated_at')
    .order('created_at', { ascending: false })
    .limit(500);
  if (error) return responseError('Không thể tải danh sách voucher.', 500);
  return NextResponse.json(data ?? [], { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return responseError('Unauthorized', 401);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return responseError('Invalid origin.', 403);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return responseError('Invalid request body.');
  }
  const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : '';
  const discountType = body.discount_type;
  const discountValue = Number(body.discount_value);
  const startsAt = body.starts_at;
  const expiresAt = body.expires_at === '' || body.expires_at === null ? null : body.expires_at;
  const maxUses = body.max_uses === '' || body.max_uses === null ? null : Number(body.max_uses);
  if (!/^[A-Z0-9][A-Z0-9_-]{2,31}$/.test(code)) return responseError('Mã voucher gồm 3–32 ký tự A–Z, 0–9, gạch ngang hoặc gạch dưới.');
  if (discountType !== 'PERCENT' && discountType !== 'FIXED') return responseError('Loại giảm giá không hợp lệ.');
  if (!Number.isSafeInteger(discountValue) || discountValue <= 0 || (discountType === 'PERCENT' && discountValue > 100) || discountValue > 100_000_000) {
    return responseError('Giá trị giảm giá không hợp lệ.');
  }
  if (!validDate(startsAt) || (expiresAt !== null && !validDate(expiresAt))) return responseError('Thời gian hiệu lực không hợp lệ.');
  if (expiresAt && new Date(expiresAt).getTime() <= new Date(startsAt).getTime()) return responseError('Ngày hết hạn phải sau ngày bắt đầu.');
  if (maxUses !== null && (!Number.isSafeInteger(maxUses) || maxUses < 1 || maxUses > 1_000_000)) return responseError('Số lượt sử dụng tối đa không hợp lệ.');
  if (typeof body.is_active !== 'boolean') return responseError('Trạng thái voucher không hợp lệ.');
  const id = typeof body.id === 'string' && body.id.length <= 80 ? body.id : randomUUID();
  const record = {
    id,
    code,
    discount_type: discountType,
    discount_value: discountValue,
    max_uses: maxUses,
    starts_at: new Date(startsAt).toISOString(),
    expires_at: expiresAt ? new Date(expiresAt).toISOString() : null,
    is_active: body.is_active,
    updated_at: new Date().toISOString(),
  };
  const { data, error } = await createAdminClient().from('vouchers').upsert(record, { onConflict: 'id' }).select('*').single();
  if (error) return responseError('Không thể lưu voucher. Hãy kiểm tra mã có bị trùng hay không.', 400);
  return NextResponse.json(data, { headers: { 'Cache-Control': 'no-store' } });
}

export async function DELETE(request: NextRequest) {
  if (!(await getAdminSession())) return responseError('Unauthorized', 401);
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return responseError('Invalid origin.', 403);
  const id = request.nextUrl.searchParams.get('id');
  if (!id || id.length > 80) return responseError('Voucher không hợp lệ.');
  const supabase = createAdminClient();
  const { data: deletedVoucher, error } = await supabase
    .from('vouchers')
    .delete()
    .eq('id', id)
    .eq('used_count', 0)
    .select('id')
    .maybeSingle();
  if (error) return responseError('Không thể xóa voucher.', 400);
  if (!deletedVoucher) {
    const { data: voucher } = await supabase.from('vouchers').select('used_count').eq('id', id).maybeSingle();
    if (!voucher) return responseError('Không tìm thấy voucher.', 404);
    return responseError('Voucher đã được sử dụng; hãy tắt trạng thái thay vì xóa.', 409);
  }
  return new NextResponse(null, { status: 204, headers: { 'Cache-Control': 'no-store' } });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
