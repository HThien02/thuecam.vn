import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { setAdminSessionCookie } from '@/lib/security/session';
import { isValidEmail } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const rateLimitResponse = enforceApiRateLimit(request, { limit: 5, windowMs: 60_000 });
  if (rateLimitResponse) return rateLimitResponse;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json(
      { error: 'Dịch vụ đăng nhập chưa được cấu hình. Vui lòng thử lại sau.' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (!isValidEmail(email) || password.length < 1 || password.length > 256) {
      return NextResponse.json({ error: 'Vui lòng cung cấp email và mật khẩu hợp lệ.' }, { status: 400 });
    }

    const authClient = createClient(supabaseUrl, supabaseKey, {
      auth: { autoRefreshToken: false, persistSession: false, detectSessionInUrl: false },
    });
    const { data: authData, error: authError } = await authClient.auth.signInWithPassword({ email, password });
    if (authError || !authData.user?.id || !authData.user.email) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác.' }, { status: 401 });
    }

    const { data: membership, error: membershipError } = await createAdminClient()
      .from('admin_users')
      .select('user_id')
      .eq('user_id', authData.user.id)
      .maybeSingle();

    if (membershipError) {
      return NextResponse.json(
        { error: 'Không thể xác minh quyền quản trị. Vui lòng thử lại sau.' },
        { status: 503 }
      );
    }
    if (!membership) {
      return NextResponse.json({ error: 'Email hoặc mật khẩu không chính xác.' }, { status: 401 });
    }

    const normalizedEmail = authData.user.email.trim().toLowerCase();
    const forwardedProtocol = request.headers.get('x-forwarded-proto')?.split(',')[0].trim();
    const secureRequest = forwardedProtocol === 'https' || request.nextUrl.protocol === 'https:';
    await setAdminSessionCookie(
      { userId: authData.user.id, email: normalizedEmail },
      { secure: secureRequest }
    );
    return NextResponse.json({
      success: true,
      message: 'Đăng nhập thành công',
      user: { email: normalizedEmail, role: 'admin' },
    });
  } catch {
    return NextResponse.json({ error: 'Đã có lỗi xảy ra trong quá trình xác thực.' }, { status: 500 });
  }
}
