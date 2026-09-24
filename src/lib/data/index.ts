import type {
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
import { createClient } from '@/lib/supabase/server';

function requireData<T>(data: T | null, error: { message: string } | null): T {
  if (error) throw new Error(`Supabase query failed: ${error.message}`);
  if (data === null) throw new Error('Supabase returned no data.');
  return data;
}

async function getProductRelations(products: Product[]): Promise<Product[]> {
  if (!products.length) return products;

  const supabase = await createClient();
  const productIds = products.map((product) => product.id);
  const [{ data: brands, error: brandError }, { data: categories, error: categoryError }, { data: reviews, error: reviewError }] = await Promise.all([
    supabase.from('brands').select('*'),
    supabase.from('categories').select('*'),
    supabase.from('reviews').select('*').in('product_id', productIds).eq('status', 'APPROVED'),
  ]);

  if (brandError) throw new Error(`Supabase brands query failed: ${brandError.message}`);
  if (categoryError) throw new Error(`Supabase categories query failed: ${categoryError.message}`);
  if (reviewError) throw new Error(`Supabase reviews query failed: ${reviewError.message}`);

  const brandById = new Map((brands ?? []).map((brand) => [brand.id, brand as Brand]));
  const categoryById = new Map((categories ?? []).map((category) => [category.id, category as Category]));
  const reviewsByProduct = new Map<string, Review[]>();
  for (const review of (reviews ?? []) as Review[]) {
    if (!review.product_id) continue;
    const current = reviewsByProduct.get(review.product_id) ?? [];
    current.push(review);
    reviewsByProduct.set(review.product_id, current);
  }

  return products.map((product) => {
    const approvedReviews = reviewsByProduct.get(product.id) ?? [];
    const rating = approvedReviews.length
      ? Number((approvedReviews.reduce((sum, review) => sum + review.rating, 0) / approvedReviews.length).toFixed(1))
      : undefined;

    return {
      ...product,
      brand: product.brand_id ? brandById.get(product.brand_id) : undefined,
      category: product.category_id ? categoryById.get(product.category_id) : undefined,
      reviews: approvedReviews,
      rating,
      review_count: approvedReviews.length,
    };
  });
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').eq('status', 'ACTIVE').order('created_at', { ascending: false });
  return getProductRelations(requireData(data, error) as Product[]);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug) ?? null;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];
  return (await getProducts()).filter((product) => product.category_id === category.id);
}

export async function getProductsByBrand(brandSlug: string): Promise<Product[]> {
  const brand = await getBrandBySlug(brandSlug);
  if (!brand) return [];
  return (await getProducts()).filter((product) => product.brand_id === brand.id);
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('indexable', true).order('display_order');
  return requireData(data, error) as Category[];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*').eq('slug', slug).eq('indexable', true).maybeSingle();
  if (error) throw new Error(`Supabase category query failed: ${error.message}`);
  return data as Category | null;
}

export async function getUseCases(): Promise<UseCase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('use_cases').select('*').eq('indexable', true).order('name');
  return requireData(data, error) as UseCase[];
}

export async function getUseCaseBySlug(slug: string): Promise<UseCase | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('use_cases').select('*').eq('slug', slug).eq('indexable', true).maybeSingle();
  if (error) throw new Error(`Supabase use case query failed: ${error.message}`);
  return data as UseCase | null;
}

export async function getBrands(): Promise<Brand[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('*').eq('indexable', true).order('name');
  return requireData(data, error) as Brand[];
}

export async function getBrandBySlug(slug: string): Promise<Brand | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('brands').select('*').eq('slug', slug).eq('indexable', true).maybeSingle();
  if (error) throw new Error(`Supabase brand query failed: ${error.message}`);
  return data as Brand | null;
}

export async function getLocations(): Promise<Location[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('locations').select('*').eq('indexable', true).order('name');
  return requireData(data, error) as Location[];
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('locations').select('*').eq('slug', slug).eq('indexable', true).maybeSingle();
  if (error) throw new Error(`Supabase location query failed: ${error.message}`);
  return data as Location | null;
}

export async function getArticles(type?: Article['type']): Promise<Article[]> {
  const supabase = await createClient();
  let query = supabase.from('articles').select('*').eq('status', 'PUBLISHED').eq('indexable', true).order('published_at', { ascending: false });
  if (type) query = query.eq('type', type);
  const { data, error } = await query;
  return requireData(data, error) as Article[];
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('articles').select('*').eq('slug', slug).eq('status', 'PUBLISHED').eq('indexable', true).maybeSingle();
  if (error) throw new Error(`Supabase article query failed: ${error.message}`);
  return data as Article | null;
}

export async function getClusterArticles(pillarSlug: string): Promise<Article[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('articles').select('*').eq('pillar_slug', pillarSlug).eq('status', 'PUBLISHED').eq('indexable', true).order('published_at', { ascending: false });
  return requireData(data, error) as Article[];
}

export async function getApprovedReviews(productId?: string): Promise<Review[]> {
  const supabase = await createClient();
  let query = supabase.from('reviews').select('*').eq('status', 'APPROVED').order('created_at', { ascending: false });
  if (productId) query = query.eq('product_id', productId);
  const { data, error } = await query;
  return requireData(data, error) as Review[];
}

export async function getRedirectRules(): Promise<RedirectRule[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('redirects').select('*').eq('is_active', true);
  return requireData(data, error) as RedirectRule[];
}

export async function getSeoSettings(): Promise<SeoSettings> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('seo_settings').select('*').eq('id', 'global-seo-settings').single();
  return requireData(data, error) as SeoSettings;
}

export async function getSiteSettings() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', 'global').single();
  return requireData(data, error);
}

export async function getPublicRedirect(pathname: string): Promise<RedirectRule | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('redirects').select('*').eq('old_url', pathname).eq('is_active', true).maybeSingle();
  if (error) throw new Error(`Supabase redirect query failed: ${error.message}`);
  return data as RedirectRule | null;
}

export async function getBlockedDates(): Promise<{ date: string; reason: string }[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('blocked_dates').select('date,reason').order('date');
  return requireData(data, error) as { date: string; reason: string }[];
}

export async function getBookingsForAvailability(startDate: string, endDate: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('bookings').select('product_id,start_date,end_date,status').in('status', ['PENDING', 'CONFIRMED', 'RENTING', 'PAID', 'ACTIVE']).lte('start_date', endDate).gte('end_date', startDate);
  return requireData(data, error);
}

export async function getBookingByCode(bookingCode: string) {
  const supabase = await createClient();
  const { data, error } = await supabase.from('bookings').select('id,booking_code,status,total_price,deposit_amount,start_date,end_date,product_name').eq('booking_code', bookingCode).maybeSingle();
  if (error) throw new Error(`Supabase booking query failed: ${error.message}`);
  return data;
}

export async function getPublicProductsForBooking() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('id,name,slug,rental_price_per_day,deposit_amount,inventory_count,status').eq('status', 'ACTIVE').order('name');
  return requireData(data, error);
}

export async function getProductsForSearch(query: string) {
  const normalized = query.trim().toLocaleLowerCase('vi');
  if (!normalized) return [];
  return (await getProducts()).filter((product) => `${product.name} ${product.excerpt} ${product.description}`.toLocaleLowerCase('vi').includes(normalized));
}

export async function getProductsForSitemap() {
  return getProducts();
}

export async function getArticlesForSitemap() {
  return getArticles();
}

export async function getBrandsForSitemap() {
  return getBrands();
}

export async function getCategoriesForSitemap() {
  return getCategories();
}

export async function getUseCasesForSitemap() {
  return getUseCases();
}

export async function getLocationsForSitemap() {
  return getLocations();
}

export async function getProductCount() {
  return (await getProducts()).length;
}

export async function getTopRatedProducts(limit = 6) {
  return (await getProducts()).sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0)).slice(0, limit);
}

export async function getLatestArticles(limit = 6) {
  return (await getArticles()).slice(0, limit);
}

export async function getArticleRecommendations(article: Article) {
  const products = await getProducts();
  return products.filter((product) => article.related_product_ids?.includes(product.id));
}

export async function getProductsForUseCase(_useCaseSlug: string) {
  return getProducts();
}

export async function getRelatedProducts(productId: string, categoryId?: string) {
  const products = await getProducts();
  return products.filter((product) => product.id !== productId && (!categoryId || product.category_id === categoryId));
}
