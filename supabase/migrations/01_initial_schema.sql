-- ====================================================================
-- THUECAM (thuecam.vn) Production Supabase PostgreSQL Schema
-- Next.js App Router + Supabase Auth + Supabase Storage + SePay
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. SEO SETTINGS TABLE (Global site config & SEO Safeguards)
CREATE TABLE IF NOT EXISTS seo_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  site_title VARCHAR(255) NOT NULL DEFAULT 'THUECAM - Dịch Vụ Cho Thuê Camera & Thiết Bị Quay Phim Chuyên Nghiệp',
  site_description TEXT NOT NULL DEFAULT 'Dịch vụ cho thuê máy ảnh, action cam, DJI Pocket, flycam, gimbal, micro thu âm chính hãng giá tốt tại TP.HCM & Hà Nội. Thủ tục nhanh gọn, nhận máy ngay.',
  default_og_image TEXT DEFAULT 'https://thuecam.vn/images/og-default.jpg',
  twitter_handle VARCHAR(50) DEFAULT '@thuecamvn',
  business_name VARCHAR(255) DEFAULT 'THUECAM VIỆT NAM',
  hotline VARCHAR(50) DEFAULT '0932.501.411',
  email VARCHAR(100) DEFAULT 'contact@thuecam.vn',
  address TEXT DEFAULT '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh',
  opening_hours VARCHAR(100) DEFAULT '08:00 - 21:00 hàng ngày',
  google_verification_id VARCHAR(100),
  global_noindex_enabled BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  logo_url TEXT,
  description TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  indexable BOOLEAN DEFAULT TRUE,           
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  h1 VARCHAR(255) NOT NULL,
  intro_content TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  og_image TEXT,
  display_order INT DEFAULT 0,
  indexable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. USE CASES TABLE
CREATE TABLE IF NOT EXISTS use_cases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  h1 VARCHAR(255) NOT NULL,
  content TEXT,
  faq JSONB DEFAULT '[]'::jsonb,
  seo_title VARCHAR(255),
  seo_description TEXT,
  og_image TEXT,
  indexable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. LOCATIONS TABLE (Real physical service locations only)
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  address TEXT NOT NULL,
  phone VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL,
  google_maps_url TEXT,
  intro_content TEXT,
  seo_title VARCHAR(255),
  seo_description TEXT,
  indexable BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. PRODUCTS TABLE (Rentals, not purchase)
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(50) UNIQUE NOT NULL,
  brand_id UUID REFERENCES brands(id) ON DELETE SET NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  excerpt TEXT,
  description TEXT,
  specs JSONB DEFAULT '{}'::jsonb,
  accessories_included JSONB DEFAULT '[]'::jsonb,
  rental_price_per_day NUMERIC(12, 2) NOT NULL,
  deposit_amount NUMERIC(12, 2) NOT NULL,
  primary_image TEXT NOT NULL,
  gallery_images JSONB DEFAULT '[]'::jsonb,
  three_d_model_url TEXT,
  inventory_count INT DEFAULT 1,
  status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'MAINTENANCE', 'ARCHIVED')),
  
  -- SEO Fields
  seo_title VARCHAR(255),
  seo_description TEXT,
  seo_keywords TEXT,
  canonical_url TEXT,
  og_title VARCHAR(255),
  og_description TEXT,
  og_image TEXT,
  indexable BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. PRODUCT USE CASE RELATIONS
CREATE TABLE IF NOT EXISTS product_use_cases (
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  use_case_id UUID REFERENCES use_cases(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, use_case_id)
);

-- 9. CONTENT ARTICLES TABLE (Blog, Guides, Comparisons, Pillar Landing Pages)
CREATE TABLE IF NOT EXISTS articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(150) UNIQUE NOT NULL,
  type VARCHAR(30) NOT NULL CHECK (type IN ('blog', 'guide', 'comparison', 'landing')),
  title VARCHAR(255) NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  author_name VARCHAR(100) DEFAULT 'Đội Ngũ Kỹ Thuật THUECAM',
  author_avatar TEXT,
  author_bio TEXT,
  reviewer_name VARCHAR(100),
  pillar_slug VARCHAR(150),
  related_product_ids JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  status VARCHAR(20) DEFAULT 'PUBLISHED' CHECK (status IN ('DRAFT', 'PUBLISHED', 'ARCHIVED')),
  
  -- SEO Fields
  seo_title VARCHAR(255),
  seo_description TEXT,
  canonical_url TEXT,
  og_image TEXT,
  indexable BOOLEAN DEFAULT TRUE,
  
  published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. REVIEWS TABLE (Strictly genuine approved customer reviews)
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(100) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  rental_verified BOOLEAN DEFAULT TRUE,
  status VARCHAR(20) DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. REDIRECTS TABLE (301 Redirects manager)
CREATE TABLE IF NOT EXISTS redirects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  old_url TEXT UNIQUE NOT NULL,
  new_url TEXT NOT NULL,
  status_code INT DEFAULT 301 CHECK (status_code IN (301, 302)),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 12. BOOKINGS TABLE
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_code VARCHAR(30) UNIQUE NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  total_days INT NOT NULL CHECK (total_days >= 1),
  daily_price NUMERIC(12, 2) NOT NULL,
  deposit_amount NUMERIC(12, 2) NOT NULL,
  total_price NUMERIC(12, 2) NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_email VARCHAR(100) NOT NULL,
  pickup_method VARCHAR(50) DEFAULT 'STORE' CHECK (pickup_method IN ('STORE', 'DELIVERY')),
  delivery_address TEXT,
  note TEXT,
  status VARCHAR(30) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PAID', 'ACTIVE', 'RETURNED', 'CANCELLED')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 13. PAYMENTS TABLE (SePay Integration)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  sepay_transaction_id VARCHAR(100) UNIQUE,
  amount NUMERIC(12, 2) NOT NULL,
  bank_account VARCHAR(50),
  content TEXT,
  status VARCHAR(30) DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED')),
  webhook_payload JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 14. PERFORMANCE INDEXES
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand_id);
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_type ON articles(type);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_use_cases_slug ON use_cases(slug);
CREATE INDEX IF NOT EXISTS idx_locations_slug ON locations(slug);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_redirects_old_url ON redirects(old_url);
CREATE INDEX IF NOT EXISTS idx_bookings_code ON bookings(booking_code);

-- 15. ROW LEVEL SECURITY (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE use_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE redirects ENABLE ROW LEVEL SECURITY;
ALTER TABLE seo_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Public read policies for published & indexable content
CREATE POLICY "Public read products" ON products FOR SELECT USING (status = 'ACTIVE');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (indexable = TRUE);
CREATE POLICY "Public read use cases" ON use_cases FOR SELECT USING (indexable = TRUE);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (indexable = TRUE);
CREATE POLICY "Public read locations" ON locations FOR SELECT USING (indexable = TRUE);
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (status = 'PUBLISHED');
CREATE POLICY "Public read reviews" ON reviews FOR SELECT USING (status = 'APPROVED');
CREATE POLICY "Public read redirects" ON redirects FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read seo settings" ON seo_settings FOR SELECT USING (TRUE);
