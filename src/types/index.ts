export interface Category {
  id: string;
  slug: string;
  name: string;
  h1: string;
  intro_content: string;
  description?: string;
  icon?: string;
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  display_order: number;
  indexable: boolean;
}

export interface UseCase {
  id: string;
  slug: string;
  name: string;
  h1: string;
  content: string;
  faq: FAQItem[];
  seo_title?: string;
  seo_description?: string;
  og_image?: string;
  indexable: boolean;
}

export interface Brand {
  id: string;
  slug: string;
  name: string;
  logo_url?: string;
  description?: string;
  seo_title?: string;
  seo_description?: string;
  indexable: boolean;
}

export interface Location {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  google_maps_url?: string;
  intro_content: string;
  seo_title?: string;
  seo_description?: string;
  indexable: boolean;
}

export interface RentalAddon {
  id: string;
  name: string;
  price_per_day: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  sku: string;
  brand_id?: string;
  brand?: Brand;
  category_id?: string;
  category?: Category;
  excerpt: string;
  description: string;
  specs: Record<string, string>;
  accessories_included: string[];
  included_accessories?: string[];
  features?: string[];
  rental_price_per_day: number;
  rental_addons?: RentalAddon[];
  deposit_amount: number;
  primary_image: string;
  gallery_images: string[];
  three_d_model_url?: string;
  inventory_count: number;
  status: 'ACTIVE' | 'MAINTENANCE' | 'ARCHIVED' | 'INACTIVE';
  created_at?: string;
  updated_at?: string;
  
  // SEO fields
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  indexable: boolean;

  // Populated relations
  use_cases?: UseCase[];
  reviews?: Review[];
  rating?: number;
  review_count?: number;
}

export interface Article {
  id: string;
  slug: string;
  type: 'blog' | 'guide' | 'comparison' | 'landing';
  title: string;
  excerpt: string;
  content: string;
  featured_image: string;
  author_name: string;
  author_avatar?: string;
  author_bio?: string;
  reviewer_name?: string;
  pillar_slug?: string;
  related_product_ids?: string[];
  faq?: FAQItem[];
  status: 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  
  // SEO fields
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_image?: string;
  indexable: boolean;
  
  published_at: string;
  updated_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_name: string;
  rating: number; // 1 to 5
  comment: string;
  rental_verified: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  created_at: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface RedirectRule {
  id: string;
  old_url: string;
  new_url: string;
  status_code: 301 | 302;
  is_active: boolean;
  created_at: string;
}

export interface SeoSettings {
  id: string;
  site_title: string;
  site_description: string;
  default_og_image: string;
  twitter_handle: string;
  business_name: string;
  hotline: string;
  email: string;
  address: string;
  opening_hours: string;
  google_verification_id?: string;
  global_noindex_enabled: boolean;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_code: string;
  product_id: string;
  product?: Product;
  start_date: string;
  end_date: string;
  total_days: number;
  daily_price: number;
  deposit_amount: number;
  total_price: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  pickup_method: 'STORE' | 'DELIVERY';
  delivery_address?: string;
  note?: string;
  status: 'PENDING' | 'PAID' | 'ACTIVE' | 'RETURNED' | 'CANCELLED';
  created_at: string;
}

export interface PaymentTransaction {
  id: string;
  booking_id: string;
  sepay_transaction_id: string;
  amount: number;
  bank_account?: string;
  content: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created_at: string;
}
