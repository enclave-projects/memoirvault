import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - MemoirVault',
  description: 'Privacy Policy for MemoirVault - How we protect your personal data and memories',
};

export default function PrivacyPolicy() {
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
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Privacy Policy</h1>
        <p className="text-sm text-[#333F3C] opacity-75 mb-8">Last updated: July 23, 2025</p>

        <div className="bg-[#E2FB6C] bg-opacity-20 border border-[#E2FB6C] rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-[#004838] mb-2">Our Privacy Commitment</h3>
          <p className="text-[#004838]">
            MemoirVault is built on the principle of complete privacy. Your personal memories and data are yours alone. 
            We never sell, share, or monetize your personal information.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">1. Information We Collect</h2>
            
            <h3 className="font-semibold text-[#333F3C] mb-2">Account Information</h3>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              When you create an account, we collect:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Email address (for account creation and communication)</li>
              <li>Authentication data (securely hashed passwords)</li>
              <li>Account preferences and settings</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Content Data</h3>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Your memoir content including:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Text entries and descriptions</li>
              <li>Images, videos, and audio files</li>
              <li>Metadata associated with your uploads</li>
              <li>Timestamps and organization data</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Technical Information</h3>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Minimal technical data for service operation:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>IP address (for security and service delivery)</li>
              <li>Browser type and version (for compatibility)</li>
              <li>Device information (for responsive design)</li>
              <li>Usage patterns (for service improvement only)</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">2. How We Use Your Information</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">We use your information solely to:</p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Provide and maintain the MemoirVault service</li>
              <li>Authenticate your account and ensure security</li>
              <li>Store and display your content back to you</li>
              <li>Communicate important service updates</li>
              <li>Improve service performance and reliability</li>
              <li>Comply with legal obligations when required</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">3. Data Protection and Security</h2>
            
            <h3 className="font-semibold text-[#333F3C] mb-2">Encryption</h3>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              All your data is protected with industry-standard encryption:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>End-to-end encryption for all content</li>
              <li>Encrypted data transmission (HTTPS/TLS)</li>
              <li>Encrypted storage at rest</li>
              <li>Secure key management practices</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Access Controls</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Multi-factor authentication support</li>
              <li>Regular security audits and monitoring</li>
              <li>Limited employee access on need-to-know basis</li>
              <li>Secure infrastructure and hosting</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">4. Data Sharing and Third Parties</h2>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-800 font-semibold">
                We do NOT sell, rent, or share your personal data with third parties for marketing purposes.
              </p>
            </div>

            <p className="text-[#333F3C] leading-relaxed mb-4">
              We only share data in these limited circumstances:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li><strong>Service Providers:</strong> Trusted partners who help operate our service (hosting, authentication) under strict privacy agreements</li>
              <li><strong>Legal Requirements:</strong> When required by law, court order, or to protect our rights and users' safety</li>
              <li><strong>Business Transfer:</strong> In the event of a merger or acquisition, with advance notice to users</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">5. Your Rights and Controls</h2>
            
            <h3 className="font-semibold text-[#333F3C] mb-2">Data Access and Portability</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Export all your data in standard formats</li>
              <li>Download your content at any time</li>
              <li>Access your account information and settings</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Data Deletion</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Delete individual entries or media files</li>
              <li>Permanently delete your entire account</li>
              <li>Request complete data removal from our systems</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Privacy Controls</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Manage account privacy settings</li>
              <li>Control data sharing preferences</li>
              <li>Opt out of non-essential communications</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">6. Data Retention</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              We retain your data only as long as necessary to provide the service:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Active accounts: Data retained while account is active</li>
              <li>Deleted accounts: Data permanently deleted within 30 days</li>
              <li>Legal requirements: Some data may be retained longer if required by law</li>
              <li>Backups: Deleted data removed from backups within 90 days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">7. International Data Transfers</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Your data may be processed in countries other than your own. We ensure adequate protection through:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Standard contractual clauses with service providers</li>
              <li>Compliance with GDPR and other privacy regulations</li>
              <li>Regular privacy impact assessments</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">8. Children's Privacy</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              MemoirVault is not intended for children under 13. We do not knowingly collect personal information 
              from children under 13. If we become aware of such collection, we will delete the information immediately.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">9. Changes to This Policy</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              We may update this privacy policy from time to time. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Email notification to your registered address</li>
              <li>Prominent notice on our website</li>
              <li>In-app notification when you next log in</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">10. Contact Us</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              For any privacy-related questions or concerns, please contact us:
            </p>
            <div className="bg-[#EBEDE8] rounded-lg p-4">
              <p className="text-[#333F3C]">
                <strong>Privacy Officer</strong><br />
                Email: pranjal.ai.arena@gmail.com<br />
                Response time: Within 72 hours
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}