// Google Analytics 4 (GA4) Event Architecture

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID || '';

// Type-safe event definitions
export type GTagEvent =
  | { action: 'page_view'; params: { page_title: string; page_location: string; page_path: string } }
  | { action: 'search'; params: { search_term: string; results_count?: number } }
  | { action: 'product_view'; params: { item_id: string; item_name: string; category?: string; price_per_day: number } }
  | { action: 'availability_check'; params: { item_id: string; start_date: string; end_date: string; is_available: boolean } }
  | { action: 'booking_start'; params: { item_id: string; item_name: string; daily_price: number } }
  | { action: 'booking_created'; params: { booking_code: string; item_id: string; total_days: number; total_price: number } }
  | { action: 'payment_started'; params: { booking_code: string; amount: number; method: string } }
  | { action: 'payment_success'; params: { booking_code: string; amount: number } }
  | { action: 'payment_failed'; params: { booking_code: string; reason?: string } }
  | { action: 'use_case_click'; params: { use_case_slug: string; use_case_name: string } }
  | { action: 'category_click'; params: { category_slug: string; category_name: string } };

declare global {
  interface Window {
    gtag?: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, unknown>
    ) => void;
  }
}

// Log specific events without exposing PII (Personally Identifiable Information)
export function trackEvent({ action, params }: GTagEvent) {
  if (typeof window === 'undefined' || !window.gtag || !GA_TRACKING_ID) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[GA4 Track Event]: ${action}`, params);
    }
    return;
  }

  window.gtag('event', action, params as Record<string, unknown>);
}
