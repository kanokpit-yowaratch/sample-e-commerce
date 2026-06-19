import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import {
	rateLimit,
	isSuspiciousRequest,
	checkBodySize,
	trackConcurrent,
	DDoS_LIMIT,
} from '@/lib/rate-limiter';

// Configuration constants
const PROTECTED_ROUTES = {
	pages: ['/order-history', '/dashboard'],
	backoffice: ['/dashboard'],
	apis: ['/api/dashboard/', '/api/protected/'],
	adminApis: ['/api/dashboard/'],
} as const;

const RESPONSES = {
	unauthorized: () => NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
	forbidden: () => NextResponse.json({ error: 'Forbidden' }, { status: 403 }),
	redirectToHome: (req: NextRequest) => NextResponse.redirect(new URL('/', req.url)),
} as const;

// Helper functions
const isApiRoute = (pathname: string): boolean => pathname.startsWith('/api/');

const isProtectedApiRoute = (pathname: string): boolean =>
	PROTECTED_ROUTES.apis.some((route) => pathname.startsWith(route));

const isAdminApiRoute = (pathname: string): boolean =>
	PROTECTED_ROUTES.adminApis.some((route) => pathname.startsWith(route));

const isProtectedPageRoute = (pathname: string): boolean =>
	PROTECTED_ROUTES.pages.some((route) => pathname.startsWith(route));

const isBackofficeRoute = (pathname: string): boolean =>
	PROTECTED_ROUTES.backoffice.some((route) => pathname.startsWith(route));

const isAdminUser = (role: string | undefined): boolean => role === 'admin';
const isStoreUser = (role: string | undefined): boolean => role === 'store';

export default withAuth(async function middleware(req) {
	const { pathname } = req.nextUrl;
	const token = req.nextauth.token;

	// ─── DDoS Protection Layer ─────────────────────────────────────

	if (isSuspiciousRequest(req)) {
		return new NextResponse(null, { status: 403 });
	}

	if (!checkBodySize(req, 5 * 1024 * 1024)) {
		return NextResponse.json({ error: 'Request entity too large' }, { status: 413 });
	}

	const burstResult = await rateLimit(req, DDoS_LIMIT.burst);
	if (!burstResult.success) {
		return NextResponse.json(
			{ error: 'Request burst detected. Please slow down.' },
			{ status: 429, headers: burstResult.headers },
		);
	}

	const globalResult = await rateLimit(req, DDoS_LIMIT.global);
	if (!globalResult.success) {
		return NextResponse.json(
			{ error: 'Global rate limit exceeded.' },
			{ status: 429, headers: globalResult.headers },
		);
	}

	const concurrent = trackConcurrent(req, 20);
	if (!concurrent.allowed) {
		return NextResponse.json({ error: 'Too many concurrent requests' }, { status: 429 });
	}

	// ─── Auth Layer ────────────────────────────────────────────────

	if (!token) {
		if (isApiRoute(pathname) && isProtectedApiRoute(pathname)) {
			concurrent.release();
			return RESPONSES.unauthorized();
		}

		if (isProtectedPageRoute(pathname)) {
			concurrent.release();
			return RESPONSES.redirectToHome(req);
		}

		concurrent.release();
		return NextResponse.next();
	}

	if (isAdminApiRoute(pathname) && !isAdminUser(token.role)) {
		concurrent.release();
		return RESPONSES.forbidden();
	}

	if (isBackofficeRoute(pathname) && !isAdminUser(token.role) && !isStoreUser(token.role)) {
		concurrent.release();
		return RESPONSES.redirectToHome(req);
	}

	concurrent.release();
	return NextResponse.next();
}, {
	callbacks: {
		authorized: () => true,
	},
});

export const config = {
	matcher: ['/api/:path*', '/dashboard/:path*', '/order-history/:path*'],
};
