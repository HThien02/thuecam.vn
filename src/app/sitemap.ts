import type { MetadataRoute } from 'next';
import {
  getProducts,
  getCategories,
  getUseCases,
  getBrands,
  getLocations,
  getArticles,
} from '@/lib/data';
import { SITE_URL } from '@/lib/seo/metadata';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // 1. Static Core & Trust Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/thiet-bi`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    // Curated SEO Landing pages
    {
      url: `${SITE_URL}/thue-camera`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thue-camera-du-lich`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thue-camera-vlog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thue-camera-tiktok`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thue-action-camera`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/thue-camera-360`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/thue-flycam`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/thue-micro`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/thue-gimbal`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    // Trust & Policy Pages
    {
      url: `${SITE_URL}/gioi-thieu`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/chinh-sach-thue`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/chinh-sach-dat-coc`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/chinh-sach-huy`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/chinh-sach-bao-mat`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/dieu-khoan-su-dung`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${SITE_URL}/lien-he`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  // 2. Indexable Products
  const products = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p) => p.indexable && p.status === 'ACTIVE')
    .map((p) => ({
      url: `${SITE_URL}/thiet-bi/${p.slug}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    }));

  // 3. Indexable Categories
  const categories = await getCategories();
  const categoryRoutes: MetadataRoute.Sitemap = categories
    .filter((c) => c.indexable)
    .map((c) => ({
      url: `${SITE_URL}/danh-muc/${c.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // 4. Indexable Use Cases
  const useCases = await getUseCases();
  const useCaseRoutes: MetadataRoute.Sitemap = useCases
    .filter((u) => u.indexable)
    .map((u) => ({
      url: `${SITE_URL}/nhu-cau/${u.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // 5. Indexable Brands
  const brands = await getBrands();
  const brandRoutes: MetadataRoute.Sitemap = brands
    .filter((b) => b.indexable)
    .map((b) => ({
      url: `${SITE_URL}/thuong-hieu/${b.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    }));

  // 6. Indexable Real Locations
  const locations = await getLocations();
  const locationRoutes: MetadataRoute.Sitemap = locations
    .filter((l) => l.indexable)
    .map((l) => ({
      url: `${SITE_URL}/dia-diem/${l.slug}`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    }));

  // 7. Indexable Articles (Blog, Guides, Comparisons)
  const articles = await getArticles();
  const articleRoutes: MetadataRoute.Sitemap = articles
    .filter((a) => a.indexable && a.status === 'PUBLISHED')
    .map((a) => {
      let routePath = `/blog/${a.slug}`;
      if (a.type === 'guide') routePath = `/huong-dan/${a.slug}`;
      if (a.type === 'comparison') routePath = `/so-sanh/${a.slug}`;
      if (a.type === 'landing') routePath = `/${a.slug}`;

      return {
        url: `${SITE_URL}${routePath}`,
        lastModified: new Date(a.updated_at || a.published_at),
        changeFrequency: 'weekly' as const,
        priority: a.type === 'landing' ? 0.9 : 0.7,
      };
    });

  // Combine and return
  return [
    ...staticRoutes,
    ...productRoutes,
    ...categoryRoutes,
    ...useCaseRoutes,
    ...brandRoutes,
    ...locationRoutes,
    ...articleRoutes,
  ];
}
