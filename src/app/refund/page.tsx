import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Refund Policy - MemoirVault',
  description: 'Refund Policy for MemoirVault - Our commitment to customer satisfaction',
};

export default function RefundPolicy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="px-6 py-4 border-b border-[#EBEDE8]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[#004838] to-[#073127] rounded-lg flex items-center justify-center">
              <span className="text-[#E2FB6C] font-bold text-sm">M</span>
            </div>
            <span className="font-serif text-xl font-semibold text-[#333F3C]">MemoirVault</span>
          </a>
          <a href="/" className="text-[#333F3C] hover:text-[#004838] transition-colors">
            ← Back to Home
          </a>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="font-serif text-4xl font-semibold text-[#333F3C] mb-8">Refund Policy</h1>
        <p className="text-sm text-[#333F3C] opacity-75 mb-8">Last updated: July 23, 2025</p>

        <div className="bg-[#E2FB6C] bg-opacity-20 border border-[#E2FB6C] rounded-lg p-6 mb-8">
          <h3 className="font-semibold text-[#004838] mb-2">Customer Satisfaction Guarantee</h3>
          <p className="text-[#004838]">
            We're committed to your satisfaction with MemoirVault. If you're not completely happy with our service, 
            we offer flexible refund options to ensure you feel confident in your choice.
          </p>
        </div>

        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">1. Free Trial and Basic Plan</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              MemoirVault offers a free tier that allows you to experience our core features before committing to a paid plan:
            </p>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>No credit card required for the free plan</li>
              <li>Full access to basic memoir creation features</li>
              <li>Limited storage capacity (1GB)</li>
              <li>No time restrictions on free plan usage</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">2. Premium Plan Refunds</h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="font-semibold text-green-800 mb-2">30-Day Money-Back Guarantee</h3>
              <p className="text-green-700">
                All premium subscriptions come with a 30-day money-back guarantee. If you're not satisfied 
                for any reason, we'll provide a full refund within 30 days of your initial purchase.
              </p>
            </div>

            <h3 className="font-semibold text-[#333F3C] mb-2">Eligible for Full Refund:</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Requests made within 30 days of initial subscription</li>
              <li>Technical issues that prevent service usage</li>
              <li>Service not meeting advertised features</li>
              <li>Accidental or unauthorized purchases</li>
              <li>Dissatisfaction with service quality</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Refund Process:</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Contact our support team at support@memoirvault.com</li>
              <li>Provide your account email and reason for refund</li>
              <li>We'll process your request within 2 business days</li>
              <li>Refunds typically appear in 5-10 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">3. Subscription Cancellations</h2>
            
            <h3 className="font-semibold text-[#333F3C] mb-2">Monthly Subscriptions</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Cancel anytime before your next billing cycle</li>
              <li>Access continues until the end of your current billing period</li>
              <li>No cancellation fees or penalties</li>
              <li>Easy cancellation through account settings</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Annual Subscriptions</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>30-day money-back guarantee for full refund</li>
              <li>After 30 days: Pro-rated refund for unused months</li>
              <li>Minimum 3-month usage before pro-rated refunds apply</li>
              <li>Account remains active until subscription expires</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">4. Pro-Rated Refunds</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              For annual subscriptions beyond the 30-day guarantee period:
            </p>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-blue-800 mb-2">Calculation Method</h4>
              <p className="text-blue-700 text-sm">
                Refund Amount = (Annual Fee ÷ 12) × Remaining Full Months
              </p>
            </div>

            <h3 className="font-semibold text-[#333F3C] mb-2">Example:</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Annual subscription: $120 (paid in January)</li>
              <li>Cancellation request: June 15th (5.5 months used)</li>
              <li>Remaining full months: 6 months</li>
              <li>Refund amount: ($120 ÷ 12) × 6 = $60</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Pro-Rated Refund Conditions:</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Available after 30-day guarantee period expires</li>
              <li>Minimum 3 months of service usage required</li>
              <li>Calculated based on full remaining months only</li>
              <li>Processed within 10 business days</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">5. Non-Refundable Items</h2>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <p className="text-yellow-800">
                The following items are generally non-refundable, except in cases of technical failure or billing errors:
              </p>
            </div>

            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Add-on storage purchases (after 7 days)</li>
              <li>One-time feature unlocks</li>
              <li>Gift subscriptions (after recipient activation)</li>
              <li>Subscriptions cancelled after 12 months of usage</li>
              <li>Accounts terminated for Terms of Service violations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">6. Refund Methods</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              Refunds are processed using the same payment method used for the original purchase:
            </p>

            <div className="space-y-4">
              <div className="border border-[#EBEDE8] rounded-lg p-4">
                <h4 className="font-semibold text-[#333F3C] mb-2">Credit/Debit Cards</h4>
                <p className="text-[#333F3C] text-sm">
                  Refunds appear as a credit on your statement within 5-10 business days
                </p>
              </div>

              <div className="border border-[#EBEDE8] rounded-lg p-4">
                <h4 className="font-semibold text-[#333F3C] mb-2">PayPal</h4>
                <p className="text-[#333F3C] text-sm">
                  Refunds processed to your PayPal account within 3-5 business days
                </p>
              </div>

              <div className="border border-[#EBEDE8] rounded-lg p-4">
                <h4 className="font-semibold text-[#333F3C] mb-2">Bank Transfers</h4>
                <p className="text-[#333F3C] text-sm">
                  Direct refunds to your bank account within 7-14 business days
                </p>
              </div>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">7. Data Retention After Refund</h2>
            
            <div className="bg-[#EBEDE8] rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-[#333F3C] mb-2">Your Data Remains Safe</h3>
              <p className="text-[#333F3C]">
                Even after a refund, your memoir data is preserved for 90 days, allowing you to:
              </p>
            </div>

            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Export all your content and media files</li>
              <li>Reactivate your account if you change your mind</li>
              <li>Access read-only version of your content</li>
              <li>Request permanent deletion if desired</li>
            </ul>

            <p className="text-[#333F3C] leading-relaxed mb-4">
              After 90 days, accounts are automatically archived unless reactivated or deletion is requested.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">8. Dispute Resolution</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              If you're not satisfied with our refund decision, we offer additional resolution options:
            </p>

            <h3 className="font-semibold text-[#333F3C] mb-2">Internal Review Process</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Request escalation to our Customer Success Manager</li>
              <li>Provide additional context or documentation</li>
              <li>Receive response within 5 business days</li>
              <li>Final decision communicated in writing</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">External Options</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Contact your payment provider for chargeback options</li>
              <li>File complaint with relevant consumer protection agency</li>
              <li>Seek mediation through online dispute resolution platforms</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">9. How to Request a Refund</h2>
            
            <div className="bg-[#E2FB6C] bg-opacity-20 border border-[#E2FB6C] rounded-lg p-6 mb-4">
              <h3 className="font-semibold text-[#004838] mb-2">Quick Refund Process</h3>
              <ol className="list-decimal list-inside text-[#004838] space-y-2">
                <li>Email us at <strong>refunds@memoirvault.com</strong></li>
                <li>Include your account email and subscription details</li>
                <li>Briefly explain your reason for the refund request</li>
                <li>We'll respond within 24 hours with next steps</li>
              </ol>
            </div>

            <h3 className="font-semibold text-[#333F3C] mb-2">Required Information</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>Account email address</li>
              <li>Approximate subscription start date</li>
              <li>Reason for refund request</li>
              <li>Preferred refund method (if different from original payment)</li>
            </ul>

            <h3 className="font-semibold text-[#333F3C] mb-2">Alternative Contact Methods</h3>
            <ul className="list-disc list-inside text-[#333F3C] space-y-2 mb-4">
              <li>In-app support chat (fastest response)</li>
              <li>Account settings → Billing → Request Refund</li>
              <li>Phone support: Available for premium subscribers</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="font-serif text-2xl font-semibold text-[#333F3C] mb-4">10. Contact Information</h2>
            <p className="text-[#333F3C] leading-relaxed mb-4">
              For refund requests or questions about this policy:
            </p>
            <div className="bg-[#EBEDE8] rounded-lg p-4">
              <p className="text-[#333F3C]">
                <strong>Billing Support Team</strong><br />
                Email: refunds@memoirvault.com<br />
                Phone: 1-800-MEMOIR-1 (Premium subscribers)<br />
                Hours: Monday-Friday, 9 AM - 6 PM EST<br />
                Response time: Within 24 hours
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}