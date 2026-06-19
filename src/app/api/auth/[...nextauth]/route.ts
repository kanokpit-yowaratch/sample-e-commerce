import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rateLimitMiddleware, RATE_LIMIT } from '@/lib/rate-limiter';

const handler = NextAuth(authOptions);

export async function GET(
	req: Request,
	context: { params: Promise<{ nextauth: string[] }> }
) {
	return handler(req, context);
}

export async function POST(
	req: Request,
	context: { params: Promise<{ nextauth: string[] }> }
) {
	const limitResponse = await rateLimitMiddleware(RATE_LIMIT.login)(req);
	if (limitResponse) return limitResponse;
	return handler(req, context);
}
