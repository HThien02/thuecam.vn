import type { Metadata, Viewport } from 'next';
import './globals.css';
import PublicHeader from '@/components/common/PublicHeader';
import PublicFooter from '@/components/common/PublicFooter';
import NavigationProgress from '@/components/common/NavigationProgress';
import FloatingContactWidget from '@/components/common/FloatingContactWidget';
import { JsonLdScript, generateLocalBusinessJsonLd } from '@/lib/seo/jsonld';
import { constructMetadata } from '@/lib/seo/metadata';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0284c7',
};

export const metadata: Metadata = constructMetadata({
  title: 'Thuecam.vn - Cho Thuê Camera & Thiết Bị Quay',
  description:
    'Thuê camera, DJI Pocket, GoPro, Insta360, Flycam và thiết bị quay chất lượng tại Thuecam.vn. Đặt thuê nhanh chóng, tiện lợi.',
  canonicalPath: '/',
  ogImage: '/images/og-default.jpg',
  siteName: 'Thuecam.vn',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const organizationJsonLd = generateLocalBusinessJsonLd();

  return (
    <html lang="vi" className="scroll-smooth">
      <head>
        <JsonLdScript data={organizationJsonLd} />
      </head>
      <body className="site-theme min-h-screen flex flex-col bg-[#f0f7ff] text-slate-900 selection:bg-sky-200 selection:text-sky-950 antialiased">
        <NavigationProgress />
        <PublicHeader />
        <main className="flex-1">{children}</main>
        <PublicFooter />
        <FloatingContactWidget />
      </body>
    </html>
  );
}
