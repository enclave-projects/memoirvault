import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { AuthRedirect } from "@/components/AuthRedirect";
import LightRays from "../../animation/background/LightRays/LightRays";
import TargetCursor from "../../animation/cursor/TargetCursor/TargetCursor";
import ClickSpark from "../../animation/cursor/ClickSpark/ClickSpark";

export default function Home() {
  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      <TargetCursor targetSelector=".cursor-target" />
      
      {/* Background Animation */}
      <div className="fixed inset-0 z-0">
        <LightRays
          raysOrigin="top-center"
          raysColor="#E2FB6C"
          raysSpeed={0.5}
          lightSpread={2}
          rayLength={1.5}
          pulsating={true}
          fadeDistance={0.8}
          saturation={0.7}
          followMouse={true}
          mouseInfluence={0.15}
          noiseAmount={0.1}
          distortion={0.2}
        />
      </div>

      <ClickSpark sparkColor="#004838" sparkCount={12} sparkRadius={25}>
        <AuthRedirect />
        {/* Header */}
        <header className="relative z-10 px-6 py-4 flex justify-between items-center max-w-7xl mx-auto backdrop-blur-sm bg-white/80 rounded-xl mt-4">
          <div className="flex items-center space-x-2 cursor-target">
            <img 
              src="/logo/memoirvault.png" 
              alt="MemoirVault Logo" 
              className="w-8 h-8 transform hover:scale-110 transition-transform duration-200"
            />
            <span className="font-serif text-xl font-semibold text-[#333F3C]">MemoirVault</span>
          </div>
          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton
                mode="modal"
                forceRedirectUrl="/dashboard"
              >
                <button className="cursor-target text-[#333F3C] hover:text-[#004838] transition-all duration-200 font-medium hover:scale-105 transform">
                  Login
                </button>
              </SignInButton>
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard"
              >
                <button className="cursor-target gradient-cta text-[#E2FB6C] px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 transform hover:scale-105 hover:-translate-y-1">
                  Get Started
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a
                href="/dashboard"
                className="cursor-target text-[#333F3C] hover:text-[#004838] transition-all duration-200 font-medium hover:scale-105 transform"
              >
                Dashboard
              </a>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-8 h-8 cursor-target"
                  }
                }}
              />
          </SignedIn>
        </div>
      </header>

        {/* Hero Section */}
        <section className="relative z-10 px-6 py-20 text-center max-w-6xl mx-auto">
          <h1 className="font-serif text-5xl md:text-6xl font-semibold text-[#333F3C] mb-6 leading-tight animate-fade-in">
            Your Life Story,<br />
            <span className="text-[#004838] cursor-target">Completely Private</span>
          </h1>
          <p className="text-xl text-[#333F3C] mb-8 max-w-2xl mx-auto leading-relaxed opacity-90">
            A new way to record and preserve your autobiography with complete privacy and control.
            Multi-media journaling designed for the privacy-conscious individual.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <SignedOut>
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard"
              >
                <button className="cursor-target gradient-cta text-[#E2FB6C] px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-105">
                  Start Your Journey
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a
                href="/dashboard"
                className="cursor-target gradient-cta text-[#E2FB6C] px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-105"
              >
                Go to Dashboard
              </a>
            </SignedIn>
            <a
              href="#how-it-works"
              className="cursor-target border-2 border-[#E2FB6C] text-[#004838] px-8 py-4 rounded-xl font-semibold text-lg hover:bg-[#E2FB6C] hover:text-[#004838] transition-all duration-200 transform hover:scale-105"
            >
              See How It Works
            </a>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-8 text-[#333F3C]">
            <div className="flex items-center gap-2 cursor-target transform hover:scale-110 transition-all duration-200 animate-float">
              <span className="text-2xl">🔒</span>
              <span className="font-medium">End-to-end encrypted</span>
            </div>
            <div className="flex items-center gap-2 cursor-target transform hover:scale-110 transition-all duration-200 animate-float" style={{animationDelay: '1s'}}>
              <span className="text-2xl">📱</span>
              <span className="font-medium">All devices</span>
            </div>
            <div className="flex items-center gap-2 cursor-target transform hover:scale-110 transition-all duration-200 animate-float" style={{animationDelay: '2s'}}>
              <span className="text-2xl">🌍</span>
              <span className="font-medium">Your data, your control</span>
            </div>
          </div>
      </section>

        {/* Features Grid */}
        <section className="relative z-10 px-6 py-20 bg-[#EBEDE8]/80 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl font-semibold text-[#333F3C] text-center mb-16 cursor-target">
              Everything you need to preserve your story
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="cursor-target bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-pulse-glow">
                <div className="text-4xl mb-4 animate-float">🎙️</div>
                <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-3">
                  Multi-media Journaling
                </h3>
                <p className="text-[#333F3C] leading-relaxed">
                  Capture your memories with text, audio recordings, photos, and videos.
                  Rich formatting tools make your stories come alive.
                </p>
              </div>
              <div className="cursor-target bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-pulse-glow" style={{animationDelay: '0.5s'}}>
                <div className="text-4xl mb-4 animate-float" style={{animationDelay: '1s'}}>🔐</div>
                <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-3">
                  Privacy-First
                </h3>
                <p className="text-[#333F3C] leading-relaxed">
                  Your data stays yours, always. End-to-end encryption ensures only you
                  can access your personal stories and memories.
                </p>
              </div>
              <div className="cursor-target bg-white/90 backdrop-blur-sm p-8 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-2 animate-pulse-glow" style={{animationDelay: '1s'}}>
                <div className="text-4xl mb-4 animate-float" style={{animationDelay: '2s'}}>📚</div>
                <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-3">
                  Smart Organization
                </h3>
                <p className="text-[#333F3C] leading-relaxed">
                  Timeline views, intelligent tagging, and powerful search help you
                  navigate your life story with ease.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="relative z-10 px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-serif text-4xl font-semibold text-[#333F3C] text-center mb-16 cursor-target">
              Simple, secure, and completely yours
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="space-y-8">
                  <div className="flex gap-4 cursor-target transform hover:scale-105 transition-all duration-200">
                    <div className="w-8 h-8 bg-[#004838] text-[#E2FB6C] rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1 animate-pulse-glow">
                      1
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#333F3C] text-lg mb-2">Create Your Private Space</h3>
                      <p className="text-[#333F3C]">Sign up with secure authentication and optional biometric login for maximum privacy.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-target transform hover:scale-105 transition-all duration-200">
                    <div className="w-8 h-8 bg-[#004838] text-[#E2FB6C] rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1 animate-pulse-glow" style={{animationDelay: '0.5s'}}>
                      2
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#333F3C] text-lg mb-2">Record Your Memories</h3>
                      <p className="text-[#333F3C]">Write, record audio, capture photos, or film videos. Mix and match media types in each entry.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 cursor-target transform hover:scale-105 transition-all duration-200">
                    <div className="w-8 h-8 bg-[#004838] text-[#E2FB6C] rounded-full flex items-center justify-center font-bold flex-shrink-0 mt-1 animate-pulse-glow" style={{animationDelay: '1s'}}>
                      3
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#333F3C] text-lg mb-2">Stay in Control</h3>
                      <p className="text-[#333F3C]">Export your data anytime, delete permanently when you want, and always know where your information is stored.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="cursor-target bg-gradient-to-br from-[#004838] to-[#073127] p-8 rounded-2xl text-white transform hover:scale-105 transition-all duration-300 animate-pulse-glow">
                <h3 className="font-serif text-2xl font-semibold mb-4">Built by privacy advocates, for privacy advocates</h3>
                <p className="mb-6 opacity-90">
                  We believe your personal stories deserve the highest level of protection.
                  That&apos;s why we built MemoirVault with privacy as the foundation, not an afterthought.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 cursor-target transform hover:scale-105 transition-transform duration-200">
                    <span className="text-[#E2FB6C]">✓</span>
                    <span>No tracking or analytics</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-target transform hover:scale-105 transition-transform duration-200">
                    <span className="text-[#E2FB6C]">✓</span>
                    <span>No data selling, ever</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-target transform hover:scale-105 transition-transform duration-200">
                    <span className="text-[#E2FB6C]">✓</span>
                    <span>Complete data sovereignty</span>
                  </div>
                  <div className="flex items-center gap-2 cursor-target transform hover:scale-105 transition-transform duration-200">
                    <span className="text-[#E2FB6C]">✓</span>
                    <span>Open source transparency</span>
                  </div>
                </div>
              </div>
          </div>
        </div>
      </section>

        {/* CTA Section */}
        <section className="relative z-10 px-6 py-20 bg-[#EBEDE8]/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-serif text-4xl font-semibold text-[#333F3C] mb-6 cursor-target animate-fade-in">
              Ready to start your digital autobiography?
            </h2>
            <p className="text-xl text-[#333F3C] mb-8 max-w-2xl mx-auto">
              Take control of your personal stories with a platform built for privacy,
              security, and complete data ownership.
            </p>
            <SignedOut>
              <SignUpButton
                mode="modal"
                forceRedirectUrl="/dashboard"
              >
                <button className="cursor-target gradient-cta text-[#E2FB6C] px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-110 inline-block animate-pulse-glow">
                  Start Your Journey Today
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <a
                href="/dashboard"
                className="cursor-target gradient-cta text-[#E2FB6C] px-10 py-4 rounded-xl font-semibold text-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 hover:scale-110 inline-block animate-pulse-glow"
              >
                Go to Your Dashboard
              </a>
            </SignedIn>
            <p className="text-sm text-[#333F3C] mt-4 opacity-75">
              Free to start • No credit card required • Cancel anytime
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="relative z-10 px-6 py-12 bg-[#333F3C]/95 backdrop-blur-sm text-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="cursor-target transform hover:scale-105 transition-all duration-200">
                <div className="flex items-center space-x-2 mb-4">
                  <img 
                    src="/logo/memoirvault.png" 
                    alt="MemoirVault Logo" 
                    className="w-8 h-8 animate-pulse-glow"
                  />
                  <span className="font-serif text-xl font-semibold">MemoirVault</span>
                </div>
                <p className="text-sm opacity-75 leading-relaxed">
                  Your life story, completely private. Built with privacy-first principles
                  for the modern digital age.
                </p>
              </div>
              <div className="cursor-target transform hover:scale-105 transition-all duration-200">
                <h4 className="font-semibold mb-4">Product</h4>
                <ul className="space-y-2 text-sm opacity-75">
                  <li><a href="/pricing" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Pricing</a></li>
                  <li><a href="/features" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Features</a></li>
                  <li><a href="/security" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Security</a></li>
                  <li><a href="/roadmap" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Roadmap</a></li>
                </ul>
              </div>
              <div className="cursor-target transform hover:scale-105 transition-all duration-200">
                <h4 className="font-semibold mb-4">Support</h4>
                <ul className="space-y-2 text-sm opacity-75">
                  <li><a href="/help" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Help Center</a></li>
                  <li><a href="/contact" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Contact Us</a></li>
                  <li><a href="/community" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Community</a></li>
                  <li><a href="/status" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Status</a></li>
                </ul>
              </div>
              <div className="cursor-target transform hover:scale-105 transition-all duration-200">
                <h4 className="font-semibold mb-4">Legal</h4>
                <ul className="space-y-2 text-sm opacity-75">
                  <li><a href="/privacy" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Privacy Policy</a></li>
                  <li><a href="/terms" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Terms of Service</a></li>
                  <li><a href="/cookies" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Cookie Policy</a></li>
                  <li><a href="/refund" className="cursor-target hover:opacity-100 hover:scale-105 transition-all duration-200 inline-block">Refund Policy</a></li>
                </ul>
              </div>
          </div>
          <div className="border-t border-gray-600 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center text-sm opacity-75">
              <p>&copy; 2025 MemoirVault. All rights reserved. Built with privacy in mind.</p>
              <div className="flex space-x-4 mt-4 md:mt-0">
                <a href="/privacy" className="cursor-target hover:opacity-100 transition-opacity">Privacy</a>
                <a href="/terms" className="cursor-target hover:opacity-100 transition-opacity">Terms</a>
                <a href="/cookies" className="cursor-target hover:opacity-100 transition-opacity">Cookies</a>
                <a href="/refund" className="cursor-target hover:opacity-100 transition-opacity">Refunds</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
      </ClickSpark>
    </div>
  );
}
