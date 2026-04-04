import { LogoWithText } from '@/components/Logo';
import { Button } from '@/components/ui';
import { LOGIN_ROUTE, SIGNUP_ROUTE } from '@/lib/constants';
import {
  BookOpen,
  FileText,
  CheckCircle,
  ArrowRight,
  MessageCircle,
  Shield,
  Eye,
  BarChart3,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

function CapabilityCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="card-hover p-6 rounded-xl border border-neutral-200 bg-white">
      <div className="mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 text-sm leading-relaxed">{description}</p>
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
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

function SlipCard({
  code,
  name,
  from,
  description,
}: {
  code: string;
  name: string;
  from: string;
  description: string;
}) {
  return (
    <div className="p-5 rounded-xl border border-neutral-200 bg-white hover:border-primary-300 hover:shadow-sm transition-all">
      <div className="flex items-center gap-3 mb-3">
        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-bold rounded-full">
          {code}
        </span>
        <span className="font-semibold text-neutral-900 text-sm">{name}</span>
      </div>
      <p className="text-xs text-neutral-500 mb-1">Sent by: {from}</p>
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-neutral-50 via-primary-50 to-secondary-50">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 text-primary-700 text-sm font-medium mb-6 animate-fade-in">
              <span>🇨🇦</span>
              Canadian taxes, made simple
            </div>

            <h1 className="text-5xl md:text-6xl font-display font-bold text-neutral-900 mb-6 text-balance animate-slide-up">
              Understand your taxes.
              <span className="text-primary-600"> File with confidence.</span>
            </h1>

            <p
              className="text-xl text-neutral-600 mb-4 max-w-2xl mx-auto animate-slide-up"
              style={{ animationDelay: '0.1s' }}
            >
              Finance Agent helps Ontario residents make sense of the Canadian tax system — learn
              what documents you need, upload your tax slips, and see a clear summary of what you
              owe or get back.
            </p>

            <p
              className="text-sm text-neutral-500 mb-8 max-w-xl mx-auto animate-slide-up"
              style={{ animationDelay: '0.15s' }}
            >
              New to Canada or filing for years — no accounting background required. Ask questions
              in plain English anytime.
            </p>

            <div
              className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
              style={{ animationDelay: '0.2s' }}
            >
              <Link href={SIGNUP_ROUTE}>
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  Get started free <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href={LOGIN_ROUTE}>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign in
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* What you can do */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Everything you need in one place
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From understanding what taxes are to seeing your final number — we guide you through
              every step.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <CapabilityCard
              icon={<BookOpen className="w-8 h-8 text-primary-600" />}
              title="Learn the basics"
              description="Understand how Canadian taxes work, what Ontario residents owe, and key deadlines — explained in plain language."
            />
            <CapabilityCard
              icon={<FileText className="w-8 h-8 text-secondary-600" />}
              title="Upload your slips"
              description="Drag and drop your T3, T4, or T5 tax slips. Our AI reads them and extracts the numbers you need."
            />
            <CapabilityCard
              icon={<Eye className="w-8 h-8 text-accent-600" />}
              title="Review what was found"
              description="Always see and confirm what the AI extracted before it affects your tax summary. You stay in control."
            />
            <CapabilityCard
              icon={<BarChart3 className="w-8 h-8 text-primary-600" />}
              title="See your tax picture"
              description="Get a clear, visual breakdown of your income, deductions, and the amount you owe or get back."
            />
          </div>
        </div>
      </section>

      {/* Supported documents */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              Common tax slips, handled
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Not sure which documents you need? Here are the most common ones for new residents and
              what they mean.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <SlipCard
              code="T3"
              name="Trust distributions"
              from="Mutual funds or trusts"
              description="Covers income from mutual funds, ETFs, or estate trusts. You may receive this if you hold certain investments."
            />
            <SlipCard
              code="T4"
              name="Employment income"
              from="Your employer"
              description="Shows how much you earned from a job and how much tax was withheld throughout the year. Most employed newcomers will have one."
            />
            <SlipCard
              code="T4A"
              name="Other income"
              from="Clients, schools, or the government"
              description="Covers freelance and contract payments, scholarships, bursaries, and certain government benefits. Common for newcomers doing contract work."
            />
            <SlipCard
              code="T5"
              name="Investment income"
              from="Your bank or broker"
              description="Reports interest earned on savings accounts, dividends from stocks, or other investment income. Usually arrives by late February."
            />
            <SlipCard
              code="T2202"
              name="Tuition & enrolment"
              from="Your school or university"
              description="Certifies tuition paid and months enrolled. Required to claim the tuition tax credit — especially relevant if you arrived as a student."
            />
          </div>

          <p className="text-center text-sm text-neutral-500 mt-8">
            Not sure which slips apply to you?{' '}
            <Link href={SIGNUP_ROUTE} className="text-primary-600 hover:underline font-medium">
              Sign up and ask our Tax Assistant
            </Link>
            .
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 bg-white" id="how-it-works">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
              How it works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              From your first question to a complete tax summary — four simple steps.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            <Step
              number="1"
              title="Tell us about yourself"
              description="Select your province and income sources. We'll tell you which tax slips you likely need."
            />
            <Step
              number="2"
              title="Upload your slips"
              description="Drag and drop your T4, T3, or T5. Our AI reads and extracts the key numbers."
            />
            <Step
              number="3"
              title="Review what AI found"
              description="Always confirm extracted values before they're saved. Correct anything that looks off."
            />
            <Step
              number="4"
              title="See your tax summary"
              description="Get a clear visual breakdown of what you owe or get back, in plain English."
            />
          </div>
        </div>
      </section>

      {/* Ask the assistant */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl bg-linear-to-br from-primary-600 to-primary-700 p-10 text-center text-white">
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-3xl font-display font-bold mb-4">Have questions? Just ask.</h2>
            <p className="text-primary-100 text-lg mb-6 max-w-xl mx-auto">
              Our Tax Assistant answers questions in plain English — no forms, no jargon. Ask
              anything from "what is a T4?" to "do I need to file if I arrived in October?".
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {[
                'What slips do I need as a new resident?',
                'What is the filing deadline?',
                'Do I owe tax if I arrived mid-year?',
                'What is the difference between T4 and T5?',
              ].map(q => (
                <span
                  key={q}
                  className="px-3 py-1.5 bg-white/15 rounded-full text-sm text-white/90 border border-white/20"
                >
                  {q}
                </span>
              ))}
            </div>
            <Link href={SIGNUP_ROUTE}>
              <Button size="lg" variant="secondary" className="gap-2">
                <Sparkles className="w-5 h-5" />
                Try the Tax Assistant
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust signals — security as context, not headline */}
      <section className="py-16 px-4 bg-white border-t border-neutral-100">
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-sm font-semibold text-neutral-500 uppercase tracking-wider mb-8">
            Your data is handled securely
          </p>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <Shield className="w-6 h-6 text-primary-500" />
              <p className="text-sm font-medium text-neutral-700">Encrypted at rest</p>
              <p className="text-xs text-neutral-500">
                Each document is encrypted with its own key
              </p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-6 h-6 text-secondary-500" />
              <p className="text-sm font-medium text-neutral-700">You review before saving</p>
              <p className="text-xs text-neutral-500">AI extractions are always confirmed by you</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <FileText className="w-6 h-6 text-accent-500" />
              <p className="text-sm font-medium text-neutral-700">Auto-purge available</p>
              <p className="text-xs text-neutral-500">
                Delete your file after extraction if you prefer
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-neutral-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-4">
            Ready to understand your taxes?
          </h2>
          <p className="text-lg text-neutral-600 mb-8">
            Join other newcomers using Finance Agent to take the mystery out of filing in Canada.
          </p>
          <Link href={SIGNUP_ROUTE}>
            <Button size="lg" className="gap-2">
              Get started free <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <p className="text-sm text-neutral-500 mt-4">
            Already have an account?{' '}
            <Link href={LOGIN_ROUTE} className="text-primary-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <LogoWithText />
            <p className="text-sm text-neutral-500">© 2026 Finance Agent. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
