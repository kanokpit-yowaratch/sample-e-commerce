# Sample E-Commerce

Small System E-Commerce by Next.js

## Tech Stack

`React` `TypeScript` `NextJS` `TanStack Query` `Tailwind CSS v4`

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

# Deployment

When deploying your Next.js 15 + Prisma application to Vercel, follow these best practices for database migrations and Prisma setup.

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
