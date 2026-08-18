import { Container } from '@/components/ui';
import Link from 'next/link';
import { FileText, AlertTriangle, Shield, XCircle } from 'lucide-react';
import { config } from '@/lib/config';

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Container className="py-12 max-w-4xl">
        <div className="bg-white rounded-xl shadow-sm p-8 md:p-12">
          {/* Header */}
          <div className="mb-8 pb-8 border-b border-neutral-200">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-8 h-8 text-primary-600" />
              <h1 className="text-4xl font-display font-bold text-neutral-900">Terms of Service</h1>
            </div>
            <p className="text-neutral-600 text-lg">Last Updated: August 17, 2026</p>
            <p className="text-neutral-700 mt-4">
              Please read these Terms of Service carefully before using My Finance Agent HQ.
            </p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8">
            {/* Acceptance */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                1. Acceptance of Terms
              </h2>
              <p className="text-neutral-700 mb-3">
                By accessing or using My Finance Agent HQ ("the Service"), you agree to be bound by
                these Terms of Service and our Privacy Policy. If you do not agree to these terms,
                please do not use the Service.
              </p>
              <p className="text-neutral-700">
                These terms constitute a legally binding agreement between you and My Finance Agent
                HQ.
              </p>
            </section>

            {/* Service Description */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                2. Service Description
              </h2>
              <p className="text-neutral-700 mb-3">
                My Finance Agent HQ provides a platform for managing financial documents, extracting
                financial data, and assisting with tax-related calculations and information. The
                Service includes:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Document upload and storage with configurable retention policies</li>
                <li>Automated extraction of financial information from documents</li>
                <li>Tax calculation assistance and guidance</li>
                <li>Financial record organization and categorization</li>
                <li>AI-powered tax assistant for Canadian tax matters</li>
              </ul>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                3. User Responsibilities
              </h2>
              <div className="space-y-4 text-neutral-700">
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">3.1 Account Security</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for maintaining the confidentiality of your account</li>
                    <li>You must notify us immediately of any unauthorized access</li>
                    <li>You are responsible for all activities that occur under your account</li>
                    <li>You must provide accurate and complete information</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">3.2 Acceptable Use</h3>
                  <p className="mb-2">You agree NOT to:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>
                      Upload malicious files, viruses, or any harmful code that could damage the
                      Service
                    </li>
                    <li>Attempt to gain unauthorized access to any part of the Service</li>
                    <li>
                      Use the Service for illegal activities, fraud, or money laundering purposes
                    </li>
                    <li>Reverse engineer, decompile, or disassemble any part of the Service</li>
                    <li>Share your account credentials with others</li>
                    <li>
                      Upload documents that contain information about other individuals without
                      proper authorization
                    </li>
                    <li>Abuse, harass, or harm other users or our support staff</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 mb-2">3.3 Data Accuracy</h3>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You are responsible for the accuracy of the information you provide</li>
                    <li>
                      You must review all extracted data and calculations for accuracy before using
                      them
                    </li>
                    <li>
                      You should not solely rely on the Service for tax filing without professional
                      review
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Professional Advice Disclaimer */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle className="w-6 h-6 text-warning" />
                <h2 className="text-2xl font-semibold text-neutral-900">
                  4. Not Professional Advice
                </h2>
              </div>
              <div className="bg-warning-light border border-warning rounded-lg p-6 text-neutral-900">
                <p className="font-semibold mb-3">Important Disclaimer:</p>
                <p className="mb-3">
                  The Service provides information and tools to assist with financial document
                  management and tax calculations. However:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>
                      We are NOT tax professionals, accountants, or financial advisors
                    </strong>
                  </li>
                  <li>
                    The information provided is for informational purposes only and should not be
                    considered professional tax, legal, or financial advice
                  </li>
                  <li>
                    You should consult with qualified tax professionals, accountants, or financial
                    advisors before making any tax or financial decisions
                  </li>
                  <li>
                    We do not guarantee the accuracy, completeness, or currency of tax information
                  </li>
                  <li>
                    Tax laws change frequently and vary by jurisdiction; our Service may not reflect
                    the most current regulations
                  </li>
                </ul>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                5. Document Upload and Retention
              </h2>
              <div className="space-y-4 text-neutral-700">
                <p>When you upload documents, you can choose retention policies:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Permanent Storage:</strong> Documents are retained until you delete them
                    or close your account
                  </li>
                  <li>
                    <strong>Verify and Purge:</strong> Documents are automatically deleted after
                    data extraction and verification
                  </li>
                </ul>
                <p className="mt-4">
                  You grant us a limited license to process, store, and analyze your documents
                  solely for the purpose of providing the Service. We do not claim ownership of your
                  documents.
                </p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                6. Intellectual Property
              </h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  <strong>Our Rights:</strong> The Service, including all software, designs,
                  graphics, and content (excluding user-uploaded documents), is owned by My Finance
                  Agent HQ and is protected by copyright, trademark, and other intellectual property
                  laws.
                </p>
                <p>
                  <strong>Your Rights:</strong> You retain all ownership rights to your documents
                  and data. By using the Service, you grant us a limited, non-exclusive,
                  royalty-free license to process your data solely to provide the Service.
                </p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                7. Limitation of Liability
              </h2>
              <div className="space-y-4 text-neutral-700">
                <p>
                  TO THE MAXIMUM EXTENT PERMITTED BY LAW, MY FINANCE AGENT HQ SHALL NOT BE LIABLE
                  FOR:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    Any indirect, incidental, special, consequential, or punitive damages arising
                    from your use of the Service
                  </li>
                  <li>
                    Tax penalties, fines, or interest resulting from incorrect calculations or
                    information
                  </li>
                  <li>Loss of data, documents, or business opportunities</li>
                  <li>Errors or omissions in extracted data, calculations, or tax information</li>
                  <li>Service interruptions, downtime, or data breaches beyond our control</li>
                </ul>
                <p className="mt-4">
                  Our total liability for any claims arising from the Service shall not exceed the
                  amount you paid us in the 12 months preceding the claim, or $100, whichever is
                  greater.
                </p>
              </div>
            </section>

            {/* Warranties */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">8. Warranties</h2>
              <p className="text-neutral-700 mb-3">
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND,
                EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>Warranties of merchantability or fitness for a particular purpose</li>
                <li>That the Service will be uninterrupted, secure, or error-free</li>
                <li>That results obtained from the Service will be accurate or reliable</li>
                <li>That any errors will be corrected</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Shield className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl font-semibold text-neutral-900">9. Data Security</h2>
              </div>
              <p className="text-neutral-700 mb-3">
                While we implement industry-standard security measures to protect your data:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-neutral-700">
                <li>No system is completely secure; we cannot guarantee absolute security</li>
                <li>
                  You acknowledge the inherent security risks of transmitting data over the internet
                </li>
                <li>
                  You are responsible for backing up important documents independently of our
                  Service
                </li>
              </ul>
            </section>

            {/* Termination */}
            <section>
              <div className="flex items-center gap-2 mb-4">
                <XCircle className="w-6 h-6 text-error" />
                <h2 className="text-2xl font-semibold text-neutral-900">10. Termination</h2>
              </div>
              <div className="space-y-4 text-neutral-700">
                <p>
                  <strong>By You:</strong> You may terminate your account at any time through your
                  account settings. Upon termination:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Your access to the Service will cease immediately</li>
                  <li>Your documents and data will be deleted according to our retention policy</li>
                  <li>Some data may be retained for legal compliance (typically 7 years)</li>
                </ul>
                <p className="mt-4">
                  <strong>By Us:</strong> We may suspend or terminate your account if:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You violate these Terms of Service</li>
                  <li>Your account is used for fraudulent or illegal activities</li>
                  <li>We are required to do so by law</li>
                  <li>We discontinue the Service (with reasonable notice)</li>
                </ul>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">11. Changes to Terms</h2>
              <p className="text-neutral-700">
                We may modify these Terms of Service at any time. We will notify you of material
                changes via email or through the Service. Your continued use of the Service after
                changes constitutes acceptance of the modified terms. If you do not agree with the
                changes, you must stop using the Service and may close your account.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">
                12. Governing Law and Disputes
              </h2>
              <p className="text-neutral-700 mb-3">
                These Terms shall be governed by and construed in accordance with the laws of the
                jurisdiction where My Finance Agent HQ operates, without regard to conflict of law
                principles.
              </p>
              <p className="text-neutral-700">
                Any disputes arising from these Terms or the Service shall be resolved through
                binding arbitration, except where prohibited by law.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold text-neutral-900 mb-4">13. Contact Us</h2>
              <p className="text-neutral-700 mb-3">
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-neutral-50 rounded-lg p-4 text-neutral-700">
                <p>
                  <strong>Email:</strong> {config.emails.legal}
                </p>
                <p className="mt-2">
                  <strong>Support Email:</strong> {config.emails.support}
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
