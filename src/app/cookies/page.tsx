import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Cookie Policy - MemoirVault',
  description: 'Cookie Policy for MemoirVault - How we use cookies and similar technologies',
};

export default function CookiePolicy() {
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
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Cookie Policy</h1>
        <p className="text-sm text-[#333F3C] opacity-75 mb-8">Last updated: July 23, 2025</p>

        <div className="bg-[#E2FB6C] bg-opacity-20 border border-[#E2FB6C] rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-[#004838] mb-2">Privacy-First Approach</h3>
          <p className="text-[#004838]">
            MemoirVault uses minimal cookies and similar technologies, only what's necessary for the service to function.
            We do not use tracking cookies or share data with advertising networks.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">1. What Are Cookies?</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Cookies are small text files that are stored on your device when you visit a website. They help websites
              remember information about your visit, such as your preferences and login status.
            </p>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Similar technologies include local storage, session storage, and other browser storage mechanisms that
              serve similar purposes.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">2. How We Use Cookies</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              MemoirVault uses cookies and similar technologies only for essential functions:
            </p>

            <div className="space-y-6">
              <div className="border border-[#EBEDE8] rounded-lg p-6">
                <h3 className="font-semibold text-[#004838] mb-2">🔐 Authentication Cookies</h3>
                <p className="text-[#333F3C] mb-2"><strong>Purpose:</strong> Keep you logged in securely</p>
                <p className="text-[#333F3C] mb-2"><strong>Duration:</strong> Session-based (deleted when you close browser)</p>
                <p className="text-[#333F3C] mb-2"><strong>Essential:</strong> Yes - Required for account access</p>
                <p className="text-[#333F3C]"><strong>Data:</strong> Encrypted session tokens, no personal information</p>
              </div>

              <div className="border border-[#EBEDE8] rounded-lg p-6">
                <h3 className="font-semibold text-[#004838] mb-2">⚙️ Functional Cookies</h3>
                <p className="text-[#333F3C] mb-2"><strong>Purpose:</strong> Remember your preferences and settings</p>
                <p className="text-[#333F3C] mb-2"><strong>Duration:</strong> Up to 1 year</p>
                <p className="text-[#333F3C] mb-2"><strong>Essential:</strong> No - But improves user experience</p>
                <p className="text-[#333F3C]"><strong>Data:</strong> Theme preferences, language settings, UI preferences</p>
              </div>

              <div className="border border-[#EBEDE8] rounded-lg p-6">
                <h3 className="font-semibold text-[#004838] mb-2">🛡️ Security Cookies</h3>
                <p className="text-[#333F3C] mb-2"><strong>Purpose:</strong> Protect against security threats</p>
                <p className="text-[#333F3C] mb-2"><strong>Duration:</strong> Session-based</p>
                <p className="text-[#333F3C] mb-2"><strong>Essential:</strong> Yes - Required for security</p>
                <p className="text-[#333F3C]"><strong>Data:</strong> CSRF tokens, security validation data</p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">3. What We DON'T Use</h2>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-red-800 mb-2">❌ No Tracking or Analytics Cookies</h3>
              <p className="text-red-700">
                We do not use Google Analytics, Facebook Pixel, or any other tracking technologies that
                monitor your behavior across websites.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-red-800 mb-2">❌ No Advertising Cookies</h3>
              <p className="text-red-700">
                We do not use cookies for advertising purposes or share data with advertising networks.
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-6">
              <h3 className="font-semibold text-red-800 mb-2">❌ No Third-Party Marketing Cookies</h3>
              <p className="text-red-700">
                We do not allow third-party marketing companies to place cookies on our website.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">4. Third-Party Services</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              We use minimal third-party services, each with their own cookie policies:
            </p>

            <div className="space-y-4">
              <div className="border border-[#EBEDE8] rounded-lg p-4">
                <h4 className="font-semibold text-[#333F3C] mb-2">Clerk (Authentication)</h4>
                <p className="text-[#333F3C] text-sm mb-2">
                  <strong>Purpose:</strong> Secure user authentication and account management
                </p>
                <p className="text-[#333F3C] text-sm mb-2">
                  <strong>Cookies:</strong> Session management and security cookies
                </p>
                <p className="text-[#333F3C] text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://clerk.com/privacy" className="text-[#004838] underline">clerk.com/privacy</a>
                </p>
              </div>

              <div className="border border-[#EBEDE8] rounded-lg p-4">
                <h4 className="font-semibold text-[#333F3C] mb-2">Cloudflare (CDN & Security)</h4>
                <p className="text-[#333F3C] text-sm mb-2">
                  <strong>Purpose:</strong> Content delivery and DDoS protection
                </p>
                <p className="text-[#333F3C] text-sm mb-2">
                  <strong>Cookies:</strong> Security and performance optimization
                </p>
                <p className="text-[#333F3C] text-sm">
                  <strong>Privacy Policy:</strong> <a href="https://www.cloudflare.com/privacy/" className="text-[#004838] underline">cloudflare.com/privacy</a>
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">5. Managing Your Cookie Preferences</h2>

            <h3 className="font-semibold text-[#333F3C] mb-2">Browser Settings</h3>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              You can control cookies through your browser settings:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-6">
              <li><strong>Chrome:</strong> Settings → Privacy and Security → Cookies and other site data</li>
              <li><strong>Firefox:</strong> Settings → Privacy & Security → Cookies and Site Data</li>
              <li><strong>Safari:</strong> Preferences → Privacy → Manage Website Data</li>
              <li><strong>Edge:</strong> Settings → Cookies and site permissions → Cookies and site data</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Account Settings</h3>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              When logged in, you can manage functional cookies through your account preferences:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Theme and appearance preferences</li>
              <li>Language and localization settings</li>
              <li>UI customization options</li>
            </ul>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-800">
                <strong>Note:</strong> Disabling essential cookies may prevent you from using certain features
                of MemoirVault, including logging in and accessing your account.
              </p>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">6. Cookie Consent</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              By using MemoirVault, you consent to our use of essential cookies required for the service to function.
              For non-essential cookies, we will ask for your explicit consent.
            </p>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              You can withdraw your consent at any time by:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Changing your browser settings</li>
              <li>Updating your account preferences</li>
              <li>Contacting us directly</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">7. Updates to This Policy</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              We may update this Cookie Policy from time to time to reflect changes in our practices or
              applicable laws. We will notify you of any material changes by:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Updating the "Last updated" date at the top of this policy</li>
              <li>Sending an email notification for significant changes</li>
              <li>Displaying a notice on our website</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">8. Contact Us</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              If you have any questions about our use of cookies or this Cookie Policy, please contact us:
            </p>
            <div className="bg-[#EBEDE8] rounded-lg p-4">
              <p className="text-[#333F3C]">
                <strong>Privacy Team</strong><br />
                Email: pranjal.ai.arena@gmail.com<br />
                Subject: Cookie Policy Inquiry<br />
                Response time: Within 48 hours
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}