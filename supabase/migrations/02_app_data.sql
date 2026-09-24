create extension if not exists pgcrypto;

grant usage on schema public to anon, authenticated, service_role;

create table if not exists public.brands (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  logo_url text,
  description text,
  seo_title text,
  seo_description text,
  indexable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  h1 text not null,
  intro_content text not null default '',
  description text,
  icon text,
  seo_title text,
  seo_description text,
  og_image text,
  display_order integer not null default 0,
  indexable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.use_cases (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  h1 text not null,
  content text not null default '',
  faq jsonb not null default '[]'::jsonb,
  seo_title text,
  seo_description text,
  og_image text,
  indexable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.locations (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  address text not null,
  phone text not null,
  email text not null,
  google_maps_url text,
  intro_content text not null default '',
  seo_title text,
  seo_description text,
  indexable boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  name text not null,
  sku text not null unique,
  brand_id text references public.brands(id) on delete set null,
  category_id text references public.categories(id) on delete set null,
  excerpt text not null default '',
  description text not null default '',
  specs jsonb not null default '{}'::jsonb,
  accessories_included jsonb not null default '[]'::jsonb,
  rental_price_per_day numeric(12,2) not null check (rental_price_per_day > 0),
  deposit_amount numeric(12,2) not null default 0 check (deposit_amount >= 0),
  primary_image text not null default '',
  gallery_images jsonb not null default '[]'::jsonb,
  three_d_model_url text,
  inventory_count integer not null default 1 check (inventory_count >= 0),
  status text not null default 'ACTIVE' check (status in ('ACTIVE', 'INACTIVE', 'MAINTENANCE', 'ARCHIVED')),
  seo_title text,
  seo_description text,
  seo_keywords text,
  canonical_url text,
  og_title text,
  og_description text,
  og_image text,
  indexable boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.articles (
  id text primary key default gen_random_uuid()::text,
  slug text not null unique,
  type text not null check (type in ('blog', 'guide', 'comparison', 'landing')),
  title text not null,
  excerpt text not null default '',
  content text not null default '',
  featured_image text not null default '',
  author_name text not null default 'Đội ngũ THUECAM',
  author_avatar text,
  author_bio text,
  reviewer_name text,
  pillar_slug text,
  related_product_ids jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  status text not null default 'DRAFT' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image text,
  indexable boolean not null default true,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key default gen_random_uuid()::text,
  product_id text references public.products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  rental_verified boolean not null default false,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz not null default now()
);

create table if not exists public.redirects (
  id text primary key default gen_random_uuid()::text,
  old_url text not null unique,
  new_url text not null,
  status_code integer not null default 301 check (status_code in (301, 302)),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  id text primary key,
  site_title text not null,
  site_description text not null,
  default_og_image text not null default '',
  twitter_handle text not null default '',
  business_name text not null default '',
  hotline text not null default '',
  email text not null default '',
  address text not null default '',
  opening_hours text not null default '',
  google_verification_id text,
  global_noindex_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'global',
  site_name text not null default 'THUECAM.VN',
  pickup_address text not null default '',
  hotline text not null default '',
  zalo text not null default '',
  email text not null default '',
  open_hours text not null default '',
  promo_banner text not null default '',
  deposit_policy text not null default '',
  updated_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id text primary key default gen_random_uuid()::text,
  booking_code text not null unique,
  product_id text references public.products(id) on delete restrict,
  product_name text not null default '',
  start_date date not null,
  end_date date not null,
  total_days integer not null check (total_days >= 1),
  daily_price numeric(12,2) not null default 0,
  deposit_amount numeric(12,2) not null default 0,
  total_price numeric(12,2) not null check (total_price >= 0),
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  pickup_method text not null default 'STORE',
  delivery_address text,
  note text,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'RENTING', 'COMPLETED', 'CANCELLED', 'PAID', 'ACTIVE', 'RETURNED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create table if not exists public.blocked_dates (
  id text primary key default gen_random_uuid()::text,
  date date not null unique,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id text primary key default gen_random_uuid()::text,
  booking_id text not null references public.bookings(id) on delete cascade,
  sepay_transaction_id text unique,
  amount numeric(12,2) not null check (amount >= 0),
  bank_account text,
  content text not null default '',
  status text not null default 'PENDING' check (status in ('PENDING', 'COMPLETED', 'FAILED')),
  webhook_payload jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists articles_type_status_idx on public.articles(type, status);
create index if not exists reviews_product_status_idx on public.reviews(product_id, status);
create index if not exists bookings_created_at_idx on public.bookings(created_at desc);
create index if not exists bookings_status_idx on public.bookings(status);

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.use_cases enable row level security;
alter table public.locations enable row level security;
alter table public.products enable row level security;
alter table public.articles enable row level security;
alter table public.reviews enable row level security;
alter table public.redirects enable row level security;
alter table public.seo_settings enable row level security;
alter table public.site_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.payments enable row level security;

drop policy if exists "Public read active brands" on public.brands;
create policy "Public read active brands" on public.brands for select to anon, authenticated using (indexable = true);
drop policy if exists "Public read active categories" on public.categories;
create policy "Public read active categories" on public.categories for select to anon, authenticated using (indexable = true);
drop policy if exists "Public read active use cases" on public.use_cases;
create policy "Public read active use cases" on public.use_cases for select to anon, authenticated using (indexable = true);
drop policy if exists "Public read active locations" on public.locations;
create policy "Public read active locations" on public.locations for select to anon, authenticated using (indexable = true);
drop policy if exists "Public read active products" on public.products;
create policy "Public read active products" on public.products for select to anon, authenticated using (status = 'ACTIVE');
drop policy if exists "Public read published articles" on public.articles;
create policy "Public read published articles" on public.articles for select to anon, authenticated using (status = 'PUBLISHED');
drop policy if exists "Public read approved reviews" on public.reviews;
create policy "Public read approved reviews" on public.reviews for select to anon, authenticated using (status = 'APPROVED');
drop policy if exists "Public read active redirects" on public.redirects;
create policy "Public read active redirects" on public.redirects for select to anon, authenticated using (is_active = true);
drop policy if exists "Public read seo settings" on public.seo_settings;
create policy "Public read seo settings" on public.seo_settings for select to anon, authenticated using (true);
drop policy if exists "Public read site settings" on public.site_settings;
create policy "Public read site settings" on public.site_settings for select to anon, authenticated using (true);

grant select on public.brands, public.categories, public.use_cases, public.locations, public.products,
  public.articles, public.reviews, public.redirects, public.seo_settings, public.site_settings
  to anon, authenticated;
grant all on public.brands, public.categories, public.use_cases, public.locations, public.products,
  public.articles, public.reviews, public.redirects, public.seo_settings, public.site_settings,
  public.bookings, public.blocked_dates, public.payments to service_role;

revoke all on public.bookings, public.blocked_dates, public.payments from anon, authenticated;

comment on table public.bookings is 'Customer booking PII; only accessible to trusted server code using the service role.';
comment on table public.payments is 'Payment and webhook data; only accessible to trusted server code using the service role.';
comment on table public.blocked_dates is 'Admin-managed inventory availability; only accessible to trusted server code using the service role.';

insert into public.site_settings (id, site_name, pickup_address, hotline, zalo, email, open_hours, promo_banner, deposit_policy)
values ('global', 'THUECAM.VN', 'ETown, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM', '0932.501.411', '0932.501.411', 'contact@thuecam.vn', '08:00 - 21:30 (Hàng ngày)', 'Ưu đãi cộng dồn đến 40% | Nhận máy tại ETown Tân Bình hoặc ship hỏa tốc!', 'Giữ CCCD gắn chip chính chủ hoặc cọc tiền linh hoạt, hoàn 100% khi trả máy')
on conflict (id) do nothing;

insert into public.seo_settings (id, site_title, site_description, default_og_image, twitter_handle, business_name, hotline, email, address, opening_hours, google_verification_id, global_noindex_enabled)
values ('global-seo-settings', 'THUECAM - Dịch Vụ Cho Thuê Camera & Thiết Bị Sáng Tạo Nội Dung Hàng Đầu', 'Dịch vụ cho thuê máy ảnh, action cam, DJI Pocket 4, flycam, gimbal, micro chính hãng giá từ 100K/ngày tại TP.HCM & Hà Nội. Đặt thuê online nhận máy ngay.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop', '@thuecamvn', 'THUECAM VIỆT NAM', '0901.234.567', 'lienhe@thuecam.vn', '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', '08:00 - 21:30 (Thứ 2 - Chủ Nhật)', 'GSC-THUECAM-VN-VERIFIED-2026', false)
on conflict (id) do nothing;

-- Public Data API access is granted explicitly above; RLS still filters every public row.
-- Admin reads/writes and customer booking submissions must use authenticated server routes.
