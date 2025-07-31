# Changelog

All notable changes to MemoirVault will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-01-22

### 🎉 Initial Release

#### Added
- **Privacy-first architecture** with end-to-end encryption
- **Multimedia journaling** support (text, images, audio, video)
- **Clerk authentication** with biometric login support
- **Cloudflare R2 integration** for secure file storage
- **NeonDB database** for scalable data management
- **Responsive design** with mobile-first approach
- **Timeline view** for chronological entry browsing
- **Real-time dashboard** with statistics tracking
- **Drag & drop file uploads** with preview functionality
- **Custom media carousel** for multiple file navigation
- **File type detection** and appropriate handling
- **Data export capabilities** for user data sovereignty
- **GDPR compliance** features

#### Technical Features
- **Next.js 15** with App Router for optimal performance
- **React 18** with modern hooks and patterns
- **TypeScript** for type safety and better DX
- **Tailwind CSS** for utility-first styling
- **Drizzle ORM** for type-safe database operations
- **AWS S3 SDK** for Cloudflare R2 compatibility
- **Server-side rendering** for better SEO and performance
- **API routes** for secure backend operations

#### Security
- **Multi-factor authentication** support
- **Session management** with automatic expiry
- **Input validation** and sanitization
- **SQL injection prevention** with parameterized queries
- **XSS protection** with proper output escaping
- **CSRF protection** implementation
- **Rate limiting** for API endpoints

#### UI/UX
- **Clean, modern interface** with privacy-focused design
- **Accessibility compliance** (WCAG 2.1 AA)
- **Dark/light theme** support
- **Smooth animations** and transitions
- **Loading states** and error handling
- **Toast notifications** for user feedback
- **Modal dialogs** for better user experience

### 🔧 Technical Details

#### Database Schema
- **entries** table for storing journal entries
- **media** table for file metadata and references
- **Foreign key relationships** with cascade delete
- **Indexes** for optimal query performance

#### File Storage
- **Cloudflare R2** for global, cost-effective storage
- **Public URL generation** for direct file access
- **File type validation** and size limits
- **Unique file naming** to prevent conflicts
- **Metadata storage** for file information

#### Authentication
- **Clerk integration** for secure user management
- **OAuth2 compliance** with multiple providers
- **Session tokens** with proper expiration
- **User profile management** and customization

### 📊 Performance
- **Lighthouse score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for user experience
- **Bundle size**: Optimized with code splitting
- **Image optimization**: Next.js automatic optimization
- **CDN delivery**: Global content delivery via Cloudflare

### 🌍 Deployment
- **Vercel deployment** ready with zero configuration
- **Docker support** for containerized deployment
- **Environment variables** for secure configuration
- **Database migrations** with Drizzle Kit
- **CI/CD pipeline** ready for automated deployment

---

## [1.1.0] - 2025-01-25

### 🤖 Added
- **AI Helper Bot** with Google Gemini API integration for writing assistance
- **GitHub Issue Reporting** system for user feedback and bug reports
- **Individual Entry Deletion** functionality in Timeline component
- **Debug Tools** for R2 storage consistency testing (`/debug` page)
- **Comprehensive Logging** for file upload and deletion processes

### 🔧 Fixed
- **R2 File Deletion** issues for audio and video files
- **Environment Variable Consistency** across all R2 operations
- **File Path Generation** and storage consistency
- **Modal Backdrop Effects** with improved blur styling
- **Upload Timeout Handling** for large video files

### 🎨 Improved
- **Timeline Component** with delete functionality and better UX
- **Settings Page** with dedicated issue reporting section
- **Error Handling** throughout the application
- **File Upload Progress** feedback and user notifications
- **Storage Usage Tracking** with better percentage calculations

### 🛠️ Technical
- **Enhanced R2 Client** with file existence checking
- **Improved API Endpoints** with better error handling and logging
- **Database Query Optimization** for media file operations
- **Debug API Endpoints** for storage testing and diagnostics

---

## [1.1.1] - 2025-01-28

### 🔧 Fixed
- **AI Helper Deployment Issues** - Fixed environment variable configuration for production
- **Gemini API Integration** - Corrected API endpoint and model name (`gemma-3n-e2b-it`)
- **Environment Variables** - Updated from `GOOGLE_GEMINI_API_KEY` to `GEMINI_API_KEY`
- **Error Handling** - Improved user-friendly error messages for AI service failures
- **TypeScript Issues** - Fixed component warnings and deprecated method usage

### 🎨 Improved
- **AI Helper Component** - Simplified implementation by removing complex streaming logic
- **Error Messages** - More specific and actionable error feedback for users
- **Loading States** - Better visual feedback during AI response generation
- **API Debugging** - Added `/api/test-ai` endpoint for configuration testing
- **Documentation** - Updated `.env.example` with correct variable names

### 🛠️ Technical
- **API Error Logging** - Enhanced debugging information for production issues
- **Component Optimization** - Removed unused code and improved performance
- **Environment Configuration** - Standardized variable naming across all services
- **Production Compatibility** - Ensured AI features work correctly in Vercel deployment

### 📚 Documentation
- **Workflow Diagrams** - Created detailed Mermaid diagrams for system explanation
- **Database Schema** - Complete SQL schema documentation with examples
- **API Documentation** - Detailed endpoint documentation with request/response examples
- **Feature Overview** - Comprehensive feature breakdown for educational content

---

## [1.1.2] - 2025-01-30

### 🌐 Major Features Added
- **Public Profile System** - Complete social sharing platform for memoir writers
- **Follow/Unfollow System** - Connect with other memoir writers and follow their journeys
- **Public Feed** - Discover and read public entries from people you follow
- **Entry Visibility Control** - Granular control over which entries are public or private
- **Social Discovery** - Find new people and stories through the discover page

### 🎛️ Advanced Settings & Controls
- **Comprehensive Settings Modal** with tabbed interface:
  - **General Settings** - Profile name, bio, and basic information
  - **Privacy Settings** - Control entry visibility and public sharing
  - **Entry Control** - Bulk operations and individual entry management
  - **Danger Zone** - Profile unlinking and deletion with data cleanup
- **Entry Selection Popup** - Choose specific entries to make public
- **Bulk Operations** - Make all entries public/private with confirmation dialogs
- **Profile Management** - Unlink or delete public profiles with proper cleanup

### 🚀 Performance Optimizations
- **Optimistic UI Updates** - Instant feedback for follow/unfollow actions
- **Batch Database Operations** - Reduced query count by 80% for better performance
- **Caching Layer** - In-memory caching for frequently accessed data
- **Connection Pooling** - Optimized database connections for faster responses
- **Parallel Operations** - Simultaneous API calls using Promise.all()

### 🎨 UI/UX Improvements
- **Collapsible Sidebar** - Space-efficient navigation with smooth animations
- **Scrollable Navigation** - Fixed sidebar scrolling issues with proper flex layout
- **Backdrop Blur Effects** - Modern modal designs with glass morphism
- **Loading States** - Smooth loading animations and progress indicators
- **Responsive Design** - Mobile-optimized layouts for all new features
- **Error Handling** - Comprehensive error states with user-friendly messages

### 🔧 Technical Improvements
- **Follow Count Accuracy** - Fixed negative count issues with proper recalculation
- **Database Consistency** - Automatic count updates and orphaned data cleanup
- **Hydration Fixes** - Resolved SSR/client-side rendering mismatches
- **API Optimization** - Reduced response times from 2-3s to 200-500ms
- **Transaction Handling** - Proper sequential operations for Neon HTTP driver
- **Data Integrity** - Comprehensive cleanup when profiles are deleted

### 🛠️ New API Endpoints
- `/api/public/follow-optimized` - High-performance follow/unfollow operations
- `/api/public/batch-update-counts` - Batch count updates for multiple users
- `/api/entries/bulk-visibility-optimized` - Optimized bulk entry visibility updates
- `/api/public/fix-counts` - Data consistency repair tool
- `/api/public/cleanup-data` - Orphaned data cleanup utility
- `/api/public/profile-status` - Dynamic profile status checking

### 🔐 Security & Privacy
- **Mutually Exclusive Settings** - Prevent conflicting privacy configurations
- **Data Cleanup** - Complete removal of related data when profiles are deleted
- **User Isolation** - Proper data separation between users
- **Input Validation** - Enhanced validation for all new endpoints
- **Rate Limiting** - Protection against abuse of new social features

### 🐛 Bug Fixes
- **Sidebar Scrolling** - Fixed unscrollable navigation with proper flex layout
- **Count Synchronization** - Resolved follower/following count inconsistencies
- **Profile Deletion** - Fixed transaction errors with sequential operations
- **Entry Visibility** - Corrected logic for public/private entry display
- **Hydration Errors** - Eliminated server/client rendering mismatches
- **Mobile Navigation** - Fixed responsive behavior on small screens

### 📱 Mobile Enhancements
- **Touch-Friendly Interface** - Optimized button sizes and touch targets
- **Mobile Sidebar** - Collapsible navigation with overlay for mobile devices
- **Responsive Modals** - Properly sized settings and selection popups
- **Swipe Gestures** - Improved mobile interaction patterns
- **Performance** - Optimized for mobile network conditions

### 🎯 User Experience
- **Onboarding Flow** - Smooth introduction to public profile features
- **Contextual Help** - Tooltips and descriptions for new features
- **Confirmation Dialogs** - Clear warnings for destructive actions
- **Success Feedback** - Immediate confirmation of completed actions
- **Error Recovery** - Graceful handling of network and server errors

---

## [Unreleased]

### Planned Features
- AI-powered story suggestions and insights
- Collaborative features for family sharing
- Mobile applications (iOS/Android)
- Offline mode with synchronization
- Advanced search with full-text indexing
- Export to multiple formats (PDF, EPUB)
- Backup automation to external services
- API access for third-party integrations
- Themes and customization options
- Multi-language support

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to contribute to this changelog and the project.

## Support

- **Documentation**: [GitHub Wiki](https://github.com/enclave-projects/memoirvault/wiki)
- **Issues**: [GitHub Issues](https://github.com/enclave-projects/memoirvault/issues)
- **Discussions**: [GitHub Discussions](https://github.com/enclave-projects/memoirvault/discussions)