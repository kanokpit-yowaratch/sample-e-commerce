---
name: nextjs16-proxy
description: Use when discussing middleware, proxy, route protection, access control, authentication, authorization, or security in this Next.js 16 project. Next.js 16 uses proxy.ts instead of middleware.ts.
---

# Next.js 16 Proxy (replaces Middleware)

This project uses **Next.js 16**, which renamed `middleware.ts` → `proxy.ts`.

## Key facts

- **Proxy file**: `src/proxy.ts` — this is the **active** request-intercepting layer (equivalent to middleware in Next.js ≤15)
- **Export**: `export default withAuth(function proxy(req) {...})` or named `export function proxy(request: NextRequest)`
- **Runtime**: Node.js (default, not Edge)

## Protection logic in this project

| Route | Protection |
|---|---|
| `/api/dashboard/*` | Requires authenticated session |
| `/api/dashboard/report/*` | Requires `admin` role |
| `/api/protected/*` | Requires authenticated session |
| `/dashboard/*` pages | Requires `admin` or `store` role; redirects to `/` if unauthorized |
| `/order-history` | Requires authenticated session; redirects to `/` if not logged in |

## Config matcher

```ts
export const config = {
  matcher: ['/api/dashboard/:path*', '/api/protected/:path*', '/dashboard/:path*', '/order-history/:path*'],
};
```

## Important notes

- `src/proxy.ts` is **NOT dead code** — it is the Next.js 16 replacement for middleware
- Auth is handled via `withAuth` from `next-auth/middleware` which wraps the proxy function
- The proxy only handles **optimistic checks** (redirect/block at network boundary); actual session verification happens in route handlers via `getSession()` from `@/lib/auth`
- Do NOT move this logic into a `middleware.ts` file — Next.js 16 uses `proxy.ts` only
