import { NextRequest, NextResponse } from 'next/server';

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory sliding window cache
const rateLimitMap = new Map<string, RateLimitRecord>();

// Clean up stale IPs periodically
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      record.timestamps = record.timestamps.filter((ts) => now - ts < 120_000);
      if (record.timestamps.length === 0) {
        rateLimitMap.delete(key);
      }
    }
  }, 60_000);
}

export interface RateLimitOptions {
  limit?: number; // Max requests allowed
  windowMs?: number; // Window size in milliseconds
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
}

/**
 * Extracts client IP safely from request headers
 */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}

/**
 * Checks and updates rate limit for a given key
 */
export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit ?? 60; // 60 requests
  const windowMs = options.windowMs ?? 60_000; // per 1 minute
  const now = Date.now();

  let record = rateLimitMap.get(key);
  if (!record) {
    record = { timestamps: [] };
    rateLimitMap.set(key, record);
  }

  // Filter timestamps within current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  const currentCount = record.timestamps.length;
  const remaining = Math.max(0, limit - currentCount - 1);
  const reset = Math.ceil((now + windowMs) / 1000);

  if (currentCount >= limit) {
    return {
      success: false,
      limit,
      remaining: 0,
      reset,
    };
  }

  record.timestamps.push(now);
  return {
    success: true,
    limit,
    remaining,
    reset,
  };
}

/**
 * Middleware/Route helper to enforce rate limit on an API request
 */
export function enforceApiRateLimit(
  request: NextRequest,
  options: RateLimitOptions = {}
): NextResponse | null {
  const ip = getClientIp(request);
  const path = request.nextUrl.pathname;
  const key = `${ip}:${path}`;

  const result = checkRateLimit(key, options);

  if (!result.success) {
    const retryAfter = Math.max(1, result.reset - Math.floor(Date.now() / 1000));
    return NextResponse.json(
      {
        error: 'Too Many Requests',
        message: 'Bạn đang gửi yêu cầu quá nhanh. Vui lòng thử lại sau giây lát.',
        retryAfter,
      },
      {
        status: 429,
        headers: {
          'Retry-After': String(retryAfter),
          'X-RateLimit-Limit': String(result.limit),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': String(result.reset),
        },
      }
    );
  }

  return null;
}
