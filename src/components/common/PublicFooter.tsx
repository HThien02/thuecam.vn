'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';
import AnalyticsScript from '@/components/analytics/AnalyticsScript';

export default function PublicFooter() {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <Footer />
      <AnalyticsScript />
    </>
  );
}
