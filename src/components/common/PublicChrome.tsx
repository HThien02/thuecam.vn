'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import AnalyticsScript from '@/components/analytics/AnalyticsScript'
import { Link2, MessageCircle } from 'lucide-react'

export default function PublicChrome() {
  const pathname = usePathname()
  if (pathname.startsWith('/admin')) return null

  return (
    <>
      <Header />
      <Footer />
      <AnalyticsScript />
      <div className="fixed bottom-5 left-5 z-40 flex flex-col gap-2" aria-label="Kênh liên hệ">
        <a href="https://zalo.me/0901234567" target="_blank" rel="noreferrer" aria-label="Liên hệ qua Zalo" className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110"><MessageCircle className="h-5 w-5" /></a>
        <a href="https://wa.me/84901234567" target="_blank" rel="noreferrer" aria-label="Liên hệ qua WhatsApp" className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500 text-white shadow-lg transition-transform hover:scale-110"><MessageCircle className="h-5 w-5" /></a>
        <a href="https://instagram.com/thuecam.vn" target="_blank" rel="noreferrer" aria-label="Liên hệ qua Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-orange-400 text-white shadow-lg transition-transform hover:scale-110"><Link2 className="h-5 w-5" /></a>
        <a href="https://facebook.com/thuecam.vn" target="_blank" rel="noreferrer" aria-label="Liên hệ qua Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1877f2] text-white shadow-lg transition-transform hover:scale-110"><Link2 className="h-5 w-5" /></a>
      </div>
    </>
  )
}
