create table if not exists public.brands (
  id text primary key,
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
  id text primary key,
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
  id text primary key,
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
  id text primary key,
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
  id text primary key,
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
  primary_image text not null,
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

create table if not exists public.product_use_cases (
  product_id text not null references public.products(id) on delete cascade,
  use_case_id text not null references public.use_cases(id) on delete cascade,
  primary key (product_id, use_case_id)
);

create table if not exists public.articles (
  id text primary key,
  slug text not null unique,
  type text not null check (type in ('blog', 'guide', 'comparison', 'landing')),
  title text not null,
  excerpt text not null default '',
  content text not null,
  featured_image text not null default '',
  author_name text not null default 'Đội Ngũ Kỹ Thuật THUECAM',
  author_avatar text,
  author_bio text,
  reviewer_name text,
  pillar_slug text,
  related_product_ids jsonb not null default '[]'::jsonb,
  faq jsonb not null default '[]'::jsonb,
  status text not null default 'PUBLISHED' check (status in ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  seo_title text,
  seo_description text,
  canonical_url text,
  og_image text,
  indexable boolean not null default true,
  published_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reviews (
  id text primary key,
  product_id text references public.products(id) on delete cascade,
  user_name text not null,
  rating integer not null check (rating between 1 and 5),
  comment text not null,
  rental_verified boolean not null default false,
  status text not null default 'PENDING' check (status in ('PENDING', 'APPROVED', 'REJECTED')),
  created_at timestamptz not null default now()
);

create table if not exists public.redirects (
  id text primary key,
  old_url text not null unique,
  new_url text not null,
  status_code integer not null default 301 check (status_code in (301, 302)),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_settings (
  id text primary key default 'global-seo-settings',
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

create table if not exists public.bookings (
  booking_code text primary key,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  start_date date not null,
  end_date date not null,
  total_days integer not null check (total_days > 0),
  daily_price numeric(12,2) not null default 0,
  deposit_amount numeric(12,2) not null default 0,
  total_price numeric(12,2) not null default 0,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  pickup_method text not null default 'STORE',
  delivery_address text,
  note text,
  status text not null default 'PENDING' check (status in ('PENDING', 'CONFIRMED', 'RENTING', 'COMPLETED', 'CANCELLED')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id text primary key default 'main',
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

create table if not exists public.blocked_dates (
  date date primary key,
  reason text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_brand_id_idx on public.products(brand_id);
create index if not exists products_status_idx on public.products(status);
create index if not exists articles_type_status_idx on public.articles(type, status);
create index if not exists reviews_product_status_idx on public.reviews(product_id, status);
create index if not exists bookings_start_end_idx on public.bookings(start_date, end_date);

alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.use_cases enable row level security;
alter table public.locations enable row level security;
alter table public.products enable row level security;
alter table public.product_use_cases enable row level security;
alter table public.articles enable row level security;
alter table public.reviews enable row level security;
alter table public.redirects enable row level security;
alter table public.seo_settings enable row level security;
alter table public.bookings enable row level security;
alter table public.site_settings enable row level security;
alter table public.blocked_dates enable row level security;

grant select on public.brands, public.categories, public.use_cases, public.locations,
  public.products, public.product_use_cases, public.articles, public.reviews,
  public.redirects, public.seo_settings to anon, authenticated;
grant all on public.brands, public.categories, public.use_cases, public.locations,
  public.products, public.product_use_cases, public.articles, public.reviews,
  public.redirects, public.seo_settings, public.bookings, public.site_settings,
  public.blocked_dates to service_role;

create policy "Public reads visible brands" on public.brands for select to anon, authenticated using (indexable);
create policy "Public reads visible categories" on public.categories for select to anon, authenticated using (indexable);
create policy "Public reads visible use cases" on public.use_cases for select to anon, authenticated using (indexable);
create policy "Public reads visible locations" on public.locations for select to anon, authenticated using (indexable);
create policy "Public reads active products" on public.products for select to anon, authenticated using (status = 'ACTIVE');
create policy "Public reads product use cases" on public.product_use_cases for select to anon, authenticated using (
  exists (select 1 from public.products p where p.id = product_id and p.status = 'ACTIVE')
);
create policy "Public reads published articles" on public.articles for select to anon, authenticated using (status = 'PUBLISHED');
create policy "Public reads approved reviews" on public.reviews for select to anon, authenticated using (status = 'APPROVED');
create policy "Public reads active redirects" on public.redirects for select to anon, authenticated using (is_active);
create policy "Public reads site SEO" on public.seo_settings for select to anon, authenticated using (true);

revoke all on public.bookings, public.site_settings, public.blocked_dates from anon, authenticated;
revoke insert, update, delete on public.brands, public.categories, public.use_cases,
  public.locations, public.products, public.product_use_cases, public.articles,
  public.reviews, public.redirects, public.seo_settings from anon, authenticated;

insert into public.seo_settings (id, site_title, site_description, default_og_image, twitter_handle, business_name, hotline, email, address, opening_hours, google_verification_id, global_noindex_enabled)
values ('global-seo-settings', 'THUECAM - Dịch Vụ Cho Thuê Camera & Thiết Bị Sáng Tạo Nội Dung Hàng Đầu', 'Dịch vụ cho thuê máy ảnh, action cam, DJI Pocket, flycam, gimbal, micro chính hãng giá từ 100K/ngày tại TP.HCM & Hà Nội. Đặt thuê online nhận máy ngay.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop', '@thuecamvn', 'THUECAM VIỆT NAM', '0901.234.567', 'lienhe@thuecam.vn', '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh', '08:00 - 21:30 (Thứ 2 - Chủ Nhật)', 'GSC-THUECAM-VN-VERIFIED-2026', false)
on conflict (id) do nothing;

insert into public.site_settings (id, site_name, pickup_address, hotline, zalo, email, open_hours, promo_banner, deposit_policy)
values ('main', 'THUECAM.VN', 'ETown, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP.HCM', '0932.501.411', '0932.501.411', 'contact@thuecam.vn', '08:00 - 21:30 (Hàng ngày)', 'Ưu đãi cộng dồn đến 40% | Nhận máy tại ETown Tân Bình hoặc ship hỏa tốc!', 'Giữ CCCD gắn chip chính chủ hoặc cọc tiền linh hoạt, hoàn 100% khi trả máy')
on conflict (id) do nothing;

insert into public.brands (id, slug, name, logo_url, description, seo_title, seo_description, indexable) values
('b-dji', 'dji', 'DJI', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=200&auto=format&fit=crop&q=80', 'Thương hiệu dẫn đầu thế giới về gimbal, pocket camera, flycam và micro không dây cho nhà sáng tạo nội dung.', 'Thuê Thiết Bị DJI Chính Hãng | Pocket, Flycam, Gimbal, Mic | THUECAM', 'Bảng giá thuê thiết bị DJI mới nhất: Pocket, Mic, RS4, Mini 4 Pro giá từ 150K/ngày.', true),
('b-sony', 'sony', 'Sony', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200&auto=format&fit=crop&q=80', 'Dòng máy ảnh và máy quay điện ảnh mirrorless full-frame chuẩn điện ảnh hàng đầu thế giới.', 'Thuê Máy Ảnh & Máy Quay Sony Full-Frame Chính Hãng | THUECAM', 'Cho thuê máy ảnh Sony FX3, A7C II, A7 IV và ống kính G-Master tại TP.HCM & Hà Nội.', true),
('b-gopro', 'gopro', 'GoPro', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=200&auto=format&fit=crop&q=80', 'Camera hành trình siêu bền bỉ, chống rung HyperSmooth cho du lịch, phượt và thể thao.', 'Thuê GoPro Hero Chính Hãng Đi Phượt, Lặn Biển | THUECAM', 'Cho thuê GoPro Hero kèm bộ phụ kiện phượt, lặn biển.', true),
('b-insta360', 'insta360', 'Insta360', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=200&auto=format&fit=crop&q=80', 'Camera 360 độ và AI tracking, góc nhìn vô tận không góc chết.', 'Thuê Camera 360 Insta360 Chính Hãng | THUECAM', 'Dịch vụ thuê camera 360 Insta360 kèm phụ kiện.', true)
on conflict (id) do nothing;

insert into public.categories (id, slug, name, h1, intro_content, description, seo_title, seo_description, og_image, display_order, indexable) values
('cat-camera-du-lich', 'camera-du-lich', 'Camera Du Lịch', 'Thuê Camera Du Lịch Nhỏ Gọn & Tiện Lợi', 'Tổng hợp các dòng máy quay nhỏ gọn, chống rung xuất sắc, pin trâu và dễ dàng bỏ túi khi di chuyển. Phù hợp cho các chuyến đi biển, leo núi, vi vu khám phá.', 'Camera nhỏ gọn cho những chuyến đi.', 'Thuê Camera Du Lịch Nhỏ Gọn, Chống Rung Cực Tốt | THUECAM', 'Dịch vụ cho thuê camera du lịch bỏ túi, action cam và pocket camera.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop', 1, true),
('cat-action-camera', 'action-camera', 'Action Camera', 'Thuê Action Camera Chống Nước & Hành Trình', 'Thiết bị ghi hình hành động siêu bền, chịu va đập, chống nước trực tiếp, góc siêu rộng và chống rung.', 'Action camera chống nước cho du lịch.', 'Thuê Action Cam Chống Nước Đi Biển, Phượt Xe Máy | THUECAM', 'Cho thuê action camera GoPro, Insta360 giá tốt.', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop', 2, true),
('cat-pocket-camera', 'pocket-camera', 'Pocket Camera', 'Thuê Pocket Camera Gimbal Tích Hợp', 'Dòng camera bỏ túi có tích hợp sẵn gimbal cơ học 3 trục, cảm biến sắc nét và thao tác nhanh.', 'Pocket camera gimbal tích hợp.', 'Thuê Pocket Camera DJI Pocket Creator | THUECAM', 'Cho thuê pocket camera DJI Pocket giá tốt.', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop', 3, true),
('cat-flycam', 'flycam', 'Flycam & Drone', 'Thuê Flycam Ghi Hình Từ Trên Cao', 'Thiết bị bay flycam cảm biến vật cản đa hướng, truyền sóng xa và thời lượng bay dài.', 'Flycam ghi hình từ trên cao.', 'Thuê Flycam DJI Mini 4 Pro, Air 3 | THUECAM', 'Thuê flycam DJI Mini 4 Pro combo nhiều pin.', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop', 4, true),
('cat-micro', 'micro-thu-am', 'Micro Thu Âm', 'Thuê Micro Không Dây Lọc Ồn Chuyên Nghiệp', 'Micro thu âm cài áo không dây khử tạp âm, ghi âm nội bộ và kết nối ổn định.', 'Micro không dây cho quay phim.', 'Thuê Micro Cài Áo Không Dây DJI Mic 2 | THUECAM', 'Cho thuê micro không dây DJI Mic 2 chính hãng.', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop', 5, true),
('cat-gimbal', 'gimbal', 'Gimbal Chống Rung', 'Thuê Gimbal Chống Rung Điện Thoại & Máy Ảnh', 'Tay cầm chống rung 3 trục cơ học cho máy ảnh mirrorless và smartphone.', 'Gimbal chống rung cho máy ảnh.', 'Thuê Gimbal DJI RS4, DJI Osmo Mobile | THUECAM', 'Cho thuê gimbal chống rung giá tốt.', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop', 6, true)
on conflict (id) do nothing;

insert into public.use_cases (id, slug, name, h1, content, faq, seo_title, seo_description, og_image, indexable) values
('uc-vlog', 'quay-vlog', 'Quay Vlog', 'Thuê Thiết Bị Quay Vlog Cá Nhân & Đời Sống', 'Thiết bị quay vlog cần lấy nét khuôn mặt nhanh, màu da đẹp, chống rung tốt và micro thu âm rõ ràng.', '[{"question":"Mới tập quay vlog thì nên thuê máy nào dễ dùng nhất?","answer":"Các dòng pocket camera tích hợp gimbal là lựa chọn dễ dùng, khởi động nhanh và gọn nhẹ."}]', 'Thuê Máy Quay Vlog Bỏ Túi Đẹp & Lọc Âm Tốt | THUECAM', 'Combo thiết bị quay vlog chuyên nghiệp, trọng lượng nhẹ và chống rung.', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop', true),
('uc-tiktok', 'quay-tiktok', 'Quay TikTok', 'Thuê Camera Quay Video Dọc Chuẩn TikTok & Reels', 'Video dọc cần hình ảnh sắc nét, màu sắc đẹp và âm thanh trong trẻo.', '[{"question":"Các máy có hỗ trợ quay dọc không?","answer":"Nhiều thiết bị hỗ trợ quay dọc nguyên bản, vui lòng xem thông số từng sản phẩm."}]', 'Thuê Camera Quay TikTok, Reels Sắc Nét 4K | THUECAM', 'Thiết bị quay video dọc, micro lọc âm và phụ kiện sáng tạo.', 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=1200&auto=format&fit=crop', true),
('uc-du-lich', 'du-lich', 'Đi Du Lịch', 'Thuê Máy Ảnh & Camera Hành Trình Đi Du Lịch', 'Thiết bị du lịch gọn nhẹ, pin tốt, chống bụi nước và phù hợp nhiều bối cảnh.', '[{"question":"Đi biển thì nên thuê máy nào?","answer":"Action camera chống nước phù hợp cho các hoạt động ngoài trời."}]', 'Thuê Camera Đi Du Lịch, Phượt Biển, Leo Núi | THUECAM', 'Thuê camera du lịch gọn nhẹ và phụ kiện đầy đủ.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop', true)
on conflict (id) do nothing;

insert into public.locations (id, slug, name, address, phone, email, google_maps_url, intro_content, seo_title, seo_description, indexable) values
('loc-tphcm', 'tphcm', 'TP. Hồ Chí Minh', 'ETown Cộng Hòa, 364 Cộng Hòa, Phường 13, Quận Tân Bình, TP. Hồ Chí Minh', '0932.501.411', 'hcm@thuecam.vn', 'https://maps.google.com/?q=ETown+Tan+Binh+TPHCM', 'Điểm hẹn nhận máy ETown Tân Bình và dịch vụ giao nhận máy hỏa tốc toàn TP.HCM.', 'Thuê Camera TPHCM Giá Tốt | Nhận Máy Tại ETown Tân Bình | THUECAM', 'Cho thuê camera và máy ảnh tại TPHCM, nhận máy tại ETown Tân Bình.', true),
('loc-ha-noi', 'ha-noi', 'Hà Nội', '45 Phố Giảng Võ, Phường Cát Linh, Quận Đống Đa, Hà Nội', '0902.345.678', 'hanoi@thuecam.vn', 'https://maps.google.com/?q=THUECAM+HANOI', 'Chi nhánh Đống Đa và Cầu Giấy cung cấp các dòng máy quay cho nhà sáng tạo nội dung.', 'Thuê Camera Hà Nội Chính Hãng | THUECAM', 'Cho thuê máy ảnh, action cam và pocket camera tại Hà Nội.', true)
on conflict (id) do nothing;

insert into public.redirects (id, old_url, new_url, status_code, is_active, created_at) values
('redir-1', '/thue-pocket-4', '/thiet-bi/dji-pocket-4-creator', 301, true, '2026-09-01T00:00:00Z'),
('redir-2', '/thue-pocket-3', '/thiet-bi/dji-pocket-3-creator', 301, true, '2026-09-01T00:00:00Z'),
('redir-3', '/gopro-13', '/thiet-bi/gopro-hero-13-black', 301, true, '2026-09-01T00:00:00Z')
on conflict (id) do nothing;

insert into public.products (id, slug, name, sku, brand_id, category_id, excerpt, description, specs, accessories_included, rental_price_per_day, deposit_amount, primary_image, gallery_images, inventory_count, status, seo_title, seo_description, seo_keywords, canonical_url, og_title, og_description, og_image, indexable) values
('prod-dji-pocket-4-creator', 'dji-pocket-4-creator', 'DJI Pocket 4 Creator Combo', 'TC-DJI-PK4-CC', 'b-dji', 'cat-pocket-camera', 'Camera bỏ túi tích hợp gimbal 3 trục, quay 4K và bộ phụ kiện Creator.', 'DJI Pocket 4 Creator Combo là dòng camera cầm tay dành cho vlogger và nhà sáng tạo nội dung video.', '{"Cảm biến":"1-inch CMOS HDR","Độ phân giải video":"4K/120fps","Chống rung":"Gimbal cơ học 3 trục","Thời lượng pin":"Lên tới 160 phút","Màn hình":"OLED 2.0 inch","Trọng lượng":"185g"}', '["Thân máy DJI Pocket 4","Micro không dây","Tay cầm kéo dài","Chân đế mini tripod","Thẻ nhớ 128GB","Hộp bảo vệ"]', 200000, 3000000, 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop","https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"]', 8, 'ACTIVE', 'Thuê DJI Pocket 4 Creator Chính Hãng | Giá từ 200K/ngày | THUECAM', 'Thuê DJI Pocket 4 Creator giá từ 200.000đ/ngày, kiểm tra lịch trống và đặt thuê online tại THUECAM.', 'thuê dji pocket 4, camera quay vlog', 'https://thuecam.vn/thiet-bi/dji-pocket-4-creator', 'Thuê DJI Pocket 4 Creator Chính Hãng | THUECAM', 'Thuê DJI Pocket 4 Creator với phụ kiện đầy đủ.', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop', true),
('prod-dji-pocket-3-creator', 'dji-pocket-3-creator', 'DJI Pocket 3 Creator Combo', 'TC-DJI-PK3-CC', 'b-dji', 'cat-pocket-camera', 'Cảm biến 1-inch CMOS quay 4K, màn hình xoay và micro DJI Mic 2.', 'Thiết bị quay vlog nhỏ gọn với gimbal 3 trục và micro không dây.', '{"Cảm biến":"1-inch CMOS","Độ phân giải video":"4K/120fps","Chống rung":"Gimbal 3 trục","Màn hình":"2.0 inch OLED","Trọng lượng":"179g"}', '["Thân máy Pocket 3","Micro DJI Mic 2","Tay cầm pin","Mini tripod","Thẻ nhớ 128GB"]', 180000, 2500000, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop"]', 12, 'ACTIVE', 'Thuê DJI Pocket 3 Creator Combo | Giá từ 180K/ngày | THUECAM', 'Cho thuê DJI Pocket 3 Creator combo kèm mic không dây, tay cầm pin và thẻ nhớ.', 'thuê dji pocket 3, camera vlog', 'https://thuecam.vn/thiet-bi/dji-pocket-3-creator', 'Thuê DJI Pocket 3 Creator Combo | THUECAM', 'Dịch vụ cho thuê DJI Pocket 3 Creator combo.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop', true),
('prod-gopro-hero-13-black', 'gopro-hero-13-black', 'GoPro Hero 13 Black', 'TC-GP-H13-BLK', 'b-gopro', 'cat-action-camera', 'Camera hành trình chống rung HyperSmooth, quay video 5.3K.', 'GoPro Hero 13 Black với khả năng chống nước và quay chuyển động chậm.', '{"Cảm biến":"1/1.9 inch CMOS","Độ phân giải video":"5.3K/60fps, 4K/120fps","Chống nước":"10 mét","Chống rung":"HyperSmooth 6.0"}', '["Máy GoPro Hero 13","2 viên pin Enduro","Đốc sạc đôi","Phao nổi","Ngàm gắn nón","Thẻ nhớ 128GB"]', 150000, 2000000, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1000&auto=format&fit=crop"]', 10, 'ACTIVE', 'Thuê GoPro Hero 13 Black Đi Biển, Phượt | THUECAM', 'Thuê GoPro Hero 13 Black kèm phụ kiện phượt, 2 pin Enduro và thẻ nhớ.', 'thuê gopro 13, action camera', 'https://thuecam.vn/thiet-bi/gopro-hero-13-black', 'Thuê GoPro Hero 13 Black | THUECAM', 'Cho thuê GoPro Hero 13 Black chính hãng.', 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?q=80&w=1200&auto=format&fit=crop', true),
('prod-insta360-x4', 'insta360-x4', 'Insta360 X4 8K 360 Camera', 'TC-INSTA-X4', 'b-insta360', 'cat-action-camera', 'Camera 360 độ quay video 8K, gậy selfie tàng hình và reframe góc quay.', 'Insta360 X4 cho phép chọn góc nhìn mong muốn khi dựng video.', '{"Độ phân giải 360":"8K/30fps, 5.7K/60fps","Độ phân giải ảnh":"72MP","Chống rung":"FlowState","Chống nước":"10 mét"}', '["Máy Insta360 X4","Gậy tàng hình 114cm","2 viên pin","Ốp bảo vệ","Thẻ nhớ 128GB"]', 180000, 2500000, 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1000&auto=format&fit=crop"]', 6, 'ACTIVE', 'Thuê Insta360 X4 8K 360 Độ | THUECAM', 'Dịch vụ thuê camera 360 Insta360 X4, kèm gậy tàng hình và phụ kiện.', 'thuê insta360 x4, camera 360', 'https://thuecam.vn/thiet-bi/insta360-x4', 'Thuê Insta360 X4 8K | THUECAM', 'Cho thuê camera 360 độ Insta360 X4.', 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?q=80&w=1200&auto=format&fit=crop', true),
('prod-dji-mini-4-pro', 'dji-mini-4-pro', 'DJI Mini 4 Pro Flycam (Combo 3 Pin + Tay RC 2)', 'TC-DJI-M4P-C3P', 'b-dji', 'cat-flycam', 'Flycam dưới 249g, cảm biến vật cản đa hướng, video 4K HDR và quay dọc.', 'Mini 4 Pro mang đến trải nghiệm bay với cảm biến tránh chướng ngại vật 360 độ.', '{"Trọng lượng":"Dưới 249g","Cảm biến":"1/1.3-inch CMOS","Độ phân giải":"4K/60fps HDR","Thời gian bay":"34 phút mỗi pin"}', '["Máy bay DJI Mini 4 Pro","Điều khiển DJI RC 2","3 viên pin","Hub sạc","Thẻ nhớ 128GB"]', 280000, 4000000, 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1000&auto=format&fit=crop"]', 5, 'ACTIVE', 'Thuê Flycam DJI Mini 4 Pro Combo 3 Pin | THUECAM', 'Thuê flycam DJI Mini 4 Pro kèm tay điều khiển màn hình, 3 pin và phụ kiện.', 'thuê flycam mini 4 pro', 'https://thuecam.vn/thiet-bi/dji-mini-4-pro', 'Thuê DJI Mini 4 Pro | THUECAM', 'Cho thuê flycam DJI Mini 4 Pro combo 3 pin.', 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=1200&auto=format&fit=crop', true),
('prod-dji-mic-2', 'dji-mic-2', 'DJI Mic 2 (2 TX + 1 RX + Hộp Sạc)', 'TC-DJI-MIC2', 'b-dji', 'cat-micro', 'Micro thu âm không dây, ghi âm 32-bit Float và khử ồn thông minh.', 'DJI Mic 2 là giải pháp thu âm không dây dành cho quay phim và phỏng vấn.', '{"Cấu hình":"2 TX + 1 RX + hộp sạc","Ghi âm nội bộ":"32-bit Float","Khoảng cách truyền":"250m","Thời lượng pin":"6 giờ mỗi mic"}', '["2 Transmitter","1 Receiver","Hộp sạc","Bông lọc gió","Adapter Lightning và Type-C"]', 120000, 1500000, 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1000&auto=format&fit=crop"]', 15, 'ACTIVE', 'Thuê Micro Không Dây DJI Mic 2 Khử Ồn | THUECAM', 'Thuê DJI Mic 2 kèm hộp sạc, ghi âm 32-bit float và adapter điện thoại.', 'thuê dji mic 2, micro không dây', 'https://thuecam.vn/thiet-bi/dji-mic-2', 'Thuê DJI Mic 2 | THUECAM', 'Cho thuê micro không dây DJI Mic 2.', 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?q=80&w=1200&auto=format&fit=crop', true),
('prod-dji-rs-4-gimbal', 'dji-rs-4-gimbal', 'DJI RS 4 Gimbal Chống Rung Máy Ảnh', 'TC-DJI-RS4', 'b-dji', 'cat-gimbal', 'Gimbal chống rung chuyên nghiệp, khóa trục tự động và tải trọng 3kg.', 'DJI RS 4 hỗ trợ cân bằng nhanh, quay dọc native và điều khiển máy ảnh.', '{"Tải trọng tối đa":"3.0 kg","Thời lượng pin":"12 giờ","Màn hình":"OLED cảm ứng","Khóa trục":"Tự động thế hệ 2"}', '["Thân gimbal DJI RS 4","Tay nắm pin","Đế tháo nhanh","Chân mini tripod","Hộp chống sốc"]', 160000, 2000000, 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop', '["https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1000&auto=format&fit=crop"]', 7, 'ACTIVE', 'Thuê Gimbal Chống Rung DJI RS 4 Máy Ảnh | THUECAM', 'Cho thuê gimbal DJI RS 4 tải trọng 3kg, khóa trục tự động và phụ kiện đầy đủ.', 'thuê dji rs4, gimbal máy ảnh', 'https://thuecam.vn/thiet-bi/dji-rs-4-gimbal', 'Thuê DJI RS 4 | THUECAM', 'Cho thuê gimbal máy ảnh DJI RS 4.', 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?q=80&w=1200&auto=format&fit=crop', true)
on conflict (id) do nothing;

insert into public.articles (id, slug, type, title, excerpt, content, featured_image, author_name, author_avatar, author_bio, reviewer_name, pillar_slug, related_product_ids, status, seo_title, seo_description, canonical_url, og_image, indexable, published_at, updated_at) values
('art-pillar-thue-camera-du-lich', 'thue-camera-du-lich', 'landing', 'Dịch Vụ Cho Thuê Camera Du Lịch Trọn Gói Giá Rẻ', 'Tổng hợp camera du lịch từ DJI, GoPro, Insta360 kèm kinh nghiệm lựa chọn và thủ tục thuê.', '## Tại Sao Nên Thuê Camera Khi Đi Du Lịch Thay Vì Mua?\n\nDịch vụ thuê camera du lịch tại THUECAM giúp tiếp cận thiết bị đời mới, tiết kiệm chi phí và sử dụng đầy đủ phụ kiện.\n\n## Nên Chọn Dòng Camera Nào?\n\n- Đi biển, lặn san hô: chọn GoPro Hero 13 Black.\n- Quay vlog: chọn DJI Pocket 4 Creator hoặc Pocket 3.\n- Quay 360 độ: Insta360 X4.', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop', 'Minh Tuấn (Trưởng nhóm Kỹ thuật THUECAM)', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'Chuyên gia thiết bị quay chụp với hơn 7 năm kinh nghiệm.', 'Hoàng Long (Founder THUECAM)', 'thue-camera-du-lich', '["prod-dji-pocket-4-creator","prod-gopro-hero-13-black","prod-insta360-x4"]', 'PUBLISHED', 'Thuê Camera Du Lịch Chính Hãng | Giá Từ 150K/ngày | THUECAM', 'Cho thuê camera du lịch, action cam chống nước và pocket camera tại TP.HCM & Hà Nội.', 'https://thuecam.vn/thue-camera-du-lich', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1200&auto=format&fit=crop', true, '2026-09-01T08:00:00Z', '2026-09-20T10:00:00Z'),
('art-dji-pocket-4-la-gi', 'dji-pocket-4-la-gi', 'blog', 'DJI Pocket 4 là gì? Có phù hợp để quay vlog du lịch không?', 'Đánh giá chi tiết DJI Pocket 4 và những điểm nổi bật dành cho vlogger.', 'DJI Pocket 4 là mẫu máy quay mini thế hệ mới. Gimbal 3 trục giữ thăng bằng khi di chuyển, khởi động nhanh và phù hợp quay vlog.\n\nBạn có thể tham khảo DJI Pocket 4 Creator Combo hoặc cẩm nang thuê camera du lịch.', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop', 'Minh Tuấn', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', 'Reviewer thiết bị công nghệ tại THUECAM.', 'Hoàng Long', 'thue-camera-du-lich', '["prod-dji-pocket-4-creator","prod-dji-pocket-3-creator"]', 'PUBLISHED', 'DJI Pocket 4 Là Gì? Có Nên Thuê Quay Vlog Không? | THUECAM', 'Đánh giá DJI Pocket 4: thông số, tính năng và lời khuyên thuê máy quay vlog.', 'https://thuecam.vn/blog/dji-pocket-4-la-gi', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop', true, '2026-09-05T09:00:00Z', '2026-09-18T14:00:00Z'),
('art-comp-pocket-4-vs-pocket-3', 'dji-pocket-4-vs-pocket-3', 'comparison', 'DJI Pocket 4 vs Pocket 3: Nên thuê máy nào cho chuyến đi?', 'So sánh 2 thế hệ pocket camera về cảm biến, micro, pin và giá thuê.', 'Pocket 4 phù hợp khi cần hiệu năng đời mới; Pocket 3 cân bằng chi phí cho nhu cầu quay vlog thông thường.\n\nTham khảo bảng giá thuê từng thiết bị để lựa chọn phù hợp.', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop', 'Minh Tuấn', null, 'Reviewer thiết bị công nghệ tại THUECAM.', null, 'thue-camera-du-lich', '["prod-dji-pocket-4-creator","prod-dji-pocket-3-creator"]', 'PUBLISHED', 'So Sánh DJI Pocket 4 vs Pocket 3: Nên Thuê Máy Nào? | THUECAM', 'So sánh Pocket 4 và Pocket 3 về chất lượng, chống rung, pin và giá thuê.', 'https://thuecam.vn/so-sanh/dji-pocket-4-vs-pocket-3', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1200&auto=format&fit=crop', true, '2026-09-08T08:00:00Z', '2026-09-19T10:00:00Z'),
('art-guide-pocket-4-quay-du-lich', 'dji-pocket-4-quay-du-lich', 'guide', 'Hướng dẫn cài đặt DJI Pocket 4 quay du lịch sắc nét từ A-Z', 'Bí quyết thiết lập màu sắc, tốc độ màn trập và chống rung cho chuyến đi.', 'Sau khi nhận máy, hãy chọn profile màu phù hợp, thiết lập tốc độ màn trập theo khung hình và bật theo dõi chủ thể.\n\nĐọc thêm cẩm nang thuê camera du lịch và thông số thiết bị.', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1000&auto=format&fit=crop', 'Hoàng Long', null, 'Nhà làm phim độc lập và Giám đốc kỹ thuật THUECAM.', null, 'thue-camera-du-lich', '["prod-dji-pocket-4-creator"]', 'PUBLISHED', 'Hướng Dẫn Cài Đặt DJI Pocket 4 Quay Du Lịch | THUECAM', 'Cẩm nang cài đặt màu, góc quay, tốc độ màn trập và micro trên DJI Pocket 4.', 'https://thuecam.vn/huong-dan/dji-pocket-4-quay-du-lich', 'https://images.unsplash.com/photo-1512790182412-b19e6d62bc39?q=80&w=1200&auto=format&fit=crop', true, '2026-09-10T10:00:00Z', '2026-09-20T16:00:00Z')
on conflict (id) do nothing;

insert into public.product_use_cases (product_id, use_case_id) values
('prod-dji-pocket-4-creator', 'uc-vlog'), ('prod-dji-pocket-4-creator', 'uc-tiktok'), ('prod-dji-pocket-4-creator', 'uc-du-lich'),
('prod-dji-pocket-3-creator', 'uc-vlog'), ('prod-gopro-hero-13-black', 'uc-du-lich'),
('prod-insta360-x4', 'uc-du-lich'), ('prod-dji-mini-4-pro', 'uc-du-lich'),
('prod-dji-mic-2', 'uc-vlog'), ('prod-dji-rs-4-gimbal', 'uc-vlog')
on conflict do nothing;
