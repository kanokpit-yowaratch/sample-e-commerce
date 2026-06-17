interface RateLimitConfig {
	windowMs: number;
	max: number;
	message?: string;
}

interface RateLimitEntry {
	count: number;
	resetTime: number;
}

const store = new Map<string, RateLimitEntry>();
const concurrentStore = new Map<string, number>();

const CLEANUP_INTERVAL = 60_000;

setInterval(() => {
	const now = Date.now();
	for (const [key, entry] of store) {
		if (now >= entry.resetTime) {
			store.delete(key);
		}
	}
}, CLEANUP_INTERVAL);

setInterval(() => {
	concurrentStore.clear();
}, 300_000);

function getClientIp(request: Request): string {
	return (
		request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
		request.headers.get('x-real-ip') ??
		'127.0.0.1'
	);
}

export async function rateLimit(
	request: Request,
	config: RateLimitConfig,
): Promise<{ success: boolean; headers: Record<string, string> }> {
	const ip = getClientIp(request);
	const key = `${config.windowMs}:${config.max}:${ip}`;
	const now = Date.now();
	const entry = store.get(key);

	const headers: Record<string, string> = {
		'X-RateLimit-Limit': String(config.max),
	};

	if (!entry || now >= entry.resetTime) {
		store.set(key, { count: 1, resetTime: now + config.windowMs });
		headers['X-RateLimit-Remaining'] = String(config.max - 1);
		headers['X-RateLimit-Reset'] = String(now + config.windowMs);
		return { success: true, headers };
	}

	if (entry.count >= config.max) {
		const retryAfter = Math.ceil((entry.resetTime - now) / 1000);
		headers['Retry-After'] = String(retryAfter);
		headers['X-RateLimit-Remaining'] = '0';
		headers['X-RateLimit-Reset'] = String(entry.resetTime);
		return { success: false, headers };
	}

	entry.count++;
	headers['X-RateLimit-Remaining'] = String(config.max - entry.count);
	headers['X-RateLimit-Reset'] = String(entry.resetTime);
	return { success: true, headers };
}

export function rateLimitMiddleware(config: RateLimitConfig) {
	return async (request: Request): Promise<Response | null> => {
		const result = await rateLimit(request, config);
		if (!result.success) {
			return Response.json(
				{ message: config.message ?? 'Too many requests. Please try again later.' },
				{
					status: 429,
					headers: result.headers,
				},
			);
		}
		return null;
	};
}

// ─── DDoS Protection ───────────────────────────────────────────────

const SUSPICIOUS_PATTERNS = [
	/{/i,
	/</i,
	/\/etc\//i,
	/\.\.\//i,
	/\.env/i,
	/union.*select/i,
	/drop.*table/i,
	/delete.*from/i,
	/%00/i,
	/base64/i,
	/eval\(/i,
	/document\.cookie/i,
	/alert\(/i,
];

const BLOCKED_USER_AGENTS = [
	/^$/,
	/curl/i,
	/wget/i,
	/python/i,
	/Go-http-client/i,
	/scanner/i,
	/nikto/i,
	/sqlmap/i,
];

export function isSuspiciousRequest(request: Request): boolean {
	const url = request.url.toLowerCase();
	const ua = request.headers.get('user-agent') ?? '';

	if (!ua || BLOCKED_USER_AGENTS.some((p) => p.test(ua))) {
		return true;
	}

	return SUSPICIOUS_PATTERNS.some((p) => p.test(url));
}

export function checkBodySize(request: Request, maxBytes: number = 5 * 1024 * 1024): boolean {
	const contentLength = request.headers.get('content-length');
	if (contentLength && parseInt(contentLength, 10) > maxBytes) {
		return false;
	}
	return true;
}

export function trackConcurrent(request: Request, maxConcurrent: number = 10): {
	allowed: boolean;
	release: () => void;
} {
	const ip = getClientIp(request);
	const current = concurrentStore.get(ip) ?? 0;

	if (current >= maxConcurrent) {
		return { allowed: false, release: () => {} };
	}

	concurrentStore.set(ip, current + 1);

	return {
		allowed: true,
		release: () => {
			const updated = concurrentStore.get(ip) ?? 1;
			if (updated <= 1) {
				concurrentStore.delete(ip);
			} else {
				concurrentStore.set(ip, updated - 1);
			}
		},
	};
}

export const RATE_LIMIT = {
	register: { windowMs: 15 * 60 * 1000, max: 5, message: 'Too many registration attempts. Please try again in 15 minutes.' },
	createOrder: { windowMs: 60 * 1000, max: 10, message: 'Too many order requests. Please slow down.' },
	uploadSlip: { windowMs: 60 * 1000, max: 5, message: 'Too many upload attempts. Please try again later.' },
	uploadImage: { windowMs: 60 * 1000, max: 20, message: 'Too many upload attempts. Please try again later.' },
	login: { windowMs: 15 * 60 * 1000, max: 10, message: 'Too many login attempts. Please try again in 15 minutes.' },
} as const;

export const DDoS_LIMIT = {
	global: { windowMs: 60 * 1000, max: 200, message: 'Global rate limit exceeded.' },
	burst: { windowMs: 10 * 1000, max: 30, message: 'Request burst detected. Please slow down.' },
} as const;
