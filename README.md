# 📖 MemoirVault

> A privacy-first web application for recording personal autobiographies in a secure digital space.

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

### 🎨 Modern User Experience
- **Responsive design** optimized for all devices
- **Intuitive interface** with accessibility compliance
- **Real-time upload progress** and error handling
- **Backdrop blur effects** and smooth animations
- **Dark/light theme** support (coming soon)

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

## 📚 Documentation

- **[About Project](ABOUT-PROJECT.md)** - Detailed project overview and architecture
- **[Deployment Guide](DEPLOYMENT.md)** - Step-by-step deployment instructions
- **[Security Policy](SECURITY.md)** - Security features and vulnerability reporting
- **[Changelog](CHANGELOG.md)** - Version history and updates

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
│   │   ├── dashboard/      # Dashboard pages
│   │   └── debug/          # Debug tools
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

---

<div align="center">
  <p>Built with ❤️ for privacy-conscious storytellers</p>
  <p>
    <a href="https://memoirvault.vercel.app">Live Demo</a> •
    <a href="https://github.com/enclave-projects/memoirvault/issues">Report Bug</a> •
    <a href="https://github.com/enclave-projects/memoirvault/discussions">Request Feature</a>
  </p>
</div>