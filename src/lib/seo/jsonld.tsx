import React from 'react';
import { Product, Article, BreadcrumbItem, Location } from '@/types';
import { SITE_URL } from './metadata';

interface JsonLdScriptProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

export function JsonLdScript({ data }: JsonLdScriptProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// 1. Product Rental Schema
export function generateProductRentalJsonLd(product: Product) {
  const canonicalUrl = `${SITE_URL}/thiet-bi/${product.slug}`;

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    image: product.primary_image,
    description: product.excerpt || product.description.slice(0, 160),
    sku: product.sku,
    url: canonicalUrl,
    brand: {
      '@type': 'Brand',
      name: product.brand?.name || 'THUECAM',
    },
    offers: {
      '@type': 'Offer',
      price: product.rental_price_per_day,
      priceCurrency: 'VND',
      availability:
        product.status === 'ACTIVE' && product.inventory_count > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: canonicalUrl,
      itemCondition: 'https://schema.org/UsedCondition',
      businessFunction: 'https://schema.org/Rental',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: product.rental_price_per_day,
        priceCurrency: 'VND',
        unitText: 'DAY',
        name: 'Giá thuê theo ngày (24h)',
      },
    },
  };

  // Only include aggregateRating and review if genuine verified reviews exist
  if (product.rating && product.review_count && product.review_count > 0) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: product.rating,
      reviewCount: product.review_count,
      bestRating: 5,
      worstRating: 1,
    };

    if (product.reviews && product.reviews.length > 0) {
      schema.review = product.reviews.map((rev) => ({
        '@type': 'Review',
        author: {
          '@type': 'Person',
          name: rev.user_name,
        },
        reviewRating: {
          '@type': 'Rating',
          ratingValue: rev.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: rev.comment,
        datePublished: rev.created_at.split('T')[0],
      }));
    }
  }

  return schema;
}

// 2. BreadcrumbList Schema
export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`,
    })),
  };
}

// 3. Article Schema (Blog, Guide, Comparison, Landing)
export function generateArticleJsonLd(article: Article) {
  const url = `${SITE_URL}/${article.type === 'blog' ? 'blog' : article.type === 'guide' ? 'huong-dan' : article.type === 'comparison' ? 'so-sanh' : article.slug}/${article.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    headline: article.title,
    image: [article.featured_image],
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      '@type': 'Person',
      name: article.author_name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'THUECAM VIỆT NAM',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    description: article.excerpt,
  };
}

// 4. LocalBusiness / Organization Schema
export function generateLocalBusinessJsonLd(loc?: Location) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: loc ? `THUECAM - Chi nhánh ${loc.name}` : 'THUECAM VIỆT NAM',
    image: `${SITE_URL}/images/og-default.jpg`,
    '@id': `${SITE_URL}/#organization`,
    url: SITE_URL,
    telephone: loc ? loc.phone : '0901.234.567',
    priceRange: '100.000đ - 500.000đ/ngày',
    address: {
      '@type': 'PostalAddress',
      streetAddress: loc ? loc.address : '123 Nguyễn Thị Minh Khai, Phường Bến Thành, Quận 1',
      addressLocality: loc ? loc.name : 'TP. Hồ Chí Minh',
      addressCountry: 'VN',
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '08:00',
        closes: '21:30',
      },
    ],
  };
}
