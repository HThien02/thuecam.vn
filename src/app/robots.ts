import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/thiet-bi',
          '/thiet-bi/*',
          '/danh-muc/*',
          '/nhu-cau/*',
          '/blog',
          '/blog/*',
          '/dia-diem/*',
          '/thuong-hieu/*',
          '/so-sanh/*',
          '/huong-dan/*',
          '/thue-*',
          '/gioi-thieu',
          '/chinh-sach-*',
          '/dieu-khoan-su-dung',
          '/lien-he',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/account',
          '/account/*',
          '/checkout',
          '/checkout/*',
          '/payment',
          '/payment/*',
          '/api/*',
          '/private/*',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
