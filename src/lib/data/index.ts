import {
  Product,
  Category,
  UseCase,
  Brand,
  Location,
  Article,
  Review,
  RedirectRule,
  SeoSettings,
} from '@/types';
import {
  PRODUCTS,
  CATEGORIES,
  USE_CASES,
  BRANDS,
  LOCATIONS,
  ARTICLES,
  REVIEWS,
  REDIRECTS,
  INITIAL_SEO_SETTINGS,
} from './mock-data';

// Helper to populate product relationships
function populateProduct(p: Product): Product {
  const brand = BRANDS.find((b) => b.id === p.brand_id);
  const category = CATEGORIES.find((c) => c.id === p.category_id);
  const approvedReviews = REVIEWS.filter(
    (r) => r.product_id === p.id && r.status === 'APPROVED'
  );

  const review_count = approvedReviews.length;
  const rating =
    review_count > 0
      ? Number(
          (
            approvedReviews.reduce((sum, r) => sum + r.rating, 0) / review_count
          ).toFixed(1)
        )
      : undefined;

  return {
    ...p,
    brand,
    category,
    reviews: approvedReviews,
    rating,
    review_count,
  };
}

// ---------------- PRODUCTS ----------------
export async function getProducts(): Promise<Product[]> {
  return PRODUCTS.map(populateProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const p = PRODUCTS.find((item) => item.slug === slug);
  if (!p) return null;
  return populateProduct(p);
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const category = CATEGORIES.find((c) => c.slug === categorySlug);
  if (!category) return [];
  return PRODUCTS.filter((p) => p.category_id === category.id).map(populateProduct);
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const brand = BRANDS.find((b) => b.slug === brandSlug);
  if (!brand) return [];
  return PRODUCTS.filter((p) => p.brand_id === brand.id).map(populateProduct);
}

// ---------------- CATEGORIES ----------------
export async function getCategories(): Promise<Category[]> {
  return [...CATEGORIES].sort((a, b) => a.display_order - b.display_order);
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const c = CATEGORIES.find((item) => item.slug === slug);
  return c || null;
}

// ---------------- USE CASES ----------------
export async function getUseCases(): Promise<UseCase[]> {
  return [...USE_CASES];
}

export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  const uc = USE_CASES.find((item) => item.slug === slug);
  return uc || null;
}

// ---------------- BRANDS ----------------
export async function getBrands(): Promise<Brand[]> {
  return [...BRANDS];
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const b = BRANDS.find((item) => item.slug === slug);
  return b || null;
}

// ---------------- LOCATIONS ----------------
export async function getLocations(): Promise<Location[]> {
  return [...LOCATIONS];
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const loc = LOCATIONS.find((item) => item.slug === slug);
  return loc || null;
}

// ---------------- ARTICLES (BLOG / GUIDES / COMPARISONS / LANDINGS) ----------------
export async function getArticles(type?: 'blog' | 'guide' | 'comparison' | 'landing'): Promise<Article[]> {
  if (type) {
    return ARTICLES.filter((a) => a.type === type && a.status === 'PUBLISHED');
  }
  return ARTICLES.filter((a) => a.status === 'PUBLISHED');
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const a = ARTICLES.find((item) => item.slug === slug && item.status === 'PUBLISHED');
  return a || null;
}

export async function getClusterArticles(pillarSlug: string): Promise<Article[]> {
  return ARTICLES.filter(
    (a) => a.pillar_slug === pillarSlug && a.status === 'PUBLISHED'
  );
}

// ---------------- REVIEWS ----------------
export async function getApprovedReviews(productId?: string): Promise<Review[]> {
  if (productId) {
    return REVIEWS.filter(
      (r) => r.product_id === productId && r.status === 'APPROVED'
    );
  }
  return REVIEWS.filter((r) => r.status === 'APPROVED');
}

export async function getAllReviewsForAdmin(): Promise<Review[]> {
  return [...REVIEWS];
}

// ---------------- REDIRECTS ----------------
export async function getRedirectRules(): Promise<RedirectRule[]> {
  return [...REDIRECTS];
}

// ---------------- SEO SETTINGS ----------------
let currentSeoSettings = { ...INITIAL_SEO_SETTINGS };

export async function getSeoSettings(): Promise<SeoSettings> {
  return { ...currentSeoSettings };
}

export async function updateSeoSettings(updates: Partial<SeoSettings>): Promise<SeoSettings> {
  currentSeoSettings = { ...currentSeoSettings, ...updates, updated_at: new Date().toISOString() };
  return { ...currentSeoSettings };
}
