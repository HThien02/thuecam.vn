'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function NavigationProgress() {
  const pathname = usePathname();
  const [navigationStartedFrom, setNavigationStartedFrom] = useState<string | null>(null);
  const isNavigating = navigationStartedFrom === pathname;
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!timeoutRef.current) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, [pathname]);

  useEffect(() => {
    const handleInternalNavigation = (event: MouseEvent) => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;
      const anchor = target.closest<HTMLAnchorElement>('a[href]');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download')) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      if (nextUrl.origin !== window.location.origin || nextUrl.href === window.location.href) return;

      setNavigationStartedFrom(pathname);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setNavigationStartedFrom(null);
        timeoutRef.current = null;
      }, 8000);
    };

    document.addEventListener('click', handleInternalNavigation);
    return () => {
      document.removeEventListener('click', handleInternalNavigation);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [pathname]);

  if (!isNavigating) return null;

  return (
    <div className="fixed inset-x-0 top-0 z-[100] flex h-1 items-center bg-sky-100" role="status" aria-live="polite">
      <span className="h-full w-2/3 origin-left animate-pulse rounded-r-full bg-sky-600" />
      <span className="sr-only">Đang tải trang mới</span>
      <span className="fixed right-4 top-4 inline-flex items-center gap-2 rounded-full border border-sky-100 bg-white px-3 py-2 text-xs font-bold text-slate-700 shadow-lg">
        <Loader2 className="size-4 animate-spin text-sky-600" aria-hidden="true" />
        Đang chuyển trang…
      </span>
    </div>
  );
}
