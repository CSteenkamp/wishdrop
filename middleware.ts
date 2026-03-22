import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getAdminSessionFromRequest } from '@/lib/auth';

// Routes that require participant session
const PROTECTED_API_ROUTES = [
  '/api/wishlist',
  '/api/people',
];

// Routes that require admin session
const ADMIN_API_ROUTES = [
  '/api/groups/',
];

// Public API routes (no auth needed)
const PUBLIC_API_ROUTES = [
  '/api/auth/login',
  '/api/auth/magic-link',
  '/api/auth/verify',
  '/api/auth/me',
  '/api/auth/logout',
  '/api/admin/auth',
  '/api/groups/create',
  '/api/groups/verify',
  '/api/stripe/webhook',
  '/api/stripe/checkout',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip non-API routes (pages handle their own auth via client-side redirects)
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Allow public routes
  for (const route of PUBLIC_API_ROUTES) {
    if (pathname === route || pathname.startsWith(route + '/')) {
      return NextResponse.next();
    }
  }

  // Check admin routes first
  for (const route of ADMIN_API_ROUTES) {
    if (pathname.startsWith(route)) {
      const adminSession = getAdminSessionFromRequest(request);
      const participantSession = getSessionFromRequest(request);
      if (!adminSession && !participantSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }
  }

  // Check protected routes
  for (const route of PROTECTED_API_ROUTES) {
    if (pathname.startsWith(route)) {
      const session = getSessionFromRequest(request);
      const adminSession = getAdminSessionFromRequest(request);
      if (!session && !adminSession) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      return NextResponse.next();
    }
  }

  // Default: allow (for any unmatched API routes)
  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
