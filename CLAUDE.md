# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Saasfly is an enterprise-grade Next.js SaaS boilerplate built with a monorepo architecture using Turborepo. It provides a complete solution for building SaaS applications with authentication (NextAuth.js), payments (Stripe), database (PostgreSQL with Kysely), and internationalization.

**Key Technologies:**
- Next.js 14 with App Directory
- NextAuth.js for authentication
- tRPC for type-safe APIs
- Kysely for type-safe SQL queries (Prisma for schema management only)
- PostgreSQL database
- Stripe for payments
- Bun as package manager
- Turborepo for monorepo management

## Development Commands

### Initial Setup
```bash
# Install dependencies
bun install

# Setup environment
cp .env.example .env.local

# Push database schema (requires POSTGRES_URL in .env.local)
bun db:push
```

### Development
```bash
# Run all apps in development mode
bun run dev

# Run Next.js app only (excludes Stripe webhook handler)
bun run dev:web

# Start Next.js production server
bun run start
```

### Building
```bash
# Build all apps and packages
bun run build

# Build specific workspace
turbo build --filter @saasfly/nextjs
```

### Database
```bash
# Push schema changes to database (from packages/db/)
bun db:push

# Or from root
cd ./packages/db/ && bun db:push
```

### Code Quality
```bash
# Lint all packages
bun run lint

# Auto-fix lint issues
bun run lint:fix

# Format check
bun run format

# Auto-format code
bun run format:fix

# Type check all packages
bun run typecheck

# Run all quality checks (used in CI)
bun run build lint format typecheck
```

### Cleaning
```bash
# Clean all node_modules
bun run clean

# Clean workspace build artifacts
bun run clean:workspaces
```

## Monorepo Structure

### Apps
- **apps/nextjs**: Main Next.js application
- **apps/auth-proxy**: Authentication proxy service

### Packages
- **packages/api**: tRPC API routes and business logic
- **packages/auth**: Authentication utilities (Clerk/NextAuth)
- **packages/db**: Database schema (Prisma) and Kysely types
- **packages/stripe**: Stripe integration and webhooks
- **packages/ui**: Shared UI components (Shadcn/ui based)
- **packages/common**: Common utilities

### Tooling
- **tooling/eslint-config**: Shared ESLint configuration
- **tooling/prettier-config**: Shared Prettier configuration
- **tooling/tailwind-config**: Shared Tailwind CSS configuration
- **tooling/typescript-config**: Shared TypeScript configuration

## Architecture

### Database Layer (Kysely + Prisma)

**Important: Dual ORM approach**
- **Prisma**: Used ONLY for schema definition and migrations (schema.prisma)
- **Kysely**: Used for ALL runtime database queries (type-safe SQL)
- After modifying [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma), run `bun db:push` to generate Kysely types

**Schema Location**: [packages/db/prisma/schema.prisma](packages/db/prisma/schema.prisma)

**Key Models:**
- `Customer`: Subscription and Stripe data
- `User`, `Account`, `Session`, `VerificationToken`: NextAuth.js tables
- `K8sClusterConfig`: Example business logic (K8s cluster management)

### API Layer (tRPC)

**Structure**: [packages/api/src/](packages/api/src/)
- [root.ts](packages/api/src/root.ts): Root router combining all sub-routers
- [trpc.ts](packages/api/src/trpc.ts): tRPC context and middleware
- [router/](packages/api/src/router/): Individual route handlers
  - [auth.ts](packages/api/src/router/auth.ts): Authentication endpoints
  - [customer.ts](packages/api/src/router/customer.ts): Customer/subscription management
  - [stripe.ts](packages/api/src/router/stripe.ts): Stripe integration
  - [k8s.ts](packages/api/src/router/k8s.ts): Example business logic

**Server-side usage** in Next.js: [apps/nextjs/src/trpc/server.ts](apps/nextjs/src/trpc/server.ts)
- Uses RSC (React Server Component) link for direct procedure calls
- No HTTP overhead when calling from server components

**Client-side usage**: Uses standard tRPC React hooks with React Query

### Authentication

**NextAuth.js** (default):
- Middleware: [apps/nextjs/src/middleware.ts](apps/nextjs/src/middleware.ts) imports from [apps/nextjs/src/utils/nextauth.ts](apps/nextjs/src/utils/nextauth.ts)
- Configuration: [packages/auth/nextauth.ts](packages/auth/nextauth.ts)
- Auth context available in tRPC via session object
- Supports GitHub OAuth and Email (Magic Link) providers
- Session strategy: JWT
- Admin access determined by `ADMIN_EMAIL` environment variable

### App Routing (Next.js App Directory)

**Route structure** in [apps/nextjs/src/app/](apps/nextjs/src/app/):

```
[lang]/                    # i18n routing
├── (marketing)/          # Public marketing pages (blog, pricing, home)
├── (dashboard)/          # Protected dashboard pages
├── (auth)/               # Auth pages (login, register)
├── (editor)/             # Editor interface
└── (docs)/               # Documentation pages

admin/                     # Admin-only section
├── (dashboard)/          # Admin dashboard
└── login/                # Admin login

api/
├── auth/[...nextauth]/   # NextAuth endpoints
├── trpc/edge/[trpc]/     # tRPC edge endpoints
└── webhooks/stripe/      # Stripe webhook handler
```

**i18n**: Route structure uses `[lang]` dynamic segment for internationalization

### Content Management

**Contentlayer2**: MDX-based content management
- Config: [apps/nextjs/contentlayer.config.ts](apps/nextjs/contentlayer.config.ts)
- Content types: Doc, Guide, Post, Author, Page
- Location: [apps/nextjs/src/content/](apps/nextjs/src/content/)
- Build step: `contentlayer2 build` runs before Next.js build

### Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Re-usable components in [packages/ui/src/](packages/ui/src/)
- Shared config in [tooling/tailwind-config/](tooling/tailwind-config/)

## Environment Variables

**Location**: `.env.local` (copy from `.env.example`)

**Required variables:**
- `POSTGRES_URL`: PostgreSQL connection string
- `NEXTAUTH_URL`: App URL (e.g., http://localhost:3000)
- `NEXTAUTH_SECRET`: Secret for JWT encryption (generate with `openssl rand -base64 32`)
- `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET`: GitHub OAuth app credentials
- `STRIPE_API_KEY`, `STRIPE_WEBHOOK_SECRET`: Stripe integration
- `NEXT_PUBLIC_STRIPE_*_PRICE_ID`: Stripe product/price IDs
- `RESEND_API_KEY`, `RESEND_FROM`: Email service for magic links

**Admin access:**
- Set `ADMIN_EMAIL` to comma-separated list of admin emails
- Access admin dashboard at `/admin/dashboard`

## Working with Workspaces

**Filter commands to specific workspace:**
```bash
# Build only Next.js app
turbo build --filter @saasfly/nextjs

# Dev only specific packages
turbo dev --filter @saasfly/api --filter @saasfly/db
```

**Adding new packages:**
```bash
bun run gen
```

## Payment Integration

**Stripe setup:**
1. Configure Stripe product/price IDs in `.env.local`
2. Webhook endpoint: `/api/webhooks/stripe`
3. Subscription logic in [packages/api/src/router/stripe.ts](packages/api/src/router/stripe.ts)
4. Customer management in [packages/api/src/router/customer.ts](packages/api/src/router/customer.ts)

**Subscription plans**: FREE, PRO, BUSINESS (defined in schema)

## CI/CD

**GitHub Actions**: [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Runs on PR and push to main
- Steps: build → lint → format → typecheck
- Uses PostgreSQL service container for database

## Important Notes

- **Package manager**: MUST use Bun (specified in `packageManager` field)
- **Database queries**: Always use Kysely, never Prisma Client
- **Schema changes**: Edit [schema.prisma](packages/db/prisma/schema.prisma) → run `bun db:push`
- **Workspace dependencies**: Use `workspace:*` protocol for internal packages
- **Authentication**: Using NextAuth.js with GitHub OAuth and email magic links
- **tRPC context**: Access user via `ctx.session.user` in protected procedures
