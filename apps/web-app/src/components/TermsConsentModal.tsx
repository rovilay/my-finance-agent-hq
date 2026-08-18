import React, { useState } from 'react';
import { Modal, Button } from '@/components/ui';
import { FileText, Shield } from 'lucide-react';
import Link from 'next/link';
import { config } from '@/lib/config';

interface TermsConsentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
}

export function TermsConsentModal({ isOpen, onClose, onAccept }: TermsConsentModalProps) {
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Review Our Policies" size="xl">
      <div className="space-y-6">
        {/* Info Banner */}
        <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
          <p className="text-sm text-primary-900">
            Please review our Privacy Policy and Terms of Service before continuing. We take your
            privacy and security seriously.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-neutral-200">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'privacy'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'terms'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-600 hover:text-neutral-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            Terms of Service
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === 'privacy' ? <PrivacySummary /> : <TermsSummary />}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-neutral-200">
          <Button variant="outline" onClick={onClose} className="sm:flex-1">
            Cancel
          </Button>
          <Button variant="primary" onClick={onAccept} className="sm:flex-1">
            I Accept
          </Button>
        </div>

        {/* Full Pages Link */}
        <p className="text-xs text-center text-neutral-500">
          View full{' '}
          <Link href="/privacy" target="_blank" className="text-primary-600 hover:underline">
            Privacy Policy
          </Link>{' '}
          and{' '}
          <Link href="/terms" target="_blank" className="text-primary-600 hover:underline">
            Terms of Service
          </Link>
        </p>
      </div>
    </Modal>
  );
}

function PrivacySummary() {
  return (
    <div className="prose prose-sm max-w-none text-neutral-700 space-y-4">
      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">What Information We Collect</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Personal Info:</strong> Email, name, and authentication data
          </li>
          <li>
            <strong>Financial Documents:</strong> Tax forms, receipts, invoices, statements you
            upload
          </li>
          <li>
            <strong>Extracted Data:</strong> Information we extract from your documents
            (transactions, amounts, dates)
          </li>
          <li>
            <strong>Usage Data:</strong> How you use the platform to improve our service
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">How We Use Your Data</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Process and analyze your financial documents</li>
          <li>Provide tax calculation assistance and guidance</li>
          <li>Improve our platform and features</li>
          <li>Communicate important service updates</li>
          <li>Detect and prevent fraud and security threats</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Data Security</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>Encryption:</strong> All data encrypted in transit (TLS/SSL) and at rest
            (AES-256)
          </li>
          <li>
            <strong>Retention:</strong> You control how long documents are stored (permanent or
            auto-delete after extraction)
          </li>
          <li>
            <strong>Access Controls:</strong> Strict role-based access with minimal employee access
          </li>
          <li>
            <strong>No Selling:</strong> We NEVER sell your personal or financial information
          </li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Your Rights</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Access your data anytime through your account</li>
          <li>Correct or update your information</li>
          <li>Delete documents or request account deletion</li>
          <li>Export your data in common formats</li>
        </ul>
      </section>

      <div className="bg-neutral-50 rounded-lg p-4 mt-6">
        <p className="text-sm text-neutral-700">
          <strong>Contact:</strong> {config.emails.privacy}
        </p>
      </div>
    </div>
  );
}

function TermsSummary() {
  return (
    <div className="prose prose-sm max-w-none text-neutral-700 space-y-4">
      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">What You're Agreeing To</h3>
        <p>
          By using My Finance Agent HQ, you agree to these terms and acknowledge that you understand
          our service and your responsibilities.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Our Service Provides</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Document upload and storage with configurable retention policies</li>
          <li>Automated extraction of financial information</li>
          <li>Tax calculation assistance and guidance for Canadian taxes</li>
          <li>Financial record organization and categorization</li>
          <li>AI-powered tax assistant</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Your Responsibilities</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Maintain the security and confidentiality of your account</li>
          <li>Provide accurate information</li>
          <li>Use the service legally and ethically</li>
          <li>Review extracted data and calculations for accuracy</li>
          <li>Not upload malicious files or attempt unauthorized access</li>
        </ul>
      </section>

      <section className="bg-warning-light border border-warning rounded-lg p-4">
        <h3 className="text-lg font-semibold text-neutral-900 mb-2 flex items-center gap-2">
          <span className="text-warning text-xl">⚠️</span>
          Important: Not Professional Advice
        </h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>
            <strong>We are NOT tax professionals, accountants, or financial advisors</strong>
          </li>
          <li>Information provided is for informational purposes only</li>
          <li>
            You should consult with qualified professionals before making tax or financial decisions
          </li>
          <li>We don't guarantee accuracy of calculations or tax information</li>
          <li>Tax laws change frequently and vary by jurisdiction</li>
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Limitation of Liability</h3>
        <p className="text-sm">
          We provide the service "as is" without warranties. We're not liable for tax penalties,
          data loss, or other damages resulting from use of the service. You're responsible for
          reviewing all information before using it for tax filing or financial decisions.
        </p>
      </section>

      <section>
        <h3 className="text-lg font-semibold text-neutral-900 mb-2">Account Termination</h3>
        <ul className="list-disc pl-5 space-y-1 text-sm">
          <li>You can close your account anytime</li>
          <li>We may suspend accounts that violate these terms</li>
          <li>Some data may be retained for legal compliance (typically 7 years)</li>
        </ul>
      </section>

      <div className="bg-neutral-50 rounded-lg p-4 mt-6">
        <p className="text-sm text-neutral-700">
          <strong>Contact:</strong> {config.emails.legal}
        </p>
      </div>
    </div>
  );
}
