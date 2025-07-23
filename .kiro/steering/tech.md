# Technology Stack

## Framework & Runtime
- **Next.js 15** with App Router - React framework with server-side rendering
- **React 18** - Frontend library with latest features
- **TypeScript 5** - Type-safe JavaScript development
- **Node.js** - JavaScript runtime environment

## Authentication & Security
- **Clerk** - Modern authentication with OAuth2, JWT, and biometric support
- **Middleware** - Route protection using `@clerk/nextjs/server`
- Security headers configured in next.config.ts

## Database & Storage
- **NeonDB** - Serverless PostgreSQL database
- **Drizzle ORM** - Type-safe database operations and migrations
- **Cloudflare R2** - Object storage via S3-compatible API
- **AWS SDK v3** - S3 client for R2 integration

## Styling & UI
- **Tailwind CSS v4** - Utility-first CSS framework
- **PostCSS** - CSS processing with Tailwind plugin
- **Google Fonts** - Inter and Crimson Text font families
- Responsive design with mobile-first approach

## Development Tools
- **ESLint** - Code linting with Next.js and TypeScript rules
- **Turbopack** - Fast bundler for development (--turbopack flag)
- **ES Modules** - Modern module system (type: "module" in package.json)

## Key Libraries
- **react-dropzone** - File upload with drag & drop
- **swiper** - Touch slider for media carousels
- **@smithy/node-http-handler** - HTTP handling for AWS SDK

## Common Commands

### Development
```bash
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### Database Operations
```bash
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes directly to database
```

### Environment Setup
- Copy `.env.example` to `.env.local`
- Configure Clerk, Cloudflare R2, and NeonDB credentials
- Ensure DATABASE_URL, CLERK keys, and R2 credentials are set

## Build Configuration
- **Output**: Standalone for Docker deployment
- **Image optimization**: WebP and AVIF formats supported
- **Webpack**: Custom fallbacks for client-side builds
- **Security**: Comprehensive headers including CSP and frame options