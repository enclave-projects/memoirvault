'use client';

import Link from 'next/link';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#EBEDE8]">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
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

      {/* Hero Section */}
      <section className="px-6 py-16 text-center max-w-4xl mx-auto">
        <h1 className="font-serif text-4xl md:text-5xl font-semibold text-[#333F3C] mb-6">
          Choose Your Perfect Plan
        </h1>
        <p className="text-xl text-[#333F3C] opacity-75 mb-8 max-w-2xl mx-auto">
          Start your digital autobiography journey with complete privacy and control.
          Upgrade anytime as your story grows.
        </p>
      </section>

      {/* Pricing Cards */}
      <section className="px-6 pb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Free Plan */}
            <div className="bg-white border-2 border-[#EBEDE8] rounded-2xl p-8 relative">
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-semibold text-[#333F3C] mb-2">Free</h3>
                <div className="text-4xl font-bold text-[#333F3C] mb-2">$0</div>
                <p className="text-[#333F3C] opacity-75">Forever free</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">2GB Storage</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Unlimited entries</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Text, photos, audio, video</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">End-to-end encryption</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Community support</span>
                </div>
              </div>

              <Link href="/dashboard" className="block w-full text-center border-2 border-[#E2FB6C] text-[#004838] px-6 py-3 rounded-xl font-semibold hover:bg-[#E2FB6C] transition-all duration-200">
                Get Started Free
              </Link>

              <p className="text-center text-sm text-[#333F3C] opacity-75 mt-4">
                Perfect for new users and casual journaling
              </p>
            </div>

            {/* Basic Plan */}
            <div className="bg-white border-2 border-[#E2FB6C] rounded-2xl p-8 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#E2FB6C] text-[#004838] px-4 py-1 rounded-full text-sm font-semibold">
                  Most Popular
                </span>
              </div>

              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-semibold text-[#333F3C] mb-2">Basic</h3>
                <div className="text-4xl font-bold text-[#333F3C] mb-2">$9</div>
                <p className="text-[#333F3C] opacity-75">per month</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]"><strong>30GB Storage</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Everything in Free</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Priority upload speeds</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Advanced search & filters</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#004838]">✓</span>
                  <span className="text-[#333F3C]">Email support</span>
                </div>
              </div>

              <button
                onClick={() => alert("Payment processing is not available yet. This feature will be available in the future. All users currently have 2GB of free storage.")}
                className="w-full gradient-cta text-[#E2FB6C] px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
              >
                Upgrade to Basic
              </button>

              <p className="text-center text-sm text-[#333F3C] opacity-75 mt-4">
                For regular users who want reliable features
              </p>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-[#004838] to-[#073127] rounded-2xl p-8 text-white relative">
              <div className="text-center mb-8">
                <h3 className="font-serif text-2xl font-semibold mb-2">Pro</h3>
                <div className="text-4xl font-bold mb-2">$19</div>
                <p className="opacity-75">per month</p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-[#E2FB6C]">✓</span>
                  <span><strong>50GB Storage</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#E2FB6C]">✓</span>
                  <span>Everything in Basic</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#E2FB6C]">✓</span>
                  <span>AI-powered insights</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#E2FB6C]">✓</span>
                  <span>Advanced privacy controls</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#E2FB6C]">✓</span>
                  <span>Priority support</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[#E2FB6C]">✓</span>
                  <span>Custom themes</span>
                </div>
              </div>

              <button
                onClick={() => alert("Payment processing is not available yet. This feature will be available in the future. All users currently have 2GB of free storage.")}
                className="w-full bg-[#E2FB6C] text-[#004838] px-6 py-3 rounded-xl font-semibold hover:bg-opacity-90 transition-all duration-200"
              >
                Upgrade to Pro
              </button>

              <p className="text-center text-sm opacity-75 mt-4">
                For power users who need advanced features
              </p>
            </div>
          </div>

          {/* Coming Soon Message */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
              <h2 className="font-serif text-2xl font-semibold text-blue-800 mb-4">
                Billing Coming Soon
              </h2>
              <p className="text-blue-700 mb-4">
                Our payment processing system is currently under development.
                All users currently have access to 2GB of free storage.
              </p>
              <p className="text-blue-700">
                Premium plans will be available in the future with increased storage capacity
                and additional features.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}