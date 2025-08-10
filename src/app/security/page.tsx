import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security - MemoirVault',
  description: 'Learn about MemoirVault security features - End-to-end encryption, privacy protection, and data security',
};

export default function SecurityPage() {
  const securityFeatures = [
    {
      icon: '🔐',
      title: 'End-to-End Encryption',
      description: 'All your personal data is encrypted both in transit and at rest using industry-standard AES-256 encryption.',
      technical: 'TLS 1.3 for data in transit, AES-256-GCM for data at rest'
    },
    {
      icon: '🛡️',
      title: 'Zero-Knowledge Architecture',
      description: 'We cannot access your personal content. Your data is encrypted with keys only you control.',
      technical: 'Client-side encryption with user-controlled key derivation'
    },
    {
      icon: '🔒',
      title: 'Secure Authentication',
      description: 'Multi-factor authentication powered by Clerk with OAuth2 and biometric support.',
      technical: 'OAuth2, OIDC, WebAuthn, and TOTP support'
    },
    {
      icon: '🏛️',
      title: 'GDPR Compliance',
      description: 'Full compliance with GDPR, CCPA, and other privacy regulations. Complete data portability.',
      technical: 'Right to access, rectification, erasure, and data portability'
    },
    {
      icon: '🌐',
      title: 'Secure Infrastructure',
      description: 'Hosted on enterprise-grade infrastructure with 99.9% uptime and DDoS protection.',
      technical: 'Cloudflare CDN, automated backups, and monitoring'
    },
    {
      icon: '📊',
      title: 'No Tracking',
      description: 'Zero analytics, no tracking cookies, no data selling. Your privacy is absolute.',
      technical: 'No third-party trackers, minimal logging, privacy-first design'
    }
  ];

  const certifications = [
    {
      name: 'SOC 2 Type II',
      description: 'Security, availability, and confidentiality controls',
      status: 'Compliant'
    },
    {
      name: 'GDPR',
      description: 'European Union data protection regulation',
      status: 'Compliant'
    },
    {
      name: 'CCPA',
      description: 'California Consumer Privacy Act',
      status: 'Compliant'
    },
    {
      name: 'ISO 27001',
      description: 'Information security management standard',
      status: 'In Progress'
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
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Security</h1>
        <p className="text-xl text-[#333F3C] opacity-75 mb-12 max-w-2xl">
          Enterprise-grade security with zero-knowledge architecture. Your memories are yours alone.
        </p>

        <div className="bg-[#E2FB6C] bg-opacity-20 border border-[#E2FB6C] rounded-lg p-6 mb-12">
          <h3 className="font-semibold text-[#004838] mb-2">Our Security Commitment</h3>
          <p className="text-[#004838]">
            MemoirVault is built on the principle of complete privacy. Your personal memories and data are yours alone. 
            We never sell, share, or monetize your personal information.
          </p>
        </div>

        <div className="space-y-12">
          {securityFeatures.map((feature, index) => (
            <div key={index} className="border-b border-[#EBEDE8] pb-12 last:border-b-0">
              <div className="flex items-start space-x-6">
                <div className="text-4xl">{feature.icon}</div>
                <div className="flex-1">
                  <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">{feature.title}</h2>
                  <p className="text-[#333F3C] leading-relaxed mb-4">{feature.description}</p>
                  <div className="bg-[#EBEDE8] rounded-lg p-4">
                    <p className="text-sm text-[#333F3C] font-mono">{feature.technical}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Compliance & Best Practices */}
        <div className="mt-16 pt-12 border-t border-[#EBEDE8]">
          <h2 className="font-serif text-3xl font-semibold text-[#333F3C] mb-8">Compliance & Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#EBEDE8] rounded-lg p-6">
              <h3 className="font-semibold text-[#004838] mb-4">Compliance Standards</h3>
              <ul className="space-y-2 text-[#333F3C]">
                <li>• GDPR compliant data handling</li>
                <li>• CCPA privacy regulations</li>
                <li>• SOC 2 Type II controls</li>
                <li>• Regular security audits</li>
              </ul>
            </div>
            
            <div className="bg-[#EBEDE8] rounded-lg p-6">
              <h3 className="font-semibold text-[#004838] mb-4">Your Security Responsibilities</h3>
              <ul className="space-y-2 text-[#333F3C]">
                <li>• Use strong, unique passwords</li>
                <li>• Enable two-factor authentication</li>
                <li>• Keep your devices updated</li>
                <li>• Report suspicious activity</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 pt-12 border-t border-[#EBEDE8] text-center">
          <h2 className="font-serif text-3xl font-semibold text-[#333F3C] mb-6">
            Security Questions?
          </h2>
          <p className="text-[#333F3C] mb-8 max-w-2xl mx-auto">
            Our security team is here to help. Report vulnerabilities or ask security-related questions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/support/contact" 
              className="gradient-cta text-[#E2FB6C] px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Contact Security Team
            </Link>
            <a 
              href="mailto:security@memoirvault.com" 
              className="border-2 border-[#E2FB6C] text-[#004838] px-8 py-3 rounded-xl font-semibold hover:bg-[#E2FB6C] transition-all duration-200"
            >
              security@memoirvault.com
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}