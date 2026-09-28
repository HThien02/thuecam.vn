export type ApplicationStatus = 'PENDING' | 'CONTACTED' | 'APPROVED' | 'REJECTED';

export interface ConsignmentApplication {
  id: string;
  full_name: string;
  phone: string;
  email: string | null;
  city: string;
  device_name: string;
  device_brand: string;
  device_condition: string;
  quantity: number;
  purchase_year: number | null;
  note: string;
  status: ApplicationStatus;
  admin_note: string;
  partner_user_id: string | null;
  created_at: string;
}

export interface ConsignmentPartner {
  user_id: string;
  full_name: string;
  phone: string;
  email: string;
  revenue_share_percent: number;
  active: boolean;
  application_id: string | null;
  note: string;
  created_at: string;
}

export interface ConsignmentUnit {
  id: string;
  serial_number: string;
  label: string;
  status: string;
  owner_partner_id: string | null;
  series_name: string;
}

export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
  PENDING: 'Chờ duyệt',
  CONTACTED: 'Đã liên hệ',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
};

export const BOOKING_STATUS_LABELS: Record<string, string> = {
  PENDING: 'Chờ xác nhận',
  CONFIRMED: 'Đã xác nhận',
  PAID: 'Đã thanh toán',
  RENTING: 'Đang cho thuê',
  ACTIVE: 'Đang cho thuê',
  RETURNED: 'Đã trả máy',
  COMPLETED: 'Hoàn tất',
  CANCELLED: 'Đã huỷ',
};

export const formatVnd = (value: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(value);

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value));
