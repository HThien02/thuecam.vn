import nodemailer from 'nodemailer';
import { bookingNotificationEmail } from '@/lib/booking-email';

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function linkify(escaped: string) {
  return escaped.replace(/https?:\/\/[^\s<]+/g, (url) => `<a href="${url}" style="color:#0284c7;font-weight:700">${url}</a>`);
}

export function isEmailConfigured() {
  return Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
}

function createTransport() {
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  if (!appPassword) return null;
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: bookingNotificationEmail, pass: appPassword },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export function renderPartnerEmailHtml(subject: string, body: string) {
  const paragraphs = body
    .trim()
    .split(/\n{2,}/)
    .map((block) => `<p style="margin:0 0 14px;line-height:1.65">${linkify(escapeHtml(block)).replace(/\n/g, '<br>')}</p>`)
    .join('');

  return `<!doctype html><html lang="vi"><body style="margin:0;background:#f1f5f9;padding:24px 12px;font-family:Arial,Helvetica,sans-serif;color:#0f172a">
<table role="presentation" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin:auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0">
<tr><td style="background:#0f172a;padding:20px 28px"><span style="color:#ffffff;font-size:20px;font-weight:900;letter-spacing:0.5px">THUECAM<span style="color:#22d3ee">.VN</span></span><br><span style="color:#94a3b8;font-size:12px">Chương trình ký gửi cho thuê</span></td></tr>
<tr><td style="padding:28px"><h1 style="margin:0 0 18px;font-size:20px;color:#0f172a">${escapeHtml(subject)}</h1>${paragraphs}</td></tr>
<tr><td style="padding:16px 28px;background:#f8fafc;border-top:1px solid #e2e8f0;color:#64748b;font-size:12px">Email được gửi từ THUECAM.VN. Bạn có thể trả lời trực tiếp email này để liên hệ với chúng tôi.</td></tr>
</table></body></html>`;
}

export async function sendPartnerEmail({ to, subject, body }: { to: string; subject: string; body: string }) {
  const transport = createTransport();
  if (!transport) throw new Error('EMAIL_NOT_CONFIGURED');
  await transport.sendMail({
    from: { name: 'THUECAM.VN Ký Gửi', address: bookingNotificationEmail },
    replyTo: bookingNotificationEmail,
    to,
    subject,
    text: body,
    html: renderPartnerEmailHtml(subject, body),
  });
}

export async function sendApplicationReceivedEmails(application: {
  fullName: string;
  email: string;
  phone: string;
  deviceName: string;
  quantity: number;
  note: string;
}) {
  const transport = createTransport();
  if (!transport) return;

  const customerBody = `Xin chào ${application.fullName},

THUECAM.VN đã nhận được đơn đăng ký ký gửi thiết bị ${application.deviceName} (số lượng: ${application.quantity}) của bạn.

Đơn đang ở trạng thái Chờ duyệt. Nhân viên THUECAM sẽ liên hệ với bạn trong vòng 24 giờ làm việc qua số ${application.phone} hoặc email này để trao đổi về tình trạng máy và tỷ lệ chia doanh thu.

Mọi thông báo tiếp theo (kết quả duyệt, lịch hẹn giao máy, tài khoản đối tác) sẽ được gửi đến email này.

Trân trọng,
Đội ngũ THUECAM.VN`;

  const results = await Promise.allSettled([
    sendPartnerEmail({ to: application.email, subject: 'Đã nhận đơn đăng ký ký gửi | THUECAM', body: customerBody }),
    transport.sendMail({
      from: { name: 'THUECAM Ký Gửi', address: bookingNotificationEmail },
      to: bookingNotificationEmail,
      replyTo: application.email,
      subject: `Đơn ký gửi mới: ${application.deviceName} – ${application.fullName}`,
      text: [
        `Khách: ${application.fullName}`,
        `Điện thoại: ${application.phone}`,
        `Email: ${application.email}`,
        `Thiết bị: ${application.deviceName} x${application.quantity}`,
        `Ghi chú: ${application.note || 'Không có'}`,
        'Duyệt tại /admin/consignments',
      ].join('\n'),
    }),
  ]);

  if (results.some((result) => result.status === 'rejected')) {
    console.error('[consignment-email] Could not send one or more application emails.');
  }
}
