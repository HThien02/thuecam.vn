import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { enforceApiRateLimit } from '@/lib/security/rate-limit';
import { verifySession, SESSION_COOKIE_NAME } from '@/lib/security/session';

interface PublicRedirect {
  old_url: string;
  new_url: string;
  status_code: 301 | 302;
  is_active: boolean;
}

async function getPublicRedirect(pathname: string, fullPath: string): Promise<PublicRedirect | null> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return null;

  try {
    const endpoint = new URL('/rest/v1/redirects', supabaseUrl);
    endpoint.searchParams.set('select', 'old_url,new_url,status_code,is_active');
    endpoint.searchParams.set('is_active', 'eq.true');
    endpoint.searchParams.set('limit', '1000');
    const response = await fetch(endpoint, {
      headers: { apikey: supabaseKey, Authorization: `Bearer ${supabaseKey}` },
      next: { revalidate: 60 },
    });
    if (!response.ok) return null;
    const redirects = await response.json() as PublicRedirect[];
    return redirects.find((rule) => rule.old_url === pathname || rule.old_url === fullPath) ?? null;
  } catch {
    return null;
  }
}

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get('host') || '';

  // 1. Rate Limit all API endpoints (/api/*)
  if (pathname.startsWith('/api/')) {
    const isLoginEndpoint = pathname.startsWith('/api/admin/auth/login');
    const rateLimitResponse = enforceApiRateLimit(request, {
      limit: isLoginEndpoint ? 5 : 60,
      windowMs: 60_000,
    });
    if (rateLimitResponse) {
      return rateLimitResponse;
    }
  }

  // 2. Admin Session Auth Guard (No localStorage, strictly HttpOnly Session Cookie)
  if (pathname.startsWith('/admin')) {
    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const isValidSession = Boolean(verifySession(sessionCookie));

    if (pathname === '/admin/login') {
      // If already logged in, redirect to admin dashboard
      if (isValidSession) {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
    } else {
      // Any other /admin/* route requires active session
      if (!isValidSession) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('from', pathname);
        return NextResponse.redirect(loginUrl);
      }
    }
  }

  // 3. Preview deployment safety: Add noindex header to any vercel.app preview URL or non-production host
  const isVercelPreview = host.includes('vercel.app') || host.includes('localhost');
  const response = NextResponse.next();

  if (isVercelPreview && !host.includes('thuecam.vn')) {
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  // 4. Global HTTP Security Headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  // 5. Canonical www to non-www 301 Redirect
  if (host.startsWith('www.thuecam.vn')) {
    const nonWwwUrl = new URL(
      `${pathname}${search}`,
      `https://thuecam.vn`
    );
    return NextResponse.redirect(nonWwwUrl, 301);
  }

  // 6. Configured 301 Redirect Rules (e.g. /thue-pocket-4 -> /thiet-bi/dji-pocket-4-creator)
  const fullPath = `${pathname}${search}`;
  const matchedRedirect = pathname.startsWith('/admin') || pathname.startsWith('/api/')
    ? null
    : await getPublicRedirect(pathname, fullPath);

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
