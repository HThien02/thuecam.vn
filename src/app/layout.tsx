import type { Metadata, Viewport } from 'next';
import './globals.css';
import PublicChrome from '@/components/common/PublicChrome';
import { JsonLdScript, generateLocalBusinessJsonLd } from '@/lib/seo/jsonld';
import { constructMetadata } from '@/lib/seo/metadata';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#6D55C7',
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
      <body className="min-h-screen flex flex-col bg-[#FFF8F9] text-slate-900 selection:bg-pink-400 selection:text-white antialiased">
        <PublicChrome />
        <main className="flex-1">{children}</main>
      </body>
    </html>
  );
}
