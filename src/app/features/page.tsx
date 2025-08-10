import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features - MemoirVault',
  description: 'Discover MemoirVault features - Privacy-first digital memoir platform with rich multimedia support',
};

export default function FeaturesPage() {
  const features = [
    {
      icon: '🔐',
      title: 'Privacy-First Design',
      description: 'End-to-end encryption for all your personal data. No tracking, no analytics, complete data ownership.',
      details: [
        'Zero-knowledge architecture',
        'GDPR compliant data handling',
        'Complete data export/deletion rights',
        'No third-party tracking'
      ]
    },
    {
      icon: '📝',
      title: 'Rich Multimedia Journaling',
      description: 'Create comprehensive memoir entries with text, images, audio, and video content.',
      details: [
        'Drag & drop file uploads',
        'Support for images, audio, and video',
        'Rich text formatting',
        'Timeline-based organization'
      ]
    },
    {
      icon: '🤖',
      title: 'AI Writing Assistant',
      description: 'Get personalized writing suggestions and prompts powered by Google Gemini AI.',
      details: [
        'Context-aware writing suggestions',
        'Story prompts and creative assistance',
        'Privacy-preserving AI interactions',
        'Integrated feedback system'
      ]
    },
    {
      icon: '🌐',
      title: 'Public Sharing & Social',
      description: 'Share your memoir journey publicly and connect with other memoir writers.',
      details: [
        'Public profile creation',
        'Follow system for writers',
        'Entry visibility control',
        'Social feed and discovery'
      ]
    },
    {
      icon: '🗄️',
      title: 'Robust Data Management',
      description: 'Secure, scalable storage with comprehensive file management and cleanup.',
      details: [
        'Cloudflare R2 storage integration',
        '2GB free storage tier',
        'Automatic file cleanup',
        'Real-time usage tracking'
      ]
    },
    {
      icon: '⚡',
      title: 'Performance Optimized',
      description: 'Fast, responsive interface with optimistic updates and caching.',
      details: [
        'Sub-second response times',
        'Optimistic UI updates',
        'Intelligent caching layer',
        'Mobile-first responsive design'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#EBEDE8]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <img 
              src="/logo/memoirvault.png" 
              alt="MemoirVault Logo" 
              className="w-8 h-8"
            />
            <span className="font-serif text-xl font-semibold text-[#333F3C]">MemoirVault</span>
          </Link>
          <Link href="/" className="text-[#333F3C] hover:text-[#004838] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Features</h1>
        <p className="text-xl text-[#333F3C] opacity-75 mb-12 max-w-2xl">
          Everything you need to create, preserve, and share your life story with complete privacy and control.
        </p>

        <div className="space-y-12">
          {features.map((feature, index) => (
            <div key={index} className="border-b border-[#EBEDE8] pb-12 last:border-b-0">
              <div className="flex items-start space-x-6">
                <div className="text-4xl">{feature.icon}</div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">{feature.title}</h2>
                  <p className="text-[#333F3C] leading-relaxed mb-6">{feature.description}</p>
                  <ul className="space-y-2">
                    {feature.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-center text-[#333F3C]">
                        <span className="text-[#004838] mr-3">✓</span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Technical Specifications */}
        <div className="mt-16 pt-12 border-t border-[#EBEDE8]">
          <h2 className="font-serif text-3xl font-semibold text-[#333F3C] mb-8">Technical Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#EBEDE8] rounded-lg p-6">
              <h3 className="font-semibold text-[#004838] mb-4">Frontend Technology</h3>
              <ul className="space-y-2 text-[#333F3C]">
                <li>• Next.js 15 with App Router</li>
                <li>• React 18 with modern hooks</li>
                <li>• TypeScript 5 for type safety</li>
                <li>• Tailwind CSS 4 for styling</li>
              </ul>
            </div>
            
            <div className="bg-[#EBEDE8] rounded-lg p-6">
              <h3 className="font-semibold text-[#004838] mb-4">Backend & Storage</h3>
              <ul className="space-y-2 text-[#333F3C]">
                <li>• NeonDB PostgreSQL database</li>
                <li>• Cloudflare R2 object storage</li>
                <li>• Drizzle ORM for type-safe queries</li>
                <li>• Clerk authentication system</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 pt-12 border-t border-[#EBEDE8] text-center">
          <h2 className="font-serif text-3xl font-semibold text-[#333F3C] mb-6">
            Ready to Start Your Digital Memoir?
          </h2>
          <p className="text-[#333F3C] mb-8 max-w-2xl mx-auto">
            Join users who trust MemoirVault with their most precious memories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/dashboard" 
              className="gradient-cta text-[#E2FB6C] px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Start Your Journey Today
            </Link>
            <Link 
              href="/security" 
              className="border-2 border-[#E2FB6C] text-[#004838] px-8 py-3 rounded-xl font-semibold hover:bg-[#E2FB6C] transition-all duration-200"
            >
              Learn About Security
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}