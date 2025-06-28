import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration constants
const PROTECTED_ROUTES = {
  pages: ['/order-history', '/dashboard'],
  backoffice: ['/dashboard'],
  apis: ['/api/dashboard/', '/api/protected/'],
  adminApis: ['/api/dashboard/report/']
} as const;

const RESPONSES = {
  unauthorized: () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
  forbidden: () => NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
  redirectToHome: (req: NextRequest) => NextResponse.redirect(new URL('/', req.url))
} as const;

// Helper functions
const isApiRoute = (pathname: string): boolean =>
  pathname.startsWith('/api/');

const isProtectedApiRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.apis.some(route => pathname.startsWith(route));

const isAdminApiRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.adminApis.some(route => pathname.startsWith(route));

const isProtectedPageRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.pages.some(route => pathname.startsWith(route));

const isBackofficeRoute = (pathname: string): boolean =>
  PROTECTED_ROUTES.backoffice.some(route => pathname.startsWith(route));

const isAdminUser = (role: string | undefined): boolean =>
  role === 'admin';
const isStoreUser = (role: string | undefined): boolean =>
  role === 'store';

export default withAuth(function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.nextauth.token;

  // Handle unauthenticated users
  if (!token) {
    if (isApiRoute(pathname) && isProtectedApiRoute(pathname)) {
      return RESPONSES.unauthorized();
    }

    if (isProtectedPageRoute(pathname)) {
      return RESPONSES.redirectToHome(req);
    }

    return NextResponse.next();
  }

  if (isAdminApiRoute(pathname) && !isAdminUser(token.role)) {
    return RESPONSES.forbidden();
  }

  if (isBackofficeRoute(pathname) && (!isAdminUser(token.role) && !isStoreUser(token.role))) {
    return RESPONSES.redirectToHome(req);
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/api/dashboard/:path*',
    '/api/protected/:path*',
    '/dashboard/:path*',
    '/order-history/:path*',
  ]
};
