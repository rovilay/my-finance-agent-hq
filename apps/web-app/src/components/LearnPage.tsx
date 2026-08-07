'use client';

import { GUIDE_ROUTE } from '@/lib/constants';
import { TaxAssistantCTA } from './TaxAssistantCTA';
import {
  FEDERAL_BRACKETS_2024,
  FILING_STEPS,
  KEY_DATES,
  getCreditsForProvince,
  getProvincialBrackets,
  type Bracket,
} from '@/lib/learn-data';
import {
  ArrowRight,
  BookOpen,
  CalendarClock,
  ChevronRight,
  ExternalLink,
  TrendingUp,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { Container } from '@/components/ui';
import { cnsMerge } from '@/lib/utils';

function SectionHeader({
  badge,
  title,
  subtitle,
}: {
  badge: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="space-y-2">
      <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-xs font-semibold rounded-full uppercase tracking-wide">
        {badge}
      </span>
      <h2 className="text-2xl font-display font-bold text-neutral-900">{title}</h2>
      <p className="text-neutral-600">{subtitle}</p>
    </div>
  );
}

function BracketTable({
  brackets,
  jurisdiction,
  accentClass,
}: {
  brackets: Bracket[];
  jurisdiction: string;
  accentClass: string;
}) {
  return (
    <div className="flex-1 min-w-0 space-y-2">
      <p className={cnsMerge(`text-xs font-semibold uppercase tracking-wide`, accentClass)}>
        {jurisdiction}
      </p>
      <div className="space-y-2">
        {brackets.map(b => (
          <div key={b.range} className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-2 py-1 rounded-md shrink-0 w-14 text-center ${b.color}`}
            >
              {b.rate}
            </span>
            <span className="text-xs text-neutral-600">{b.range}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LearnPage() {
  return (
    <>
      <div className="min-h-screen bg-neutral-50">
        <Container className="space-y-8">
          {/* Hero */}
          <section className="space-y-4">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full">
              Tax Education
            </span>
            <h1 className="text-3xl font-display font-bold text-neutral-900">
              Canadian taxes, explained simply
            </h1>
            <p className="text-lg text-neutral-600">
              A visual guide for newcomers to Canada — how the tax system works, what the deadlines
              are, and what credits you might be missing.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href={GUIDE_ROUTE}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-700 hover:text-primary-800"
              >
                <BookOpen className="w-4 h-4" />
                Tax slip guide
                <ChevronRight className="w-4 h-4" />
              </Link>
              <a
                href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/frequently-asked-questions-individuals/canadian-income-tax-rates-individuals-current-previous-years.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-800"
              >
                CRA official site
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </section>

          {/* Section 1: How tax brackets work */}
          <section className="space-y-4">
            <SectionHeader
              badge="How it works"
              title="Canada uses progressive tax brackets"
              subtitle="You don't pay a flat rate on all your income. Each slice of your income is taxed at a different rate — and only that slice."
            />

            {/* Progressive tax explainer */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <p className="text-sm text-neutral-600">
                <strong className="text-neutral-900">Example:</strong> If you earn $70,000, you
                don't pay 20.5% on the whole amount. You pay 15% on the first $57,375 and 20.5% only
                on the remaining $12,625.
              </p>
              <div className="flex flex-col sm:flex-row gap-1 items-stretch">
                {[
                  { label: '$57,375', sublabel: '@ 15%', width: 'flex-[57]', bg: 'bg-blue-200' },
                  { label: '$12,625', sublabel: '@ 20.5%', width: 'flex-[13]', bg: 'bg-blue-400' },
                ].map(s => (
                  <div
                    key={s.label}
                    className={`${s.width} ${s.bg} rounded-lg px-3 py-4 flex flex-col items-center justify-center`}
                  >
                    <span className="text-xs font-bold text-blue-900">{s.label}</span>
                    <span className="text-xs text-blue-800">{s.sublabel}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-neutral-500">
                You also pay provincial tax on top of the federal rate — see the brackets below.
              </p>
            </div>

            {/* Bracket tables side by side */}
            <div className="bg-white border border-neutral-200 rounded-xl p-6 space-y-4">
              <p className="text-sm font-semibold text-neutral-700">2024 Tax Brackets</p>
              <div className="flex flex-col sm:flex-row gap-8">
                <BracketTable
                  brackets={FEDERAL_BRACKETS_2024}
                  jurisdiction="Federal"
                  accentClass="text-blue-700"
                />
                <div className="hidden sm:block w-px bg-neutral-100" />
                <BracketTable
                  brackets={getProvincialBrackets('Ontario')}
                  jurisdiction="Ontario (Provincial)"
                  accentClass="text-violet-700"
                />
              </div>
              <p className="text-xs text-neutral-400 pt-4 border-t border-neutral-100">
                Brackets adjust annually. Ontario brackets shown; other provinces differ.
              </p>
            </div>
          </section>

          {/* Section 2: Filing journey */}
          <section className="space-y-4">
            <SectionHeader
              badge="Filing journey"
              title="How to file your tax return"
              subtitle="Filing for the first time can feel overwhelming. Here's the process broken into four steps."
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {FILING_STEPS.map(s => (
                <div
                  key={s.step}
                  className="bg-white border border-neutral-200 rounded-xl p-5 flex gap-4"
                >
                  <div
                    className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${s.color}`}
                  >
                    {s.icon}
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                      Step {s.step}
                    </p>
                    <p className="text-sm font-semibold text-neutral-900">{s.title}</p>
                    <p className="text-xs text-neutral-600 leading-relaxed">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Key dates */}
          <section className="space-y-4">
            <SectionHeader
              badge="Deadlines"
              title="Key dates for the 2024 tax year"
              subtitle="Missing a deadline can cost you money. Here are the dates that matter."
            />
            <div className="bg-white border border-neutral-200 rounded-xl divide-y divide-neutral-100">
              {KEY_DATES.map(d => (
                <div key={d.date} className="flex items-start gap-4 p-4">
                  <div className="flex items-center gap-2 w-36 shrink-0">
                    <CalendarClock
                      className={`w-4 h-4 shrink-0 ${d.highlight ? 'text-primary-600' : 'text-neutral-400'}`}
                    />
                    <span
                      className={`text-xs font-semibold ${d.highlight ? 'text-primary-700' : 'text-neutral-500'}`}
                    >
                      {d.date}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p
                      className={`text-sm font-semibold ${d.highlight ? 'text-neutral-900' : 'text-neutral-700'}`}
                    >
                      {d.label}
                    </p>
                    <p className="text-xs text-neutral-500">{d.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Credits & deductions */}
          <section className="space-y-4">
            <SectionHeader
              badge="Credits & deductions"
              title="Common credits newcomers miss"
              subtitle="Credits reduce the tax you owe — some even result in a refund. These are the ones most relevant for newcomers."
            />
            <div className="space-y-3">
              {getCreditsForProvince('Ontario').map(c => (
                <div
                  key={c.name}
                  className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-start gap-3"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-sm font-semibold text-neutral-900">{c.name}</p>
                      <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                        {c.amount}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">{c.description}</p>
                    <p className="text-xs text-neutral-400">
                      <Users className="w-3 h-3 inline mr-1" />
                      {c.who}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CTA footer */}
          <section className="bg-primary-600 rounded-2xl p-8 text-center text-white space-y-4">
            <TrendingUp className="w-8 h-8 mx-auto opacity-80" />
            <h2 className="text-xl font-display font-bold">Ready to see your tax picture?</h2>
            <p className="text-primary-100 text-sm max-w-md mx-auto">
              Upload your slips and we'll extract the values, calculate your estimated liability,
              and flag credits you might be eligible for.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/entities"
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold text-sm rounded-lg hover:bg-primary-50 transition-colors"
              >
                Get started
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={GUIDE_ROUTE}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 border border-white/40 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-colors"
              >
                <BookOpen className="w-4 h-4" />
                Tax slip guide
              </Link>
            </div>
          </section>
        </Container>
      </div>
      <TaxAssistantCTA />
    </>
  );
}
