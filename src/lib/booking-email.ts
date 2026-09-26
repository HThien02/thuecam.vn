import nodemailer from 'nodemailer';

const bookingEmailAddress = 'hieuthien2k2@gmail.com';

export interface BookingEmailDetails {
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  productName: string;
  startDate: string;
  endDate: string;
  pickupTime: string;
  pickupMethod: 'STORE' | 'DELIVERY';
  deliveryAddress: string | null;
  totalDays: number;
  totalPrice: number;
  depositAmount: number;
  note: string | null;
  selectedAddons: { name: string; price: number }[];
  voucherCode: string | null;
  voucherDiscount: number;
}

export interface BookingEmailResult {
  customerEmailSent: boolean;
  shopEmailSent: boolean;
}

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  })[character] ?? character);
}

function formatVnd(amount: number) {
  return `${Math.round(amount).toLocaleString('vi-VN')}đ`;
}

function createDetailsHtml(booking: BookingEmailDetails) {
  const pickup = booking.pickupMethod === 'STORE'
    ? `Nhận tại ETown Tân Bình lúc ${booking.pickupTime}`
    : `Giao đến ${booking.deliveryAddress ?? ''} lúc ${booking.pickupTime}`;
  const rows: [string, string][] = [
    ['Mã yêu cầu', booking.bookingCode],
    ['Thiết bị', booking.productName],
    ['Thời gian thuê', `${booking.startDate} – ${booking.endDate} (${booking.totalDays} ngày)`],
    ['Nhận máy', pickup],
    ['Tiền thuê dự kiến', formatVnd(booking.totalPrice)],
    ...booking.selectedAddons.map((addon) => [`Phụ kiện · ${addon.name}`, formatVnd(addon.price)] as [string, string]),
    ...(booking.voucherCode ? [[`Voucher ${booking.voucherCode}`, `−${formatVnd(booking.voucherDiscount)}`] as [string, string]] : []),
    ['Tiền cọc tham khảo', formatVnd(booking.depositAmount)],
  ];

  return `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">${rows.map(([label, value]) => `<tr><td style="padding:10px 0;color:#64748b;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</td><td style="padding:10px 0;text-align:right;font-weight:700;color:#0f172a;border-bottom:1px solid #e2e8f0">${escapeHtml(value)}</td></tr>`).join('')}</table>`;
}

function createTransport() {
  const appPassword = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, '');
  if (!appPassword) return null;

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: { user: bookingEmailAddress, pass: appPassword },
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  });
}

export async function sendBookingNotifications(booking: BookingEmailDetails): Promise<BookingEmailResult> {
  const transport = createTransport();
  if (!transport) return { customerEmailSent: false, shopEmailSent: false };

  const detailsHtml = createDetailsHtml(booking);
  const safeName = escapeHtml(booking.customerName);
  const customerText = [
    `Xin chào ${booking.customerName},`,
    'THUECAM đã tiếp nhận yêu cầu thuê của bạn. Đây chưa phải xác nhận thanh toán; nhân viên sẽ liên hệ để xác nhận lịch, tiền thuê và tiền cọc trước khi bàn giao thiết bị.',
    `Mã yêu cầu: ${booking.bookingCode}`,
    `Thiết bị: ${booking.productName}`,
    `Lịch thuê: ${booking.startDate} – ${booking.endDate} (${booking.totalDays} ngày)`,
    `Giờ nhận: ${booking.pickupTime}`,
    `Tổng thuê dự kiến: ${formatVnd(booking.totalPrice)}`,
    ...booking.selectedAddons.map((addon) => `Phụ kiện: ${addon.name} · ${formatVnd(addon.price)}`),
    ...(booking.voucherCode ? [`Voucher: ${booking.voucherCode} · giảm ${formatVnd(booking.voucherDiscount)}`] : []),
    `Tiền cọc tham khảo: ${formatVnd(booking.depositAmount)}`,
    `Liên hệ: ${booking.customerPhone}`,
  ].join('\n');
  const shopText = [
    `Đơn thuê mới ${booking.bookingCode}`,
    `Khách hàng: ${booking.customerName}`,
    `Email: ${booking.customerEmail}`,
    `Điện thoại: ${booking.customerPhone}`,
    `Thiết bị: ${booking.productName}`,
    `Lịch thuê: ${booking.startDate} – ${booking.endDate} (${booking.totalDays} ngày)`,
    `Giờ nhận: ${booking.pickupTime}`,
    `Hình thức: ${booking.pickupMethod === 'STORE' ? 'Nhận tại ETown' : `Giao đến ${booking.deliveryAddress ?? ''}`}`,
    `Tổng thuê dự kiến: ${formatVnd(booking.totalPrice)}`,
    ...booking.selectedAddons.map((addon) => `Phụ kiện: ${addon.name} · ${formatVnd(addon.price)}`),
    ...(booking.voucherCode ? [`Voucher: ${booking.voucherCode} · giảm ${formatVnd(booking.voucherDiscount)}`] : []),
    `Tiền cọc tham khảo: ${formatVnd(booking.depositAmount)}`,
    `Ghi chú: ${booking.note ?? 'Không có'}`,
  ].join('\n');

  const [customerResult, shopResult] = await Promise.allSettled([
    transport.sendMail({
      from: { name: 'THUECAM.VN', address: bookingEmailAddress },
      to: booking.customerEmail,
      subject: `Đã nhận yêu cầu thuê ${booking.bookingCode} | THUECAM`,
      text: customerText,
      html: `<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;color:#0f172a"><h1 style="color:#0284c7">THUECAM đã nhận yêu cầu của bạn</h1><p>Xin chào ${safeName}, yêu cầu thuê đã được ghi nhận với trạng thái <strong>Chờ shop xác nhận</strong>.</p>${detailsHtml}<p style="margin-top:18px;color:#475569">Email này chưa xác nhận thanh toán. Nhân viên THUECAM sẽ liên hệ để xác nhận lịch và các khoản cần thanh toán trước khi bàn giao thiết bị.</p><p style="color:#475569">Số liên hệ: ${escapeHtml(booking.customerPhone)}</p></div>`,
    }),
    transport.sendMail({
      from: { name: 'THUECAM Booking', address: bookingEmailAddress },
      to: bookingEmailAddress,
      subject: `Đơn thuê mới ${booking.bookingCode} – cần xác nhận`,
      text: shopText,
      html: `<div style="max-width:600px;margin:auto;font-family:Arial,sans-serif;color:#0f172a"><h1 style="color:#0284c7">Có yêu cầu thuê mới</h1><p>Đơn đang chờ admin kiểm tra và xác nhận.</p>${detailsHtml}<p><strong>Khách:</strong> ${safeName}<br><strong>Email:</strong> ${escapeHtml(booking.customerEmail)}<br><strong>Điện thoại:</strong> ${escapeHtml(booking.customerPhone)}<br><strong>Ghi chú:</strong> ${escapeHtml(booking.note ?? 'Không có')}</p></div>`,
    }),
  ]);

  if (customerResult.status === 'rejected' || shopResult.status === 'rejected') {
    console.error('[booking-email] One or more booking notifications could not be sent.', {
      bookingCode: booking.bookingCode,
      customerEmailSent: customerResult.status === 'fulfilled',
      shopEmailSent: shopResult.status === 'fulfilled',
    });
  }

  return {
    customerEmailSent: customerResult.status === 'fulfilled',
    shopEmailSent: shopResult.status === 'fulfilled',
  };
}

export const bookingNotificationEmail = bookingEmailAddress;
