import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Configuration constants
const PROTECTED_ROUTES = {
  pages: ['/profile/', '/dashboard/'],
  apis: ['/api/dashboard/'],
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

const isAdminUser = (role: string | undefined): boolean =>
  role === 'admin';

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

  // Handle authenticated users - role-based access control
  if (isAdminApiRoute(pathname) && !isAdminUser(token.role)) {
    return RESPONSES.forbidden();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/api/dashboard/:path*',
    '/dashboard/:path*',
    '/profile/:path*',
  ]
};
