import type { ApplicationStatus } from '@/lib/consignment';

export const PLACEHOLDER_PATTERN = /\[\[[^\]]+\]\]/g;
export const PARTNER_LOGIN_PATH = '/doi-tac/dang-nhap';
export const MEETING_POINT = 'ETown, 364 Cộng Hòa, P. 13, Q. Tân Bình, TP.HCM';

export interface EmailTemplateContext {
  name: string;
  deviceName: string;
  loginEmail: string;
  loginUrl: string;
}

export interface ConsignmentEmailTemplate {
  id: string;
  label: string;
  /** Application status suggested when sending this template. */
  suggestedStatus?: ApplicationStatus;
  subject: (ctx: EmailTemplateContext) => string;
  body: (ctx: EmailTemplateContext) => string;
}

const signature = `Trân trọng,
Đội ngũ THUECAM.VN
Hotline/Zalo: 0932 501 411
Điểm hẹn: ${MEETING_POINT}`;

export const CONSIGNMENT_EMAIL_TEMPLATES: ConsignmentEmailTemplate[] = [
  {
    id: 'contacted',
    label: 'Đã tiếp nhận – sẽ liên hệ',
    suggestedStatus: 'CONTACTED',
    subject: (ctx) => `THUECAM đang xem xét đơn ký gửi ${ctx.deviceName}`,
    body: (ctx) => `Xin chào ${ctx.name},

Cảm ơn bạn đã đăng ký ký gửi thiết bị ${ctx.deviceName} cho THUECAM.VN. Chúng tôi đã xem đơn và sẽ liên hệ với bạn qua điện thoại/Zalo để trao đổi thêm về tình trạng máy, tỷ lệ chia doanh thu và quy trình ký gửi.

Nếu bạn có thêm hình ảnh hoặc thông tin về thiết bị, vui lòng trả lời trực tiếp email này.

${signature}`,
  },
  {
    id: 'meeting',
    label: 'Hẹn giao máy & ký hợp đồng',
    suggestedStatus: 'CONTACTED',
    subject: (ctx) => `Lịch hẹn giao máy & ký hợp đồng ký gửi – ${ctx.deviceName}`,
    body: (ctx) => `Xin chào ${ctx.name},

THUECAM xác nhận lịch hẹn kiểm tra thiết bị và ký hợp đồng ký gửi cho ${ctx.deviceName}:

- Thời gian: [[Điền ngày giờ hẹn, VD: 14:00 thứ Bảy 03/10/2026]]
- Địa điểm: ${MEETING_POINT}
- Người tiếp nhận: [[Điền tên nhân viên & số điện thoại]]

Vui lòng mang theo:
1. Thiết bị kèm đầy đủ phụ kiện, sạc, hộp (nếu có)
2. CCCD/CMND bản gốc để đối chiếu khi ký hợp đồng
3. Hoá đơn hoặc giấy tờ chứng minh nguồn gốc máy (nếu có)

Tại buổi hẹn, hai bên sẽ kiểm tra tình trạng máy, chụp ảnh lưu hồ sơ và ký hợp đồng ký gửi. Nếu cần đổi lịch, vui lòng phản hồi email này hoặc nhắn Zalo trước ít nhất 2 giờ.

${signature}`,
  },
  {
    id: 'approved',
    label: 'Chấp nhận đơn ký gửi',
    suggestedStatus: 'APPROVED',
    subject: (ctx) => `Đơn ký gửi ${ctx.deviceName} đã được duyệt`,
    body: (ctx) => `Xin chào ${ctx.name},

Chúc mừng! Đơn ký gửi thiết bị ${ctx.deviceName} của bạn đã được THUECAM.VN chấp nhận.

Bước tiếp theo: THUECAM sẽ hẹn bạn giao máy và ký hợp đồng ký gửi. Sau khi hoàn tất, bạn sẽ nhận được tài khoản đối tác để theo dõi lịch thuê và doanh thu của máy theo thời gian thực.

${signature}`,
  },
  {
    id: 'account',
    label: 'Gửi tài khoản đối tác',
    subject: () => 'Tài khoản đối tác ký gửi THUECAM của bạn',
    body: (ctx) => `Xin chào ${ctx.name},

Tài khoản đối tác ký gửi của bạn đã sẵn sàng. Bạn có thể đăng nhập để theo dõi máy đang được thuê, lịch thuê sắp tới và doanh thu được chia.

- Trang đăng nhập: ${ctx.loginUrl}
- Email đăng nhập: ${ctx.loginEmail}
- Mật khẩu: [[Điền mật khẩu hoặc xoá dòng này nếu đã gửi riêng]]

Vì lý do bảo mật, vui lòng không chia sẻ thông tin đăng nhập cho người khác.

${signature}`,
  },
  {
    id: 'rejected',
    label: 'Từ chối đơn ký gửi',
    suggestedStatus: 'REJECTED',
    subject: (ctx) => `Phản hồi về đơn ký gửi ${ctx.deviceName}`,
    body: (ctx) => `Xin chào ${ctx.name},

Cảm ơn bạn đã quan tâm đến chương trình ký gửi cho thuê của THUECAM.VN. Sau khi xem xét, rất tiếc chúng tôi chưa thể tiếp nhận thiết bị ${ctx.deviceName} ở thời điểm này.

Lý do: [[Điền lý do, VD: dòng máy hiện đã đủ số lượng / tình trạng máy chưa đáp ứng tiêu chuẩn cho thuê]]

Chúng tôi sẽ lưu thông tin của bạn và chủ động liên hệ nếu có nhu cầu phù hợp trong tương lai. Rất mong có dịp hợp tác cùng bạn.

${signature}`,
  },
  {
    id: 'custom',
    label: 'Tự soạn nội dung',
    subject: () => '',
    body: (ctx) => `Xin chào ${ctx.name},

[[Nội dung email]]

${signature}`,
  },
];

export function findTemplate(id: string) {
  return CONSIGNMENT_EMAIL_TEMPLATES.find((template) => template.id === id);
}
