import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { setPartnerSessionCookie } from '@/lib/security/partner-session';
import { isValidEmail } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

const INVALID = 'Email hoặc mật khẩu không chính xác.';

export async function POST(request: NextRequest) {
  const limited = enforceApiRateLimit(request, { limit: 5, windowMs: 60_000 });
  if (limited) return limited;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'Dịch vụ đăng nhập chưa được cấu hình.' }, { status: 503 });
  }

  let email = '';
  let password = '';
  try {
    const body = await request.json();
    email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    password = typeof body.password === 'string' ? body.password : '';
  } catch {
    return NextResponse.json({ error: 'Dữ liệu không hợp lệ.' }, { status: 400 });
  }
  if (!isValidEmail(email) || password.length < 1 || password.length > 256) {
    return NextResponse.json({ error: 'Vui lòng nhập email và mật khẩu hợp lệ.' }, { status: 400 });
  }

  try {
    const authClient = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const { data, error } = await authClient.auth.signInWithPassword({ email, password });
    if (error || !data.user?.id) return NextResponse.json({ error: INVALID }, { status: 401 });

    const { data: partner } = await createAdminClient()
      .from('consignment_partners')
      .select('user_id, active')
      .eq('user_id', data.user.id)
      .maybeSingle();
    if (!partner) return NextResponse.json({ error: INVALID }, { status: 401 });
    if (!partner.active) return NextResponse.json({ error: 'Tài khoản ký gửi đã bị tạm khoá. Vui lòng liên hệ THUECAM.' }, { status: 403 });

    const forwardedProto = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
    const secure = forwardedProto === 'https' || request.nextUrl.protocol === 'https:';
    await setPartnerSessionCookie({ userId: data.user.id, email }, secure);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Đã có lỗi xảy ra khi đăng nhập.' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
