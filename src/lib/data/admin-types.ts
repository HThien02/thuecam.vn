export interface BookingAddonLineItem {
  id: string;
  name: string;
  description?: string;
  price_per_rental: number;
  total_price?: number;
}

export interface BookingRecord {
  id: string;
  database_id?: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  customer_cccd?: string;
  product_id?: string;
  product_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  selected_addons?: BookingAddonLineItem[];
  daily_price?: number;
  deposit_amount?: number;
  pickup_method: string;
  pickup_time?: string | null;
  status: 'PENDING' | 'CONFIRMED' | 'RENTING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  created_at: string;
}

export interface SiteSettings {
  siteName: string;
  pickupAddress: string;
  hotline: string;
  zalo: string;
  email: string;
  openHours: string;
  promoBanner: string;
  depositPolicy: string;
  contactManagerName: string;
  facebookUrl: string;
  instagramUrl: string;
  whatsappUrl: string;
}

export interface BlockedDate {
  id: string;
  date: string;
  reason: string;
}
