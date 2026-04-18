import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getAdminSessionFromRequest } from '@/lib/auth';

// Public API routes that require no authentication.
// Prefix matches are used: /api/auth/* covers all auth sub-routes.
// For analytics, only POST (tracking) is public; other methods fall through to the deny gate.
const PUBLIC_API_ROUTES: Array<{ path: string; methods?: string[] }> = [
  { path: '/api/auth/' },
  { path: '/api/groups/create' },
  { path: '/api/groups/verify' },
  { path: '/api/stripe/webhook' },
  { path: '/api/health' },
  { path: '/api/registry/' },
  { path: '/api/analytics', methods: ['POST'] },
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Non-API routes (pages) keep the current permissive behavior.
  if (!pathname.startsWith('/api/')) {
    return NextResponse.next();
  }

  // Check if the request matches a public route.
  for (const rule of PUBLIC_API_ROUTES) {
    const pathMatches = pathname === rule.path ||
      pathname.startsWith(rule.path.endsWith('/') ? rule.path : rule.path + '/') ||
      pathname === rule.path.replace(/\/$/, '');

    if (pathMatches) {
      // If the rule restricts methods, only bypass auth for those methods.
      if (rule.methods && !rule.methods.includes(request.method.toUpperCase())) {
        break;
      }
      return NextResponse.next();
    }
  }

  // Deny-by-default for all other /api/* routes: require a valid session.
  const participantSession = getSessionFromRequest(request);
  const adminSession = getAdminSessionFromRequest(request);

  if (!participantSession && !adminSession) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/:path*'],
};
