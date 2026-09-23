'use client';

import { Product, Category, Article, Review } from '@/types';
import { PRODUCTS, CATEGORIES, ARTICLES, REVIEWS } from './mock-data';

export interface BookingRecord {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  product_id?: string;
  product_name: string;
  start_date: string;
  end_date: string;
  total_days: number;
  total_price: number;
  deposit_amount?: number;
  pickup_method: string;
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
}

const DEFAULT_SETTINGS: SiteSettings = {
  siteName: 'THUECAM.VN',
  pickupAddress: 'ETown, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM',
  hotline: '0932.501.411',
  zalo: '0932.501.411',
  email: 'contact@thuecam.vn',
  openHours: '08:00 - 21:30 (Hàng ngày)',
  promoBanner: 'Ưu đãi cộng dồn đến 40% | Nhận máy tại ETown Tân Bình hoặc ship hỏa tốc!',
  depositPolicy: 'Giữ CCCD gắn chip chính chủ hoặc cọc tiền linh hoạt, hoàn 100% khi trả máy',
};

const INITIAL_BOOKINGS: BookingRecord[] = [
  {
    id: 'TC892104',
    customer_name: 'Nguyễn Hoàng Long',
    customer_phone: '0938.123.456',
    customer_email: 'long.nh@gmail.com',
    product_name: 'DJI Pocket 4 Creator Combo',
    start_date: '2026-09-25',
    end_date: '2026-09-28',
    total_days: 3,
    total_price: 675000,
    deposit_amount: 3000000,
    pickup_method: 'ETown Tân Bình',
    status: 'CONFIRMED',
    notes: 'Khách nhận tại ETown lúc 9h sáng',
    created_at: '2026-09-23T10:15:00Z',
  },
  {
    id: 'TC731902',
    customer_name: 'Trần Thị Thu Thảo',
    customer_phone: '0909.888.777',
    customer_email: 'thaott@gmail.com',
    product_name: 'GoPro Hero 13 Black Travel',
    start_date: '2026-09-26',
    end_date: '2026-09-29',
    total_days: 4,
    total_price: 720000,
    deposit_amount: 2500000,
    pickup_method: 'Giao tận nơi: 45 Lê Duẩn, Q1',
    status: 'PENDING',
    notes: 'Cần kèm phao nổi đi lặn biển',
    created_at: '2026-09-23T14:30:00Z',
  },
  {
    id: 'TC654129',
    customer_name: 'Lê Minh Tuấn',
    customer_phone: '0912.333.444',
    customer_email: 'tuan.lm@gmail.com',
    product_name: 'DJI Mic 2 (2 TX + 1 RX)',
    start_date: '2026-09-24',
    end_date: '2026-09-25',
    total_days: 1,
    total_price: 150000,
    deposit_amount: 1500000,
    pickup_method: 'ETown Tân Bình',
    status: 'COMPLETED',
    notes: 'Quay phỏng vấn hội thảo',
    created_at: '2026-09-22T08:00:00Z',
  },
];

// Helper to trigger custom event for live updates
const notifyChange = (key: string) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('thuecam_data_changed', { detail: { key } }));
  }
};

// ---------------- PRODUCTS ----------------
export function getStoredProducts(): Product[] {
  if (typeof window === 'undefined') return PRODUCTS;
  try {
    const data = localStorage.getItem('thuecam_products');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return PRODUCTS;
}

export function saveStoredProduct(product: Product): Product[] {
  const current = getStoredProducts();
  const index = current.findIndex((p) => p.id === product.id);
  let updated: Product[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = product;
  } else {
    updated = [product, ...current];
  }
  localStorage.setItem('thuecam_products', JSON.stringify(updated));
  notifyChange('products');
  return updated;
}

export function deleteStoredProduct(id: string): Product[] {
  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== id);
  localStorage.setItem('thuecam_products', JSON.stringify(updated));
  notifyChange('products');
  return updated;
}

// ---------------- CATEGORIES ----------------
export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return CATEGORIES;
  try {
    const data = localStorage.getItem('thuecam_categories');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return CATEGORIES;
}

export function saveStoredCategory(category: Category): Category[] {
  const current = getStoredCategories();
  const index = current.findIndex((c) => c.id === category.id);
  let updated: Category[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = category;
  } else {
    updated = [...current, category];
  }
  localStorage.setItem('thuecam_categories', JSON.stringify(updated));
  notifyChange('categories');
  return updated;
}

export function deleteStoredCategory(id: string): Category[] {
  const current = getStoredCategories();
  const updated = current.filter((c) => c.id !== id);
  localStorage.setItem('thuecam_categories', JSON.stringify(updated));
  notifyChange('categories');
  return updated;
}

// ---------------- BOOKINGS ----------------
export function getStoredBookings(): BookingRecord[] {
  if (typeof window === 'undefined') return INITIAL_BOOKINGS;
  try {
    const data = localStorage.getItem('thuecam_bookings');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return INITIAL_BOOKINGS;
}

export function saveStoredBooking(booking: BookingRecord): BookingRecord[] {
  const current = getStoredBookings();
  const index = current.findIndex((b) => b.id === booking.id);
  let updated: BookingRecord[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = booking;
  } else {
    updated = [booking, ...current];
  }
  localStorage.setItem('thuecam_bookings', JSON.stringify(updated));
  notifyChange('bookings');
  return updated;
}

export function deleteStoredBooking(id: string): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.filter((b) => b.id !== id);
  localStorage.setItem('thuecam_bookings', JSON.stringify(updated));
  notifyChange('bookings');
  return updated;
}

export function updateBookingStatus(
  id: string,
  status: BookingRecord['status']
): BookingRecord[] {
  const current = getStoredBookings();
  const updated = current.map((b) => (b.id === id ? { ...b, status } : b));
  localStorage.setItem('thuecam_bookings', JSON.stringify(updated));
  notifyChange('bookings');
  return updated;
}

// ---------------- SETTINGS ----------------
export function getStoredSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const data = localStorage.getItem('thuecam_settings');
    if (data) return JSON.parse(data);
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveStoredSettings(settings: SiteSettings): SiteSettings {
  localStorage.setItem('thuecam_settings', JSON.stringify(settings));
  notifyChange('settings');
  return settings;
}
