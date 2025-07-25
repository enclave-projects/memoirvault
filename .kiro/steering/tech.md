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
- **react-dropzone** - File upload with drag & drop functionality
- **swiper** - Touch slider for media carousels with navigation
- **@smithy/node-http-handler** - HTTP handling for AWS SDK
- **@google/generative-ai** - Google Gemini API integration for AI assistance
- **drizzle-orm** - Type-safe database operations and migrations

## AI Integration
- **Google Gemini API** - AI writing assistance for memoir creation
- **Context-aware suggestions** - Personalized writing help based on user content
- **Privacy-preserving** - AI assistance without compromising user data

## File Management
- **Cloudflare R2** - Cost-effective object storage with zero egress fees
- **AWS S3 SDK v3** - S3-compatible API for R2 integration
- **File existence checking** - Comprehensive R2 file management
- **Automatic cleanup** - Prevents orphaned files in storage
- **Dynamic timeouts** - Adaptive upload handling for large files

## Debug & Development Tools
- **R2 Storage Testing** - Built-in diagnostic tools for storage consistency
- **GitHub Integration** - Issue reporting system for user feedback
- **Comprehensive Logging** - Enhanced error handling and debugging
- **Real-time Monitoring** - Storage usage tracking and management

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
- Optional: Add GEMINI_API_KEY for AI writing assistance
- Optional: Add GITHUB_TOKEN, GITHUB_REPO_OWNER, GITHUB_REPO_NAME for issue reporting

## Build Configuration
- **Output**: Standalone for Docker deployment
- **Image optimization**: WebP and AVIF formats supported
- **Webpack**: Custom fallbacks for client-side builds
- **Security**: Comprehensive headers including CSP and frame options