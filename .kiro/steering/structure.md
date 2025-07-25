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
- **page.tsx** - Landing/home page with authentic startup messaging
- **loading.tsx** - Global loading UI
- **globals.css** - Global styles and Tailwind imports

#### Pages
- **dashboard/** - Main user dashboard
  - `page.tsx` - Dashboard page component
- **debug/** - Development and diagnostic tools
  - `page.tsx` - R2 storage testing and diagnostics interface

#### API Routes (`src/app/api/`)
- **entries/** - CRUD operations for memoir entries with comprehensive R2 file management
  - `route.ts` - GET all entries with media, POST new entries with drag & drop upload
  - `[id]/route.ts` - GET, DELETE individual entries with complete media cleanup and logging
- **user/** - User-specific operations and data management
  - `clear-all-data/route.ts` - Complete user data deletion with R2 cleanup and debugging
  - `storage/route.ts` - Real-time storage usage tracking and management
- **ai-helper/** - AI writing assistance integration
  - `route.ts` - Google Gemini API integration for context-aware memoir writing help
- **create-github-issue/** - User feedback and bug reporting system
  - `route.ts` - GitHub issue creation with user authentication and structured reporting
- **debug/** - Development and diagnostic tools
  - `r2-test/route.ts` - R2 storage consistency testing and file existence verification
- Follow Next.js API route conventions (route.ts files) with comprehensive error handling

### Components (`src/components/`)
- **Reusable React components** organized by feature with modern UI patterns
- **AuthRedirect.tsx** - Authentication flow handling and user routing
- **DashboardClient.tsx** - Main dashboard interface with real-time storage usage
- **MediaCarousel.tsx** - Media display component using Swiper with touch support
- **NewEntryForm.tsx** - Entry creation form with drag & drop, progress tracking, and dynamic timeouts
- **Timeline.tsx** - Chronological entry display with individual deletion and backdrop blur modals
- **Settings.tsx** - User settings, data management, and AI helper integration
- **StorageUsage.tsx** - Real-time storage usage visualization with percentage calculations
- **AIHelper.tsx** - AI writing assistant chat interface with Google Gemini integration
- **ReportIssue.tsx** - Structured GitHub issue reporting form with user authentication

### Library Code (`src/lib/`)
- **Shared utilities and configurations**
- **r2.ts** - Cloudflare R2 storage client with file existence checking and comprehensive error handling
- **db/** - Database-related code
  - `index.ts` - Database client configuration with connection pooling
  - `schema.ts` - Drizzle schema definitions with user storage tracking and cascade deletes
- **storage.ts** - Storage usage calculation, management utilities, and percentage calculations
- **utils.ts** - Common utility functions (file formatting, validation, etc.)

## Database Schema (`src/lib/db/schema.ts`)
- **entries** table - Main memoir entries with user association
- **media** table - Associated multimedia files with R2 file paths and proper cleanup
- **userStorage** table - Storage usage tracking and limits with real-time updates
- **Type exports** - TypeScript types for database entities
- **Foreign key relationships** with cascade deletes for data integrity
- **User isolation** - All tables include userId for proper data separation

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

## Recent Improvements
- **Enhanced R2 File Management** - Complete file deletion with existence checking
- **AI Integration** - Google Gemini API for writing assistance
- **Debug Tools** - Comprehensive storage testing and diagnostics
- **Modal UI Improvements** - Backdrop blur effects and smooth interactions
- **Upload Progress** - Real-time feedback with dynamic timeout handling
- **Issue Reporting** - Integrated GitHub issue creation system
- **Storage Management** - Real-time usage tracking with percentage calculations