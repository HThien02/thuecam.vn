'use client'

import { usePathname } from 'next/navigation'

export default function AdminRouteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname === '/admin/login') return <>{children}</>

  return <>{children}</>
}
