import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { REDIRECTS } from '@/lib/data/mock-data';

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Preview deployment safety: Add noindex header to any vercel.app preview URL or non-production host
  const isVercelPreview = host.includes('vercel.app') || host.includes('localhost');
  const response = NextResponse.next();

  if (isVercelPreview && !host.includes('thuecam.vn')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 2. Canonical www to non-www 301 Redirect
  if (host.startsWith('www.thuecam.vn')) {
    const nonWwwUrl = new URL(
      `${pathname}${search}`,
      `https://thuecam.vn`
    );
    return NextResponse.redirect(nonWwwUrl, 301);
  }

  // 3. Configured 301 Redirect Rules (e.g. /thue-pocket-4 -> /thiet-bi/dji-pocket-4-creator)
  const fullPath = `${pathname}${search}`;
  const matchedRedirect = REDIRECTS.find(
    (rule) => rule.is_active && (rule.old_url === pathname || rule.old_url === fullPath)
  );

  if (matchedRedirect) {
    const targetUrl = matchedRedirect.new_url.startsWith('http')
      ? matchedRedirect.new_url
      : new URL(matchedRedirect.new_url, request.url).toString();

    return NextResponse.redirect(targetUrl, matchedRedirect.status_code || 301);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except static files, images, icons
     */
    '/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|icons).*)',
  ],
};
