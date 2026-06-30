# Sample E-Commerce

Small System E-Commerce by Next.js 16

## Tech Stack

`React` `TypeScript` `Next.js 16` `TanStack Query` `Tailwind CSS v4` `Prisma` `Zustand`

## Proxy (Next.js 16 Middleware)

This project uses `src/proxy.ts` (Next.js 16 replaces `middleware.ts` with `proxy.ts`) for:

- **DDoS protection** — rate limiting, suspicious request detection, body size check, concurrent request tracking
- **Authentication** — protects `/api/protected/*`, `/api/dashboard/*`, `/dashboard/*`, `/order-history/*`, `/payment-request`
- **Role-based access** — restricts `/dashboard/*` and `/api/dashboard/*` to `admin` / `store` roles

See `src/proxy.ts` for the full config.

## Environment configuration

Create `.env` file and set variable

```bash
# for client component
NEXT_PUBLIC_API="http://localhost:3000"

# for server component
API_URL="http://localhost:3000"

# database
DATABASE_URL="[DATABASE_URL]"

# API Upload URL
UPLOAD_API="[API_UPLOAD_URL]"
# API Upload Key
UPLOAD_KEY="[API_UPLOAD_KEY]"

# EasySlip API
EASYSLIP_API_URL="https://api.easyslip.com/v2/verify/bank"
EASYSLIP_API_KEY="[EASYSLIP_API_KEY]"

SALT_ROUNDS="10"
```

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

# Deployment

When deploying your Next.js 16 + Prisma application to Vercel, follow these best practices for database migrations and Prisma setup.

## Setup in `package.json`

Add these scripts to your `package.json`:

```json
"scripts": {
  "build": "prisma generate && next build",
  "postinstall": "prisma generate",
  "prisma:migrate": "prisma migrate deploy"
}
```

## Database Migrations

For proper database migration management:

**Never run migrations automatically on every install**

Remove migrations from `postinstall` to prevent unintended schema changes

**Configure Vercel to run migrations during deployment**

In your Vercel project settings, customize the build command:

```
npm run prisma:migrate && npm run build
```

**Run migrations manually when needed**

During local development or before important deployments:

```bash
npm run prisma:migrate
```
