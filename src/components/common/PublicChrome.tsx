'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import AnalyticsScript from '@/components/analytics/AnalyticsScript'

export default function PublicChrome() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <Header />
      <Footer />
      <AnalyticsScript />
    </>
  )
}
