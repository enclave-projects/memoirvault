'use client';

import { useState } from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function ContactPage() {
  const { user } = useUser();
  const [formData, setFormData] = useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    userId: user?.id || '',
    subject: 'General Inquiry',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const response = await fetch('/api/support/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: user?.fullName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
          userId: user?.id || '',
          subject: 'General Inquiry',
          message: ''
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Contact Us</h1>
        <p className="text-xl text-[#333F3C] opacity-75 mb-12 max-w-2xl">
          We're here to help! Send us a message and we'll get back to you as soon as possible.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-6">Get in Touch</h2>
            
            <div className="space-y-6 mb-8">
              <div>
                <h3 className="font-semibold text-[#004838] mb-2">📧 Email Support</h3>
                <p className="text-[#333F3C]">support@memoirvault.com</p>
                <p className="text-sm text-[#333F3C] opacity-75">Response time: 24 hours</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#004838] mb-2">🔒 Security Issues</h3>
                <p className="text-[#333F3C]">security@memoirvault.com</p>
                <p className="text-sm text-[#333F3C] opacity-75">For security vulnerabilities</p>
              </div>

              <div>
                <h3 className="font-semibold text-[#004838] mb-2">💬 Community</h3>
                <p className="text-[#333F3C]">Join our community forum</p>
                <Link href="/support/community" className="text-[#004838] hover:underline text-sm">
                  Visit Community →
                </Link>
              </div>

              <div>
                <h3 className="font-semibold text-[#004838] mb-2">📚 Help Center</h3>
                <p className="text-[#333F3C]">Find answers to common questions</p>
                <Link href="/support/help-center" className="text-[#004838] hover:underline text-sm">
                  Browse Help Articles →
                </Link>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-6">Send us a Message</h2>
            
            {submitStatus === 'success' && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  <p className="text-green-800">
                    Thank you for your message! We'll get back to you within 24 hours.
                  </p>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">✗</span>
                  <p className="text-red-800">
                    Sorry, there was an error sending your message. Please try again.
                  </p>
                </div>
              </div>
            )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-[#333F3C] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-[#333F3C] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                </div>

                <div>
                  <label htmlFor="userId" className="block text-sm font-medium text-[#333F3C] mb-2">
                    User ID (Optional)
                  </label>
                  <input
                    type="text"
                    id="userId"
                    name="userId"
                    value={formData.userId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                    placeholder="Your user ID (if applicable)"
                    readOnly={!!user}
                  />
                  {user && (
                    <p className="text-xs text-[#333F3C] mt-1">
                      Automatically filled from your account
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-[#333F3C] mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Technical Support">Technical Support</option>
                    <option value="Account Issues">Account Issues</option>
                    <option value="Privacy Concerns">Privacy Concerns</option>
                    <option value="Feature Request">Feature Request</option>
                    <option value="Bug Report">Bug Report</option>
                    <option value="Billing Question">Billing Question</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-[#333F3C] mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004838] focus:border-transparent resize-vertical"
                    placeholder="Please describe your question or issue in detail..."
                  />
                </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full gradient-cta text-[#E2FB6C] py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}