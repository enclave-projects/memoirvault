import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms of Service - MemoirVault',
  description: 'Terms of Service for MemoirVault - Your private digital autobiography platform',
};

export default function TermsOfService() {
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
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Terms of Service</h1>
        <p className="text-sm text-[#333F3C] opacity-75 mb-8">Last updated: July 23, 2025</p>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">1. Acceptance of Terms</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              By accessing and using MemoirVault ("Service"), you accept and agree to be bound by the terms and provision of this agreement. 
              If you do not agree to abide by the above, please do not use this service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">2. Description of Service</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              MemoirVault is a privacy-first digital autobiography platform that allows users to create, store, and manage personal memories 
              through text, images, audio, and video content. Our service emphasizes complete user privacy and data sovereignty.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">3. User Accounts and Registration</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              To use certain features of the Service, you must register for an account. You agree to:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Provide accurate, current, and complete information during registration</li>
              <li>Maintain and promptly update your account information</li>
              <li>Maintain the security of your password and account</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">4. Privacy and Data Protection</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Your privacy is fundamental to our service. We commit to:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Never selling, sharing, or monetizing your personal data</li>
              <li>Implementing end-to-end encryption for your content</li>
              <li>Providing you complete control over your data</li>
              <li>Allowing data export and deletion at any time</li>
              <li>Operating with full transparency about our data practices</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">5. User Content and Intellectual Property</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              You retain full ownership of all content you upload to MemoirVault. By using our service, you grant us only the 
              technical permissions necessary to provide the service, including storing and displaying your content back to you.
            </p>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              You are responsible for ensuring you have the right to upload and store all content in your account.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">6. Prohibited Uses</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">You may not use MemoirVault to:</p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Upload illegal, harmful, or offensive content</li>
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on the rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Distribute malware or engage in harmful activities</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">7. Service Availability</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              While we strive to maintain high availability, we do not guarantee uninterrupted access to the service. 
              We may temporarily suspend the service for maintenance, updates, or other operational reasons.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">8. Limitation of Liability</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              MemoirVault shall not be liable for any indirect, incidental, special, consequential, or punitive damages, 
              including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">9. Termination</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              You may terminate your account at any time. Upon termination, you may export your data, and we will 
              delete your account and associated data according to our data retention policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">10. Changes to Terms</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              We reserve the right to modify these terms at any time. We will notify users of significant changes 
              via email or through the service. Continued use after changes constitutes acceptance of new terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">11. Contact Information</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p className="text-[#333F3C] leading-relaxed">
              Email: pranjal.ai.arena@gmail.com<br />
              Address: Prayagraj, Uttar Pradesh, India
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}