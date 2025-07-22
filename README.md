# 📖 MemoirVault

> **Your Life Story, Completely Private**

A privacy-first web application that allows users to securely record their autobiographies in a private digital space. Built with modern technologies and designed with data sovereignty in mind.

![MemoirVault Banner](https://via.placeholder.com/1200x400/004838/E2FB6C?text=MemoirVault+-+Your+Private+Digital+Autobiography)

## ✨ Features

### 🔒 **Privacy-First Design**
- **End-to-end encryption** for all user data
- **No tracking or analytics** - your data stays yours
- **Complete data sovereignty** with export/delete capabilities
- **Biometric authentication** support for enhanced security

### 📝 **Rich Multimedia Journaling**
- **Text entries** with rich formatting
- **Audio recordings** for voice diaries
- **Photo uploads** to capture visual memories
- **Video support** for dynamic storytelling
- **Multiple file formats** supported (JPEG, PNG, MP4, MP3, etc.)

### 🎨 **Beautiful User Experience**
- **Responsive design** that works on all devices
- **Timeline view** for chronological browsing
- **Custom media carousel** for multiple files
- **Drag & drop** file uploads
- **Real-time statistics** tracking

### ☁️ **Modern Infrastructure**
- **Cloudflare R2** for cost-effective, global file storage
- **NeonDB** serverless PostgreSQL database
- **Clerk Authentication** for secure user management
- **Next.js 15** with App Router for optimal performance

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Cloudflare account with R2 storage
- NeonDB account
- Clerk account for authentication

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
   
   Fill in your credentials:
   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Cloudflare R2
   BUCKET_NAME=your_bucket_name
   ACCESS_KEY_ID=your_r2_access_key
   SECRET_ACCESS_KEY=your_r2_secret_key
   PUBLIC_DEVELOPMENT_URL=https://pub-your-bucket-id.r2.dev

   # NeonDB
   DATABASE_URL=your_neon_database_url
   ```

4. **Set up the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## 🏗️ Architecture

### Tech Stack

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 15 + React 18 | Server-side rendering, optimal performance |
| **Authentication** | Clerk | Secure user management with biometric support |
| **Database** | NeonDB (PostgreSQL) | Serverless, scalable data storage |
| **File Storage** | Cloudflare R2 | Cost-effective object storage with global CDN |
| **Styling** | Tailwind CSS | Utility-first CSS framework |
| **ORM** | Drizzle ORM | Type-safe database operations |

### Database Schema

```sql
-- Entries table
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Media table
CREATE TABLE media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entry_id UUID REFERENCES entries(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  r2_key TEXT NOT NULL,
  public_url TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 📱 Usage

### Creating Your First Entry

1. **Sign up** or **log in** to your account
2. Navigate to your **Dashboard**
3. Click **"Create Entry"**
4. Add a **title** and **description**
5. **Drag & drop** or **select files** to upload
6. Click **"Create Entry"** to save

### Viewing Your Timeline

1. From the dashboard, click **"View All"**
2. Browse your entries in **chronological order**
3. Click on **images** for fullscreen viewing
4. **Play videos and audio** directly in the timeline
5. Use the **media carousel** for multiple files

### Managing Your Data

- **Export**: Download all your data in standard formats
- **Delete**: Permanently remove entries and associated files
- **Privacy Settings**: Control access and visibility
- **Statistics**: Track your journaling progress

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Database
npm run db:generate  # Generate database migrations
npm run db:push      # Push schema changes to database
npm run db:migrate   # Run database migrations
```

### Project Structure

```
memoirvault/
├── src/
│   ├── app/                 # Next.js App Router pages
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   └── layout.tsx      # Root layout
│   ├── components/         # React components
│   │   ├── DashboardClient.tsx
│   │   ├── NewEntryForm.tsx
│   │   ├── Timeline.tsx
│   │   └── MediaCarousel.tsx
│   └── lib/               # Utilities and configurations
│       ├── db/            # Database schema and client
│       └── r2.ts          # Cloudflare R2 client
├── drizzle/              # Database migrations
├── public/               # Static assets
└── package.json
```

### Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

## 🔐 Security & Privacy

### Data Protection
- **Client-side encryption** before upload
- **Secure file storage** with Cloudflare R2
- **Database encryption** at rest and in transit
- **No third-party tracking** or analytics

### Authentication
- **Multi-factor authentication** support
- **Biometric login** options
- **Session management** with automatic expiry
- **OAuth2 compliance** through Clerk

### Compliance
- **GDPR compliant** with data export/deletion
- **Privacy by design** architecture
- **Transparent data handling** policies
- **User control** over all personal data

## 📊 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for speed and user experience
- **CDN Delivery**: Global content delivery via Cloudflare
- **Serverless Architecture**: Auto-scaling and cost-effective

## 🌍 Deployment

### Vercel (Recommended)

1. **Connect** your GitHub repository to Vercel
2. **Add** environment variables in Vercel dashboard
3. **Deploy** automatically on every push

### Docker

```bash
# Build the image
docker build -t memoirvault .

# Run the container
docker run -p 3000:3000 --env-file .env.local memoirvault
```

### Manual Deployment

```bash
# Build the application
npm run build

# Start the production server
npm start
```

## 🤝 Support

- **Documentation**: [Wiki](https://github.com/enclave-projects/memoirvault/wiki)
- **Issues**: [GitHub Issues](https://github.com/enclave-projects/memoirvault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/enclave-projects/memoirvault/discussions)
- **Email**: support@memoirvault.com

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Cloudflare** for R2 object storage
- **Neon** for serverless PostgreSQL
- **Clerk** for authentication services
- **Vercel** for hosting and deployment
- **Open Source Community** for amazing tools and libraries

## 🗺️ Roadmap

### Version 2.0
- [ ] **AI-powered insights** and story suggestions
- [ ] **Collaborative features** for family sharing
- [ ] **Mobile apps** (iOS/Android)
- [ ] **Offline mode** with sync capabilities
- [ ] **Advanced search** with full-text indexing

### Version 1.5
- [ ] **Themes and customization** options
- [ ] **Export formats** (PDF, EPUB, etc.)
- [ ] **Backup automation** to external services
- [ ] **API access** for third-party integrations

---

<div align="center">

**Built with ❤️ for privacy-conscious storytellers**

[Website](https://memoirvault.com) • [Documentation](https://docs.memoirvault.com) • [Community](https://community.memoirvault.com)

</div>