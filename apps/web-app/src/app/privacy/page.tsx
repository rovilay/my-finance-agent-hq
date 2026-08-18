import { Container } from '@/components/ui';
import Link from 'next/link';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import { config } from '@/lib/config';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
              <h1 className="text-4xl font-display font-bold text-neutral-900">Privacy Policy</h1>
            </div>
            <p className="text-neutral-600 text-lg">Last Updated: August 17, 2026</p>
            <p className="text-neutral-700 mt-4">
              At My Finance Agent HQ, we take your privacy seriously. This policy explains how we
              collect, use, store, and protect your personal and financial information.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Information We Collect */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Database className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  1. Information We Collect
                </h2>
              </div>
              <div className="space-y-4 text-neutral-700">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">1.1 Personal Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Account Information:</strong> Email address, name, and password
                      (encrypted)
                    </li>
                    <li>
                      <strong>Authentication Data:</strong> When you sign up with Google or other
                      providers, we collect the information they share with us (typically email and
                      name)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">
                    1.2 Financial Documents and Data
                  </h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Uploaded Documents:</strong> Tax forms, receipts, invoices, bank
                      statements, and other financial documents you upload
                    </li>
                    <li>
                      <strong>Extracted Information:</strong> Data extracted from your documents
                      including transaction details, amounts, dates, vendor information, and
                      categorizations
                    </li>
                    <li>
                      <strong>Tax Information:</strong> Tax calculations, deductions, credits, and
                      related financial data you provide or we help you calculate
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">1.3 Usage Information</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Log data including IP addresses, browser type, and access times</li>
                    <li>Pages visited and features used within the application</li>
                    <li>Device information and identifiers</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Eye className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  2. How We Use Your Information
                </h2>
              </div>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700">
                <li>
                  <strong>Provide Services:</strong> Process and analyze your financial documents,
                  extract relevant information, and provide tax assistance
                </li>
                <li>
                  <strong>Improve Our Platform:</strong> Analyze usage patterns to enhance features
                  and user experience
                </li>
                <li>
                  <strong>Communication:</strong> Send service-related notifications, updates, and
                  respond to your inquiries
                </li>
                <li>
                  <strong>Security:</strong> Detect, prevent, and address technical issues, fraud,
                  and security threats
                </li>
                <li>
                  <strong>Compliance:</strong> Meet legal and regulatory obligations
                </li>
              </ul>
            </section>

            {/* Data Storage and Security */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Lock className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  3. Data Storage, Retention, and Security
                </h2>
              </div>
              <div className="space-y-4 text-neutral-700">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">3.1 Storage</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      All data is stored in secure, encrypted databases hosted on trusted cloud
                      infrastructure
                    </li>
                    <li>
                      Document files are stored in encrypted cloud storage with access controls
                    </li>
                    <li>Data is stored in servers located in secure data centers</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">3.2 Retention Policies</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Permanent Storage:</strong> Documents marked for permanent retention
                      are kept until you delete them or close your account
                    </li>
                    <li>
                      <strong>Verify and Purge:</strong> Documents marked for automatic deletion are
                      purged after data extraction and verification
                    </li>
                    <li>
                      <strong>Account Data:</strong> Your account information is retained while your
                      account is active
                    </li>
                    <li>
                      We may retain certain information for legal compliance even after account
                      deletion (typically 7 years for tax-related records)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">3.3 Security Measures</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      <strong>Encryption:</strong> All data is encrypted in transit (TLS/SSL) and at
                      rest (AES-256)
                    </li>
                    <li>
                      <strong>Authentication:</strong> Secure password hashing and optional
                      multi-factor authentication
                    </li>
                    <li>
                      <strong>Access Controls:</strong> Strict role-based access to your data;
                      employees have minimal necessary access
                    </li>
                    <li>
                      <strong>Regular Audits:</strong> Periodic security reviews and vulnerability
                      assessments
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                4. Data Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-neutral-700">
                <p className="font-semibold">
                  We do NOT sell your personal or financial information to third parties.
                </p>
                <p>We may share your information only in the following circumstances:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Service Providers:</strong> With trusted third-party services that help
                    us operate (e.g., cloud hosting, AI processing), under strict confidentiality
                    agreements
                  </li>
                  <li>
                    <strong>Legal Requirements:</strong> When required by law, court order, or
                    government request
                  </li>
                  <li>
                    <strong>Business Transfers:</strong> In the event of a merger, acquisition, or
                    sale of assets, your data may be transferred (you will be notified)
                  </li>
                  <li>
                    <strong>With Your Consent:</strong> When you explicitly authorize us to share
                    information
                  </li>
                </ul>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">5. Your Rights</h2>
              <ul className="list-disc pl-6 space-y-3 text-neutral-700">
                <li>
                  <strong>Access:</strong> You can access your personal information and documents at
                  any time through your account
                </li>
                <li>
                  <strong>Correction:</strong> You can update or correct your information in your
                  account settings
                </li>
                <li>
                  <strong>Deletion:</strong> You can delete documents and request account deletion,
                  subject to legal retention requirements
                </li>
                <li>
                  <strong>Export:</strong> You can export your data in common formats
                </li>
                <li>
                  <strong>Opt-Out:</strong> You can opt out of non-essential communications
                </li>
              </ul>
            </section>

            {/* Cookies and Tracking */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                6. Cookies and Tracking
              </h2>
              <p className="text-neutral-700 mb-3">We use cookies and similar technologies to:</p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Maintain your login session</li>
                <li>Remember your preferences</li>
                <li>Analyze how you use our service</li>
                <li>Improve security and prevent fraud</li>
              </ul>
              <p className="text-neutral-700 mt-3">
                You can control cookies through your browser settings, but this may affect
                functionality.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                7. Children's Privacy
              </h2>
              <p className="text-neutral-700">
                Our service is not intended for users under 18 years of age. We do not knowingly
                collect information from children. If you believe a child has provided us with
                personal information, please contact us immediately.
              </p>
            </section>

            {/* Changes to This Policy */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                8. Changes to This Policy
              </h2>
              <p className="text-neutral-700">
                We may update this privacy policy from time to time. We will notify you of
                significant changes via email or through a prominent notice in our application. Your
                continued use of the service after changes constitutes acceptance of the updated
                policy.
              </p>
            </section>

            {/* Contact */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Mail className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">9. Contact Us</h2>
              </div>
              <p className="text-neutral-700 mb-3">
                If you have questions or concerns about this privacy policy or our practices, please
                contact us:
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 text-neutral-700">
                <p>
                  <strong>Email:</strong> {config.emails.privacy}
                </p>
                <p className="mt-2">
                  <strong>Response Time:</strong> We aim to respond within 48 hours
                </p>
              </div>
            </section>
          </div>

          {/* Back Link */}
          <div className="mt-12 pt-8 border-t border-neutral-200">
            <Link
              href="/"
              className="text-primary-600 hover:text-primary-700 font-medium inline-flex items-center"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
}
