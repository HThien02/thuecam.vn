import type { Metadata } from 'next';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://thuecam.vn';

interface ConstructMetadataParams {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
}

export function constructMetadata({
  title,
  description,
  canonicalPath = '',
  ogImage,
  noindex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
}: ConstructMetadataParams = {}): Metadata {
  const defaultTitle = 'THUECAM - Thuê Camera, Action Cam & Thiết Bị Quay Phim';
  const defaultDescription =
    'Dịch vụ cho thuê camera, DJI Pocket, GoPro, máy ảnh, flycam, gimbal, micro thu âm chính hãng giá từ 100K/ngày. Kiểm tra lịch trống và đặt thuê online tại THUECAM.';
  const defaultOgImage = `${SITE_URL}/images/og-default.jpg`;

  const finalTitle = title ? `${title}` : defaultTitle;
  const finalDescription = description || defaultDescription;
  const finalOgImage = ogImage || defaultOgImage;

  // Clean canonical URL
  const cleanPath = canonicalPath.startsWith('/') ? canonicalPath : `/${canonicalPath}`;
  const canonicalUrl = `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;

  const robotsConfig = noindex
    ? {
        index: false,
        follow: true,
        googleBot: {
          index: false,
          follow: true,
        },
      }
    : {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-video-preview': -1,
          'max-image-preview': 'large' as const,
          'max-snippet': -1,
        },
      };

  return {
    metadataBase: new URL(SITE_URL),
    title: finalTitle,
    description: finalDescription,
    alternates: {
      canonical: canonicalUrl,
    },
    robots: robotsConfig,
    openGraph: {
      type,
      locale: 'vi_VN',
      url: canonicalUrl,
      title: finalTitle,
      description: finalDescription,
      siteName: 'THUECAM.VN',
      images: [
        {
          url: finalOgImage,
          width: 1200,
          height: 630,
          alt: finalTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && { authors }),
    },
    twitter: {
      card: 'summary_large_image',
      title: finalTitle,
      description: finalDescription,
      images: [finalOgImage],
      creator: '@thuecamvn',
      site: '@thuecamvn',
    },
  };
}
