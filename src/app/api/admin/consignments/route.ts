import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/security/admin-auth';
import { isValidEmail, sanitizeInput } from '@/lib/security/validation';
import { createAdminClient } from '@/lib/supabase/admin';
import { isEmailConfigured, sendPartnerEmail } from '@/lib/consignment-email';

const APPLICATION_STATUSES = new Set(['PENDING', 'CONTACTED', 'APPROVED', 'REJECTED']);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function fail(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status, headers: { 'Cache-Control': 'no-store' } });
}

function str(value: unknown, max: number) {
  return typeof value === 'string' ? sanitizeInput(value).slice(0, max) : '';
}

function sharePercent(value: unknown) {
  const num = Number(value);
  return Number.isFinite(num) && num >= 0 && num <= 100 ? Math.round(num * 100) / 100 : null;
}

export async function POST(request: NextRequest) {
  if (!(await getAdminSession())) return fail('Unauthorized', 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return fail('Dữ liệu không hợp lệ.');
  }

  const supabase = createAdminClient();
  const action = body.action;

  if (action === 'update_application') {
    const id = str(body.id, 100);
    const status = str(body.status, 20);
    if (!id || !APPLICATION_STATUSES.has(status)) return fail('Trạng thái đơn không hợp lệ.');
    const { error } = await supabase
      .from('consignment_applications')
      .update({ status, admin_note: str(body.adminNote, 2000), updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return fail('Không thể cập nhật đơn ký gửi.', 500);
    return NextResponse.json({ success: true });
  }

  if (action === 'send_email') {
    if (!isEmailConfigured()) {
      return fail('Chưa cấu hình email gửi đi. Hãy đặt biến môi trường GMAIL_APP_PASSWORD rồi thử lại.', 503);
    }

    const toEmail = str(body.to, 200).toLowerCase();
    const subject = str(body.subject, 300);
    const emailBody = typeof body.body === 'string' ? body.body.slice(0, 8000) : '';
    const templateId = str(body.templateId, 50) || 'custom';
    const applicationId = str(body.applicationId, 100) || null;
    const partnerUserId = UUID_PATTERN.test(str(body.partnerUserId, 64)) ? str(body.partnerUserId, 64) : null;
    const nextStatus = str(body.updateStatus, 20);

    if (!isValidEmail(toEmail)) return fail('Email người nhận không hợp lệ.');
    if (subject.trim().length < 3) return fail('Vui lòng nhập tiêu đề email (tối thiểu 3 ký tự).');
    if (emailBody.trim().length < 10) return fail('Nội dung email quá ngắn.');

    let sendError = '';
    try {
      await sendPartnerEmail({ to: toEmail, subject, body: emailBody });
    } catch (error) {
      sendError = error instanceof Error ? error.message : 'UNKNOWN';
    }

    await supabase.from('consignment_email_logs').insert({
      application_id: applicationId,
      partner_user_id: partnerUserId,
      to_email: toEmail,
      template_id: templateId,
      subject,
      body: emailBody,
      status: sendError ? 'FAILED' : 'SENT',
      error: sendError,
    });

    if (sendError) return fail('Không gửi được email. Kiểm tra lại cấu hình Gmail và thử lại.', 502);

    if (applicationId && APPLICATION_STATUSES.has(nextStatus)) {
      await supabase
        .from('consignment_applications')
        .update({ status: nextStatus, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
    }

    return NextResponse.json({ success: true });
  }

  if (action === 'delete_application') {
    const id = str(body.id, 100);
    if (!id) return fail('Thiếu mã đơn.');
    const { error } = await supabase.from('consignment_applications').delete().eq('id', id);
    if (error) return fail('Không thể xoá đơn ký gửi.', 500);
    return NextResponse.json({ success: true });
  }

  if (action === 'create_partner') {
    const email = str(body.email, 200).toLowerCase();
    const password = typeof body.password === 'string' ? body.password : '';
    const fullName = str(body.fullName, 100);
    const share = sharePercent(body.revenueSharePercent);
    const applicationId = str(body.applicationId, 100) || null;
    if (!isValidEmail(email)) return fail('Email đăng nhập không hợp lệ.');
    if (password.length < 8 || password.length > 128) return fail('Mật khẩu phải có từ 8 đến 128 ký tự.');
    if (fullName.length < 2) return fail('Vui lòng nhập tên đối tác.');
    if (share === null) return fail('Tỷ lệ chia doanh thu phải từ 0 đến 100%.');

    const { data: created, error: createError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { role: 'consignment_partner', full_name: fullName },
    });
    if (createError || !created.user) {
      const exists = createError?.message?.toLowerCase().includes('already');
      return fail(exists ? 'Email này đã có tài khoản. Hãy dùng email khác.' : 'Không thể tạo tài khoản đăng nhập.', exists ? 409 : 500);
    }

    const { error: partnerError } = await supabase.from('consignment_partners').insert({
      user_id: created.user.id,
      full_name: fullName,
      phone: str(body.phone, 20),
      email,
      revenue_share_percent: share,
      application_id: applicationId,
      note: str(body.note, 2000),
    });
    if (partnerError) {
      await supabase.auth.admin.deleteUser(created.user.id);
      return fail('Không thể lưu hồ sơ đối tác. Kiểm tra lại migration 08_consignment.sql.', 500);
    }

    if (applicationId) {
      await supabase
        .from('consignment_applications')
        .update({ status: 'APPROVED', partner_user_id: created.user.id, updated_at: new Date().toISOString() })
        .eq('id', applicationId);
    }
    return NextResponse.json({ success: true, userId: created.user.id }, { status: 201 });
  }

  if (action === 'update_partner') {
    const userId = str(body.userId, 64);
    if (!UUID_PATTERN.test(userId)) return fail('Mã đối tác không hợp lệ.');
    const share = sharePercent(body.revenueSharePercent);
    if (share === null) return fail('Tỷ lệ chia doanh thu phải từ 0 đến 100%.');

    const { error } = await supabase
      .from('consignment_partners')
      .update({
        full_name: str(body.fullName, 100),
        phone: str(body.phone, 20),
        revenue_share_percent: share,
        active: Boolean(body.active),
        note: str(body.note, 2000),
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId);
    if (error) return fail('Không thể cập nhật đối tác.', 500);

    const password = typeof body.newPassword === 'string' ? body.newPassword : '';
    if (password) {
      if (password.length < 8 || password.length > 128) return fail('Mật khẩu mới phải có từ 8 đến 128 ký tự.');
      const { error: pwError } = await supabase.auth.admin.updateUserById(userId, { password });
      if (pwError) return fail('Đã lưu thông tin nhưng không đổi được mật khẩu.', 500);
    }

    if (Array.isArray(body.unitIds)) {
      const unitIds = [...new Set(body.unitIds.filter((id): id is string => typeof id === 'string' && id.length > 0 && id.length <= 100))];
      const { error: clearError } = await supabase.from('camera_units').update({ owner_partner_id: null }).eq('owner_partner_id', userId);
      if (clearError) return fail('Không thể cập nhật máy ký gửi.', 500);
      if (unitIds.length) {
        const { error: assignError } = await supabase.from('camera_units').update({ owner_partner_id: userId }).in('id', unitIds);
        if (assignError) return fail('Không thể gán máy cho đối tác.', 500);
      }
    }
    return NextResponse.json({ success: true });
  }

  if (action === 'delete_partner') {
    const userId = str(body.userId, 64);
    if (!UUID_PATTERN.test(userId)) return fail('Mã đối tác không hợp lệ.');
    await supabase.from('camera_units').update({ owner_partner_id: null }).eq('owner_partner_id', userId);
    const { error } = await supabase.auth.admin.deleteUser(userId);
    if (error) return fail('Không thể xoá tài khoản đối tác.', 500);
    return NextResponse.json({ success: true });
  }

  return fail('Hành động không được hỗ trợ.');
}

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
