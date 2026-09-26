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
  title: 'THUECAM - Thuê Máy Xịn, Chụp Chill Hết Ý | Cho Thuê Camera & Thiết Bị Quay Phim',
  description:
    'Dịch vụ cho thuê camera du lịch, máy quay vlog DJI Pocket 4, GoPro 13, flycam, gimbal, micro thu âm giá từ 100K/ngày. Nhận máy ngay, đầy đủ phụ kiện tại TP.HCM & Hà Nội.',
  canonicalPath: '/',
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
