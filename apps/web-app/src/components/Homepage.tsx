import { LogoWithText } from '@/components/Logo';
import { Button } from '@/components/ui';
import { DOCUMENT_ROUTE, UPLOAD_ROUTE } from '@/lib/constants';
import { Shield, Lock, FileText, Zap, CheckCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover p-6">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm">{description}</p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 rounded-full bg-primary-600 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
        {number}
      </div>
      <h3 className="font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-sm text-neutral-600">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              Bank-Grade Security
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6 text-balance animate-slide-up">
              Secure Tax Document Processing with AI
            </h1>

            <p
              className="text-xl text-neutral-600 mb-8 max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Upload your tax documents with confidence. Our AI extracts data intelligently while
              envelope encryption keeps everything secure.
            </p>

            <div
              className="flex items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link href={UPLOAD_ROUTE}>
                <Button size="lg" className="gap-2">
                  Get Started <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href={DOCUMENT_ROUTE}>
                <Button variant="outline" size="lg">
                  View Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Why Choose Finance Agent HQ?
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Enterprise-grade security meets intelligent automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Lock className="w-8 h-8 text-primary-600" />}
              title="Envelope Encryption"
              description="Each document gets its own encryption key, wrapped by GCP KMS. Your data stays encrypted at rest and in transit."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-secondary-600" />}
              title="AI-Powered Extraction"
              description="Gemini AI automatically extracts tax data from your documents with high accuracy and speed."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-accent-600" />}
              title="Human-in-the-Loop"
              description="Review and verify AI-extracted data before it's finalized. You're always in control."
            />
            <FeatureCard
              icon={<FileText className="w-8 h-8 text-primary-600" />}
              title="Smart Retention"
              description="Choose between permanent storage or automatic purge after verification based on your needs."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-secondary-600" />}
              title="Compliance Ready"
              description="Built with data protection and privacy regulations in mind. Audit trails included."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-accent-600" />}
              title="Zero Trust Architecture"
              description="Never trust, always verify. Every request is authenticated and authorized."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From upload to extraction in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Step number="1" title="Upload" description="Securely upload your tax document" />
            <Step
              number="2"
              title="Encrypt"
              description="Document encrypted with envelope encryption"
            />
            <Step number="3" title="Extract" description="AI processes and extracts data" />
            <Step number="4" title="Verify" description="Review and finalize extraction" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-linear-to-r from-primary-600 to-primary-700">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
            Ready to secure your tax documents?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who trust Finance Agent HQ with their sensitive financial data.
          </p>
          <Link href="UPLOAD_ROUTE">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Free Trial <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <LogoWithText />
            <p className="text-sm text-neutral-500">
              © 2026 Finance Agent HQ. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
