import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Legal Information - MemoirVault',
  description: 'Legal policies and information for MemoirVault users',
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#EBEDE8]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#004838] to-[#073127] rounded-lg flex items-center justify-center">
              <span className="text-[#E2FB6C] font-bold text-sm">M</span>
            </div>
            <span className="font-serif text-xl font-semibold text-[#333F3C]">MemoirVault</span>
          </Link>
          <Link href="/" className="text-[#333F3C] hover:text-[#004838] transition-colors">
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Legal Information</h1>
        <p className="text-xl text-[#333F3C] mb-12 opacity-75">
          Transparency and trust are fundamental to MemoirVault. Here you'll find all our legal policies and commitments.
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Privacy Policy */}
          <div className="bg-white border border-[#EBEDE8] rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🔒</div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-3">Privacy Policy</h2>
            <p className="text-[#333F3C] mb-4 leading-relaxed">
              Learn how we protect your personal data and memories with our privacy-first approach. 
              No tracking, no data selling, complete transparency.
            </p>
            <a 
              href="/privacy" 
              className="inline-flex items-center text-[#004838] font-medium hover:text-[#073127] transition-colors"
            >
              Read Privacy Policy →
            </a>
          </div>

          {/* Terms of Service */}
          <div className="bg-white border border-[#EBEDE8] rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">📋</div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-3">Terms of Service</h2>
            <p className="text-[#333F3C] mb-4 leading-relaxed">
              Understand your rights and responsibilities when using MemoirVault. 
              Clear, fair terms that put users first.
            </p>
            <a 
              href="/terms" 
              className="inline-flex items-center text-[#004838] font-medium hover:text-[#073127] transition-colors"
            >
              Read Terms of Service →
            </a>
          </div>

          {/* Cookie Policy */}
          <div className="bg-white border border-[#EBEDE8] rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">🍪</div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-3">Cookie Policy</h2>
            <p className="text-[#333F3C] mb-4 leading-relaxed">
              We use minimal cookies, only what's essential for the service to function. 
              No tracking or advertising cookies.
            </p>
            <a 
              href="/cookies" 
              className="inline-flex items-center text-[#004838] font-medium hover:text-[#073127] transition-colors"
            >
              Read Cookie Policy →
            </a>
          </div>

          {/* Refund Policy */}
          <div className="bg-white border border-[#EBEDE8] rounded-xl p-6 hover:shadow-lg transition-shadow">
            <div className="text-4xl mb-4">💰</div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-3">Refund Policy</h2>
            <p className="text-[#333F3C] mb-4 leading-relaxed">
              Our customer satisfaction guarantee with 30-day money-back policy. 
              Fair refunds and transparent billing practices.
            </p>
            <a 
              href="/refund" 
              className="inline-flex items-center text-[#004838] font-medium hover:text-[#073127] transition-colors"
            >
              Read Refund Policy →
            </a>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-[#EBEDE8] rounded-xl p-8">
          <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">Our Commitment to Transparency</h2>
          <p className="text-[#333F3C] leading-relaxed mb-6">
            At MemoirVault, we believe in complete transparency about how we operate, protect your data, 
            and serve our users. These policies are written in plain language and updated regularly to 
            reflect our practices and any changes in regulations.
          </p>
          
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div>
              <h3 className="font-semibold text-[#333F3C] mb-2">Regular Updates</h3>
              <p className="text-[#333F3C] opacity-75">
                We review and update our policies regularly to ensure they remain current and accurate.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#333F3C] mb-2">User Notification</h3>
              <p className="text-[#333F3C] opacity-75">
                We notify users of any material changes to our policies via email and in-app notifications.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-[#333F3C] mb-2">Open Communication</h3>
              <p className="text-[#333F3C] opacity-75">
                Have questions? Contact our legal team at legal@memoirvault.com for clarification.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-8 text-center">
          <h3 className="font-serif text-xl font-semibold text-[#333F3C] mb-4">Questions About Our Policies?</h3>
          <p className="text-[#333F3C] mb-6">
            We're here to help clarify any questions you might have about our legal policies.
          </p>
          <a 
            href="mailto:legal@memoirvault.com" 
            className="gradient-cta text-[#E2FB6C] px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200 inline-block"
          >
            Contact Legal Team
          </a>
        </div>
      </main>
    </div>
  );
}