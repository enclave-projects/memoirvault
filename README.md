# 📖 MemoirVault v1.3.0

> A privacy-first web application for recording personal autobiographies in a secure digital space with public sharing capabilities and comprehensive changelog system.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare R2](https://img.shields.io/badge/Cloudflare-R2-F38020?style=flat-square&logo=cloudflare)](https://developers.cloudflare.com/r2/)
[![NeonDB](https://img.shields.io/badge/NeonDB-Postgres-336791?style=flat-square&logo=postgresql)](https://neon.tech/)

## ✨ Features

### 🔐 Privacy-First Design
- **End-to-end encryption** for sensitive data
- **No tracking or analytics** - your data stays yours
- **GDPR compliant** with full data export/deletion rights
- **Secure authentication** with Clerk (OAuth2)

### 📝 Rich Multimedia Journaling
- **Text entries** with rich formatting
- **Image uploads** with drag & drop support
- **Audio recordings** for voice diaries
- **Video clips** for visual memories
- **Timeline view** for chronological browsing

### 🤖 AI-Powered Assistance
- **Writing helper** using Google Gemini API
- **Context-aware suggestions** for memoir writing
- **Story prompts** and creative assistance
- **Integrated feedback system** with GitHub issue reporting

### 🗄️ Robust Data Management
- **Cloudflare R2 storage** for cost-effective file storage
- **NeonDB database** for scalable metadata management
- **Individual entry deletion** with complete cleanup
- **Storage usage tracking** with 2GB free tier
- **Comprehensive file management** preventing orphaned files

### 🌐 Public Sharing & Social Features
- **Public profiles** for sharing memoir journeys
- **Follow system** to connect with other memoir writers
- **Entry visibility control** - choose what to share publicly
- **Social feed** to discover and follow interesting stories
- **Optimistic UI updates** for instant user feedback
- **Advanced settings** with granular privacy controls

### 🎨 Modern User Experience
- **High-performance landing page** with 60fps smooth animations
- **Responsive design** optimized for all devices and screen sizes
- **Intuitive interface** with accessibility compliance (WCAG 2.1 AA)
- **Real-time upload progress** and comprehensive error handling
- **Hardware-accelerated animations** using CSS transforms and opacity
- **Optimized performance** with reduced bundle size and faster load times
- **Collapsible sidebar** with smooth navigation and proper scrolling
- **Mobile-first design** with touch-optimized interactions
- **Interactive Media Viewer** with fullscreen capabilities for images, videos, and audio
- **Modern Modal System** with backdrop blur effects and smooth transitions
- **Enhanced Mobile Navigation** with slide-out menu and touch gestures

### 📋 Changelog & Transparency
- **Beautiful Changelog Page** with glassmorphism design and version timeline
- **Release Documentation** with detailed feature breakdowns and improvements
- **What's New Navigation** with visual indicators for latest features
- **Coming Soon Roadmap** for future feature visibility
- **Professional Development Communication** with transparent progress updates
- **User Feedback Integration** through changelog and issue reporting system

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- A Clerk account for authentication
- A NeonDB database
- A Cloudflare R2 bucket

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/enclave-projects/memoirvault.git
   cd memoirvault
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your environment variables:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   
   # Cloudflare R2
   BUCKET_NAME=your-bucket-name
   ACCESS_KEY_ID=your-r2-access-key
   SECRET_ACCESS_KEY=your-r2-secret-key
   PUBLIC_DEVELOPMENT_URL=https://pub-your-bucket-id.r2.dev
   
   # NeonDB
   DATABASE_URL=postgresql://username:password@host/database
   
   # Optional: AI Features
   GEMINI_API_KEY=your-gemini-api-key
   
   # Optional: GitHub Integration
   GITHUB_TOKEN=your-github-token
   GITHUB_REPO_OWNER=your-username
   GITHUB_REPO_NAME=your-repo
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🆕 What's New in v1.3.0

### 📋 Changelog System
- **Interactive Changelog Page** - Beautiful `/changelog` route with glassmorphism design
- **Version Timeline** - Comprehensive release documentation with feature breakdowns
- **Navigation Integration** - "What's New" links in header and footer with visual indicators
- **Coming Soon Roadmap** - Transparency about upcoming features and improvements

### 🎨 Enhanced UI/UX
- **Interactive Media Viewer** - Fullscreen image, video, and audio playback with modal system
- **Modern Modal Design** - Backdrop blur effects and smooth transitions throughout the app
- **Enhanced Mobile Navigation** - Slide-out menu with touch gestures and improved accessibility
- **Professional Landing Page** - Updated navigation with changelog integration and visual indicators

### 🔧 Technical Improvements
- **Performance Optimizations** - Reduced bundle size and improved Core Web Vitals
- **Enhanced Error Handling** - Comprehensive logging and user feedback systems
- **Code Quality** - TypeScript improvements and better component architecture
- **Documentation Updates** - Comprehensive README and changelog documentation

## 📚 Documentation

- **[About Project](ABOUT-PROJECT.md)** - Detailed project overview and architecture
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Security Policy](SECURITY.md)** - Security features and vulnerability reporting
- **[Changelog](CHANGELOG.md)** - Version history and updates
- **[Live Changelog](/changelog)** - Interactive changelog page with latest features

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server with Turbopack
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate Drizzle migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes directly to database
```

### Project Structure

```
memoirvault/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── api/            # API routes
│   │   ├── changelog/      # Interactive changelog page
│   │   ├── dashboard/      # Dashboard pages
│   │   ├── debug/          # Debug tools
│   │   ├── public/         # Public profile system
│   │   └── support/        # Support pages
│   ├── components/         # React components
│   ├── lib/               # Utilities and configurations
│   │   ├── db/            # Database schema and client
│   │   └── r2.ts          # Cloudflare R2 client
│   └── middleware.ts      # Authentication middleware
├── drizzle/               # Database migrations
├── public/                # Static assets
└── docs/                  # Documentation files
```

## 🔧 Configuration

### Clerk Authentication
1. Create a Clerk application at [clerk.com](https://clerk.com)
2. Configure your domain and authentication methods
3. Add your publishable and secret keys to `.env.local`

### Cloudflare R2 Storage
1. Create an R2 bucket in Cloudflare dashboard
2. Generate R2 API tokens with read/write permissions
3. Configure public access for file serving

### NeonDB Database
1. Create a database at [neon.tech](https://neon.tech)
2. Copy the connection string to your environment variables
3. Run migrations to set up the schema

## 🚀 Deployment

Deploy MemoirVault to Vercel for full Next.js functionality:

```bash
# Deploy to Vercel
vercel deploy --prod
```

**Features:**
- Full Next.js features with serverless functions
- Automatic deployments from Git
- Edge functions and middleware support
- Built-in analytics and monitoring

For detailed deployment instructions, see [Deployment Guide](DEPLOYMENT.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests and linting (`npm run lint`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## 🐛 Bug Reports & Feature Requests

- **Security Issues**: Please report to security@memoirvault.com
- **Bug Reports**: Use GitHub Issues or the in-app AI Helper
- **Feature Requests**: Open a GitHub Discussion
- **General Questions**: Use GitHub Discussions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js** for the amazing React framework
- **Clerk** for seamless authentication
- **Cloudflare** for cost-effective R2 storage
- **Neon** for serverless PostgreSQL
- **Vercel** for deployment platform
- **Google** for Gemini AI API

## 📊 Stats

![GitHub stars](https://img.shields.io/github/stars/enclave-projects/memoirvault?style=social)
![GitHub forks](https://img.shields.io/github/forks/enclave-projects/memoirvault?style=social)
![GitHub issues](https://img.shields.io/github/issues/enclave-projects/memoirvault)
![GitHub pull requests](https://img.shields.io/github/issues-pr/enclave-projects/memoirvault)

## 🎯 Key Highlights

- **🔐 Privacy-First**: End-to-end encryption with no tracking or analytics
- **📱 Modern UI**: Glassmorphism design with 60fps animations and responsive layout
- **🤖 AI-Powered**: Google Gemini integration for writing assistance and story prompts
- **🌐 Social Features**: Public profiles, follow system, and social feed for memoir sharing
- **📋 Transparent Development**: Interactive changelog with comprehensive release documentation
- **⚡ High Performance**: Optimized for Core Web Vitals with hardware-accelerated animations
- **🛡️ Secure Storage**: Cloudflare R2 with comprehensive file management and cleanup
- **📊 Usage Tracking**: Real-time storage monitoring with 2GB free tier

---

<div align="center">
  <p>Built with ❤️ for privacy-conscious storytellers</p>
  <p>
    <a href="https://memoirvault.vercel.app">Live Demo</a> •
    <a href="https://memoirvault.vercel.app/changelog">What's New</a> •
    <a href="https://github.com/enclave-projects/memoirvault/issues">Report Bug</a> •
    <a href="https://github.com/enclave-projects/memoirvault/discussions">Request Feature</a>
  </p>
</div>
