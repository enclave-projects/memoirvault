# Project Structure

## Root Directory
```
memoirvault/
├── .kiro/                   # Kiro IDE configuration and steering
├── drizzle/                 # Database migrations (auto-generated)
├── public/                  # Static assets
├── src/                     # Source code
├── .env.example             # Environment variables template
├── .env.local               # Local environment (not in git)
├── drizzle.config.ts        # Drizzle ORM configuration
├── eslint.config.mjs        # ESLint configuration
├── next.config.ts           # Next.js configuration
├── package.json             # Dependencies and scripts
├── postcss.config.mjs       # PostCSS configuration
└── tsconfig.json            # TypeScript configuration
```

## Source Code Organization (`src/`)

### App Router Structure (`src/app/`)
- **Next.js 15 App Router** - File-based routing system
- **layout.tsx** - Root layout with Clerk provider and fonts
- **page.tsx** - Landing/home page
- **loading.tsx** - Global loading UI
- **globals.css** - Global styles and Tailwind imports

#### Pages
- **dashboard/** - Main user dashboard
  - `page.tsx` - Dashboard page component

#### API Routes (`src/app/api/`)
- **entries/** - CRUD operations for memoir entries
- **test-entries/** - Development/testing endpoints
- Follow Next.js API route conventions (route.ts files)

### Components (`src/components/`)
- **Reusable React components** organized by feature
- **AuthRedirect.tsx** - Authentication flow handling
- **DashboardClient.tsx** - Main dashboard interface
- **MediaCarousel.tsx** - Media display component using Swiper
- **NewEntryForm.tsx** - Entry creation form with file upload
- **Timeline.tsx** - Chronological entry display

### Library Code (`src/lib/`)
- **Shared utilities and configurations**
- **r2.ts** - Cloudflare R2 storage client and utilities
- **db/** - Database-related code
  - `index.ts` - Database client configuration
  - `schema.ts` - Drizzle schema definitions

## Database Schema (`src/lib/db/schema.ts`)
- **entries** table - Main memoir entries
- **media** table - Associated multimedia files
- **Type exports** - TypeScript types for database entities
- **Foreign key relationships** with cascade deletes

## Configuration Files

### TypeScript (`tsconfig.json`)
- **ES2017 target** for modern JavaScript features
- **Path aliases** - `@/*` maps to `./src/*`
- **Strict mode disabled** for flexibility
- **Next.js plugin** integration

### Next.js (`next.config.ts`)
- **ES module syntax** (export default)
- **Security headers** configuration
- **Image optimization** for Cloudflare R2 domains
- **Webpack customization** for client-side builds
- **Standalone output** for Docker deployment

### Drizzle (`drizzle.config.ts`)
- **PostgreSQL dialect** configuration
- **Schema path** pointing to `src/lib/db/schema.ts`
- **Migration output** to `./drizzle` directory

## File Naming Conventions
- **PascalCase** for React components (`DashboardClient.tsx`)
- **camelCase** for utilities and non-component files (`r2.ts`)
- **kebab-case** for directories when needed
- **route.ts** for API route handlers
- **page.tsx** for App Router pages
- **layout.tsx** for App Router layouts

## Import Patterns
- **Absolute imports** using `@/` alias for src directory
- **Named exports** preferred over default exports for utilities
- **Type imports** using `import type` for TypeScript types
- **Environment variables** accessed via `process.env`

## Middleware (`src/middleware.ts`)
- **Clerk authentication** middleware
- **Route matching** configuration for protected routes
- **API route protection** included in matcher