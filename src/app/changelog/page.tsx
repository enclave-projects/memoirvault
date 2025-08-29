import Link from 'next/link';

export default function ChangelogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAFBFC] via-white to-[#F8F9FA]">
      {/* Modern Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-white/20 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-[#004838] to-[#073127] rounded-xl shadow-sm flex items-center justify-center">
                <span className="text-[#E2FB6C] font-bold text-sm">MV</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div>
              <Link href="/" className="font-serif text-xl font-bold text-[#1A1D29] tracking-tight hover:text-[#004838] transition-colors">
                MemoirVault
              </Link>
              <div className="text-xs text-[#6B7280] font-medium">Release Notes</div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Link
              href="/"
              className="group relative p-3 text-[#6B7280] hover:text-[#004838] hover:bg-[#004838]/5 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#004838]/20"
              title="Home"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
            
            <div className="w-px h-8 bg-[#E5E7EB] hidden md:block"></div>
            
            <Link
              href="/dashboard"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#004838] to-[#073127] text-[#E2FB6C] rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-[#004838]/30"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#004838] to-[#073127] rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
              <svg className="w-10 h-10 text-[#E2FB6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-2xl border-4 border-white animate-bounce flex items-center justify-center">
              <span className="text-white text-xs font-bold">NEW</span>
            </div>
          </div>
          <h1 className="font-serif text-5xl font-bold text-[#1A1D29] mb-4 tracking-tight">
            Changelog
          </h1>
          <p className="text-[#6B7280] text-xl max-w-2xl mx-auto leading-relaxed">
            Track all the latest features, improvements, and fixes in MemoirVault. 
            We're constantly evolving to serve you better.
          </p>
        </div>

        {/* Version 1.3.0 - Latest */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#004838] rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#E2FB6C] rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                    <span className="text-white text-xl">🚀</span>
                  </div>
                  <div>
                    <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.3.0</h2>
                    <p className="text-[#6B7280] font-medium">August 29, 2025 - Latest Release</p>
                  </div>
                </div>
                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-2xl font-bold text-sm">
                  LATEST
                </div>
              </div>

              <div className="space-y-8">
                {/* Changelog System */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">📋</span>
                    Changelog System & Documentation
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h4 className="font-bold text-[#004838] mb-3">✨ Added</h4>
                      <ul className="space-y-2 text-[#1A1D29]">
                        <li>• Interactive Changelog Page (/changelog) with modern design</li>
                        <li>• Comprehensive version timeline with feature breakdowns</li>
                        <li>• "What's New" navigation links with animated badges</li>
                        <li>• Coming Soon roadmap section for transparency</li>
                        <li>• Updated README.md with v1.3.0 features</li>
                        <li>• Enhanced ABOUT-PROJECT.md documentation</li>
                      </ul>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h4 className="font-bold text-[#004838] mb-3">🔧 Improved</h4>
                      <ul className="space-y-2 text-[#1A1D29]">
                        <li>• Landing page header with changelog navigation</li>
                        <li>• Footer integration with changelog access</li>
                        <li>• Visual indicators for new features and updates</li>
                        <li>• Professional development communication</li>
                        <li>• User transparency and feature discovery</li>
                        <li>• Project documentation and technical achievements</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Enhanced User Experience */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">✨</span>
                    Enhanced User Experience
                  </h3>
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200/30">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-[#1A1D29] mb-2">Release Notes</h4>
                        <p className="text-[#6B7280] text-sm">Comprehensive feature documentation</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-[#1A1D29] mb-2">What's New</h4>
                        <p className="text-[#6B7280] text-sm">Easy discovery of latest features</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-[#1A1D29] mb-2">Transparency</h4>
                        <p className="text-[#6B7280] text-sm">Open development communication</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version 1.2.1 */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-[#004838] rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-[#E2FB6C] rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🎨</span>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.2.1</h2>
                  <p className="text-[#6B7280] font-medium">August 21, 2025 - Dashboard Modernization</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Dashboard & Modal System */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎨</span>
                    Dashboard & Modal System Modernization
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h4 className="font-bold text-[#004838] mb-3">✨ Added</h4>
                      <ul className="space-y-2 text-[#1A1D29]">
                        <li>• Modern Dashboard UI with glassmorphism design</li>
                        <li>• Enhanced Modal System with proper backdrop blur</li>
                        <li>• Interactive Media Viewer for fullscreen experience</li>
                        <li>• Mobile Navigation with comprehensive menu system</li>
                        <li>• Responsive Sidebar with smart collapse behavior</li>
                      </ul>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h4 className="font-bold text-[#004838] mb-3">🔧 Improved</h4>
                      <ul className="space-y-2 text-[#1A1D29]">
                        <li>• Settings Modal with modern gradient header</li>
                        <li>• AI Assistant Modal with purple gradient theme</li>
                        <li>• Public Profile Pages with modern card layouts</li>
                        <li>• Feed Page with interactive media galleries</li>
                        <li>• Hardware-accelerated 60fps animations</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Interactive Media System */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">🎬</span>
                    Interactive Media System
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-200/30">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-[#1A1D29] mb-2">Fullscreen Images</h4>
                        <p className="text-[#6B7280] text-sm">Click to view with zoom capabilities</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-[#1A1D29] mb-2">Video Playback</h4>
                        <p className="text-[#6B7280] text-sm">Modal player with full controls</p>
                      </div>
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                          </svg>
                        </div>
                        <h4 className="font-bold text-[#1A1D29] mb-2">Audio Player</h4>
                        <p className="text-[#6B7280] text-sm">Visual interface with controls</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mobile Experience */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    Mobile Experience Enhancement
                  </h3>
                  <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-2xl p-6 border border-green-200/30">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-bold text-[#004838] mb-3">🔧 Fixed</h4>
                        <ul className="space-y-2 text-[#1A1D29]">
                          <li>• Mobile menu accessibility across all pages</li>
                          <li>• Sidebar toggle functionality</li>
                          <li>• Touch target optimization</li>
                          <li>• Responsive behavior improvements</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#004838] mb-3">✨ Added</h4>
                        <ul className="space-y-2 text-[#1A1D29]">
                          <li>• Slide-out mobile menu with backdrop</li>
                          <li>• Touch gestures and interactions</li>
                          <li>• Mobile-first header layouts</li>
                          <li>• Quick actions in mobile menu</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version 1.2.0 */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500 rounded-full -translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🚀</span>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.2.0</h2>
                  <p className="text-[#6B7280] font-medium">August 18, 2025 - Performance Overhaul</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29] mb-4">🚀 Major Performance Overhaul</h3>
                  <ul className="space-y-2 text-[#1A1D29]">
                    <li>• Landing page optimization for 60fps experience</li>
                    <li>• Animation system redesign with CSS-only animations</li>
                    <li>• Bundle size reduction by removing heavy dependencies</li>
                    <li>• Core Web Vitals improvements</li>
                    <li>• Mobile performance optimization</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29] mb-4">🛡️ Security Enhancements</h3>
                  <ul className="space-y-2 text-[#1A1D29]">
                    <li>• IP-restricted admin panel implementation</li>
                    <li>• Environment security improvements</li>
                    <li>• Multi-layer protection system</li>
                    <li>• Enhanced session management</li>
                    <li>• Secure credential handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version 1.1.2 */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-green-500 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-yellow-500 rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🌐</span>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.1.2</h2>
                  <p className="text-[#6B7280] font-medium">August 5, 2025 - Public Platform Launch</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Major Features */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">🌐</span>
                    Major Social Features
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h4 className="font-bold text-[#004838] mb-3">✨ Public Profile System</h4>
                      <ul className="space-y-2 text-[#1A1D29]">
                        <li>• Complete social sharing platform for memoir writers</li>
                        <li>• Follow/unfollow system to connect with others</li>
                        <li>• Public feed to discover and read entries</li>
                        <li>• Entry visibility control (public/private)</li>
                        <li>• Social discovery through discover page</li>
                      </ul>
                    </div>
                    <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                      <h4 className="font-bold text-[#004838] mb-3">🎛️ Advanced Settings</h4>
                      <ul className="space-y-2 text-[#1A1D29]">
                        <li>• Comprehensive settings modal with tabs</li>
                        <li>• Entry selection popup for public sharing</li>
                        <li>• Bulk operations for entry visibility</li>
                        <li>• Profile management and deletion</li>
                        <li>• Danger zone with data cleanup</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Performance & UX */}
                <div>
                  <h3 className="font-bold text-xl text-[#1A1D29] mb-4 flex items-center gap-2">
                    <span className="text-2xl">🚀</span>
                    Performance & UX Improvements
                  </h3>
                  <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-6 border border-blue-200/30">
                    <div className="grid md:grid-cols-3 gap-6">
                      <div>
                        <h4 className="font-bold text-[#004838] mb-3">⚡ Performance</h4>
                        <ul className="space-y-2 text-[#1A1D29] text-sm">
                          <li>• Optimistic UI updates</li>
                          <li>• 80% query reduction</li>
                          <li>• In-memory caching</li>
                          <li>• Connection pooling</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#004838] mb-3">🎨 UI/UX</h4>
                        <ul className="space-y-2 text-[#1A1D29] text-sm">
                          <li>• Collapsible sidebar</li>
                          <li>• Backdrop blur effects</li>
                          <li>• Loading animations</li>
                          <li>• Mobile optimization</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-bold text-[#004838] mb-3">🔧 Technical</h4>
                        <ul className="space-y-2 text-[#1A1D29] text-sm">
                          <li>• API optimization</li>
                          <li>• Data consistency</li>
                          <li>• Transaction handling</li>
                          <li>• Security enhancements</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version 1.1.1 */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500 rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-red-500 rounded-full -translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🔧</span>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.1.1</h2>
                  <p className="text-[#6B7280] font-medium">August 1, 2025 - AI Helper Fixes</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29] mb-4">🔧 AI Helper Fixes</h3>
                  <ul className="space-y-2 text-[#1A1D29]">
                    <li>• Fixed AI Helper deployment issues</li>
                    <li>• Corrected Gemini API integration</li>
                    <li>• Updated environment variable configuration</li>
                    <li>• Improved error handling for AI service failures</li>
                    <li>• Fixed TypeScript component warnings</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29] mb-4">📚 Documentation</h3>
                  <ul className="space-y-2 text-[#1A1D29]">
                    <li>• Workflow diagrams with Mermaid</li>
                    <li>• Complete database schema documentation</li>
                    <li>• API documentation with examples</li>
                    <li>• Comprehensive feature breakdown</li>
                    <li>• Updated environment configuration</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version 1.1.0 */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-green-500 rounded-full translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🤖</span>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.1.0</h2>
                  <p className="text-[#6B7280] font-medium">July 21, 2025 - AI Integration & Debug Tools</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29] mb-4">🤖 AI Integration</h3>
                  <ul className="space-y-2 text-[#1A1D29]">
                    <li>• AI Helper Bot with Google Gemini API</li>
                    <li>• Writing assistance and creative prompts</li>
                    <li>• Context-aware memoir suggestions</li>
                    <li>• GitHub issue reporting system</li>
                    <li>• User feedback integration</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[#1A1D29] mb-4">🔧 Debug & Improvements</h3>
                  <ul className="space-y-2 text-[#1A1D29]">
                    <li>• Debug tools for R2 storage testing</li>
                    <li>• Individual entry deletion functionality</li>
                    <li>• Enhanced file upload and deletion</li>
                    <li>• Comprehensive logging system</li>
                    <li>• Improved error handling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version 1.0.0 */}
        <div className="mb-12">
          <div className="relative bg-white/60 backdrop-blur-xl rounded-3xl border border-white/20 shadow-xl p-8 overflow-hidden">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500 rounded-full translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-pink-500 rounded-full -translate-x-12 translate-y-12"></div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-xl">🎉</span>
                </div>
                <div>
                  <h2 className="font-serif text-3xl font-bold text-[#1A1D29]">Version 1.0.0</h2>
                  <p className="text-[#6B7280] font-medium">July 15, 2025 - Initial Release</p>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <h4 className="font-bold text-[#004838] mb-3">🔐 Privacy-First</h4>
                  <ul className="space-y-2 text-[#1A1D29] text-sm">
                    <li>• End-to-end encryption</li>
                    <li>• No tracking or analytics</li>
                    <li>• Complete data control</li>
                    <li>• GDPR compliance</li>
                  </ul>
                </div>
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <h4 className="font-bold text-[#004838] mb-3">📝 Core Features</h4>
                  <ul className="space-y-2 text-[#1A1D29] text-sm">
                    <li>• Multimedia journaling</li>
                    <li>• Timeline view</li>
                    <li>• Drag & drop uploads</li>
                    <li>• Real-time dashboard</li>
                  </ul>
                </div>
                <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30">
                  <h4 className="font-bold text-[#004838] mb-3">⚡ Technology</h4>
                  <ul className="space-y-2 text-[#1A1D29] text-sm">
                    <li>• Next.js 15 with App Router</li>
                    <li>• Cloudflare R2 storage</li>
                    <li>• NeonDB database</li>
                    <li>• TypeScript & Tailwind</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon */}
        <div className="relative bg-gradient-to-br from-[#004838] to-[#073127] rounded-3xl p-8 text-white overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-64 h-64 bg-[#E2FB6C] rounded-full -translate-x-32 -translate-y-32"></div>
            <div className="absolute bottom-0 right-0 w-48 h-48 bg-[#E2FB6C] rounded-full translate-x-24 translate-y-24"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-[#E2FB6C]/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-[#E2FB6C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="font-serif text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-[#E2FB6C]/80 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
              We're constantly working on new features to enhance your memoir writing experience. 
              Stay tuned for exciting updates!
            </p>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 text-center">
              {[
                { icon: '🤖', label: 'AI Story Insights' },
                { icon: '👨‍👩‍👧‍👦', label: 'Family Collaboration' },
                { icon: '📱', label: 'Mobile Apps' },
                { icon: '📚', label: 'Export to PDF/EPUB' }
              ].map((feature) => (
                <div key={feature.label} className="bg-[#E2FB6C]/10 backdrop-blur-sm rounded-2xl p-4 border border-[#E2FB6C]/20">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <div className="text-[#E2FB6C] font-medium text-sm">{feature.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}