'use client';

import { ENTITIES_ROUTE, SIGNUP_ROUTE } from '@/lib/constants';
import { TaxAssistantCTA } from './TaxAssistantCTA';
import {
  Briefcase,
  Building2,
  GraduationCap,
  TrendingUp,
  Wallet,
  FileText,
  ArrowRight,
  ChevronDown,
  CalendarClock,
  Info,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface SlipEntry {
  code: string;
  fullName: string;
  sentBy: string;
  arrives: string;
  what: string;
  whoGetsIt: string;
  fieldsToNotice: string[];
  craLinks?: Array<{ label: string; href: string }>;
}

interface IncomeGroup {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
  slips: SlipEntry[];
}

// ─── Content ──────────────────────────────────────────────────────────────────

const INCOME_GROUPS: IncomeGroup[] = [
  {
    id: 'employment',
    label: 'Employment income',
    icon: <Briefcase className="w-5 h-5" />,
    description: 'You worked for an employer who paid you a salary or hourly wages.',
    slips: [
      {
        code: 'T4',
        fullName: 'Statement of Remuneration Paid',
        sentBy: 'Your employer',
        arrives: 'By the last day of February each year',
        what: 'Your T4 is a summary of everything your employer paid you and withheld during the tax year. It shows your total employment income, the income tax deducted, and contributions to CPP and EI.',
        whoGetsIt:
          'Anyone who was employed by a Canadian company during the year. If you worked multiple jobs you will receive a T4 from each employer.',
        fieldsToNotice: [
          'Box 14 — Employment income (your total gross pay)',
          'Box 22 — Income tax deducted (tax already paid on your behalf)',
          'Box 16 — CPP contributions',
          'Box 18 — EI premiums',
        ],
        craLinks: [
          {
            label: 'Get your T4 online via CRA My Account',
            href: 'https://www.canada.ca/en/revenue-agency/services/e-services/digital-services-individuals/account-individuals.html',
          },
        ],
      },
    ],
  },
  {
    id: 'contract',
    label: 'Freelance & contract work',
    icon: <Building2 className="w-5 h-5" />,
    description: 'You were self-employed, did consulting, gig work, or received other payments.',
    slips: [
      {
        code: 'T4A',
        fullName: 'Statement of Pension, Retirement, Annuity, and Other Income',
        sentBy: 'Any payer who paid you $500 or more for services',
        arrives: 'By the last day of February each year',
        what: 'A T4A covers a wide range of payments that do not go through regular payroll. This includes freelance and contract fees, scholarships, bursaries, and certain government benefits. Unlike a T4, no tax is typically withheld on these payments — you are responsible for reporting and paying tax on this income yourself.',
        whoGetsIt:
          'Freelancers, contractors, students who received scholarships or bursaries, and anyone who received a taxable benefit or payment not shown on a T4.',
        fieldsToNotice: [
          'Box 20 — Self-employment commissions',
          'Box 48 — Fees for services (contract work)',
          'Box 105 — Scholarships, bursaries, and fellowships',
        ],
      },
    ],
  },
  {
    id: 'savings',
    label: 'Savings & bank interest',
    icon: <Wallet className="w-5 h-5" />,
    description: 'You earned interest from a savings account, GIC, or received dividends.',
    slips: [
      {
        code: 'T5',
        fullName: 'Statement of Investment Income',
        sentBy: 'Your bank, credit union, or broker',
        arrives: 'By the last day of February each year',
        what: 'A T5 reports investment income earned outside of registered accounts (like RRSP or TFSA). It includes interest from savings accounts and GICs, dividends from Canadian and foreign shares, and certain royalty payments. If your total interest income from one institution is under $50 for the year, they may not send you a T5 — but you still have to report it.',
        whoGetsIt:
          'Anyone who holds a non-registered savings account, GIC, or non-registered investment account that earned income during the year.',
        fieldsToNotice: [
          'Box 13 — Interest from Canadian sources',
          'Box 24 — Eligible dividends from Canadian corporations',
          'Box 25 — Taxable amount of eligible dividends',
        ],
      },
    ],
  },
  {
    id: 'funds',
    label: 'Mutual funds & ETFs',
    icon: <TrendingUp className="w-5 h-5" />,
    description: 'You hold mutual funds, ETFs, or received distributions from a trust.',
    slips: [
      {
        code: 'T3',
        fullName: 'Statement of Trust Income Allocations and Designations',
        sentBy: 'Your mutual fund company, ETF provider, or trust administrator',
        arrives: 'By the last day of March each year (later than most other slips)',
        what: 'A T3 reports your share of income distributed by a trust — most commonly from mutual funds and ETFs held outside registered accounts. It can include interest, dividends, foreign income, and capital gains. T3s often arrive after the February deadline for other slips, so check before filing if you hold funds.',
        whoGetsIt:
          'Anyone who holds mutual funds, ETFs, or units in a trust outside of a registered account (RRSP, TFSA, RESP).',
        fieldsToNotice: [
          'Box 21 — Capital gains',
          'Box 26 — Other income',
          'Box 49 — Eligible dividends',
        ],
      },
    ],
  },
  {
    id: 'studies',
    label: 'Post-secondary studies',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'You were enrolled at a college or university and paid tuition.',
    slips: [
      {
        code: 'T2202',
        fullName: 'Tuition and Enrolment Certificate',
        sentBy: 'Your college or university',
        arrives: 'By the last day of February; usually available in your student portal',
        what: 'A T2202 certifies the tuition you paid and the number of months you were enrolled. You use it to claim the tuition tax credit, which reduces the tax you owe. If your credits exceed your tax owing, the unused amount can be carried forward to future years or transferred to a parent or spouse.',
        whoGetsIt:
          'Students enrolled in eligible post-secondary programs at a Canadian institution, and international students who became Canadian tax residents during their studies.',
        fieldsToNotice: [
          'Box A — Eligible tuition fees paid in the calendar year',
          'Box B — Part-time months enrolled',
          'Box C — Full-time months enrolled',
        ],
        craLinks: [
          {
            label: 'CRA: Tuition tax credit — who can claim it',
            href: 'https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/about-your-tax-return/tax-return/completing-a-tax-return/deductions-credits-expenses/line-32300-your-tuition-education-textbook-amounts.html',
          },
        ],
      },
    ],
  },
  {
    id: 'ei',
    label: 'Employment Insurance (EI)',
    icon: <FileText className="w-5 h-5" />,
    description: 'You received EI benefits after a layoff, job loss, or parental leave.',
    slips: [
      {
        code: 'T4E',
        fullName: 'Statement of Employment Insurance and Other Benefits',
        sentBy: 'Service Canada',
        arrives: 'Mailed by Service Canada; also available in your My Service Canada Account',
        what: 'A T4E shows the EI benefits you received during the year. EI payments are taxable income in Canada — Service Canada withholds a portion of tax but it may not cover your full liability depending on your total income for the year.',
        whoGetsIt:
          'Anyone who collected regular EI, maternity and parental benefits, compassionate care benefits, or sickness benefits during the tax year.',
        fieldsToNotice: [
          'Box 14 — Total benefits paid',
          'Box 20 — Tax deducted at source',
          'Box 26 — Repayment rate (if you earned over the threshold)',
        ],
        craLinks: [
          {
            label: 'Get your T4E via My Service Canada Account',
            href: 'https://www.canada.ca/en/employment-social-development/services/my-account.html',
          },
        ],
      },
    ],
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function SlipDetail({ slip }: { slip: SlipEntry }) {
  return (
    <div className="mt-4 space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <span className="px-3 py-1.5 bg-primary-100 text-primary-700 font-bold text-sm rounded-full">
          {slip.code}
        </span>
        <span className="text-neutral-500 text-sm">{slip.fullName}</span>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
          <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">
            Sent by
          </p>
          <p className="text-sm text-neutral-800">{slip.sentBy}</p>
        </div>
        <div className="p-4 rounded-lg bg-neutral-50 border border-neutral-100">
          <div className="flex items-center gap-1.5 mb-1">
            <CalendarClock className="w-3.5 h-3.5 text-neutral-400" />
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              When it arrives
            </p>
          </div>
          <p className="text-sm text-neutral-800">{slip.arrives}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          What it is
        </p>
        <p className="text-sm text-neutral-700 leading-relaxed">{slip.what}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Who gets it
        </p>
        <p className="text-sm text-neutral-700 leading-relaxed">{slip.whoGetsIt}</p>
      </div>

      <div>
        <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
          Key boxes to notice when you upload
        </p>
        <ul className="space-y-1.5">
          {slip.fieldsToNotice.map(field => (
            <li key={field} className="flex items-start gap-2 text-sm text-neutral-700">
              <span className="mt-1 w-1.5 h-1.5 rounded-full bg-primary-400 shrink-0" />
              {field}
            </li>
          ))}
        </ul>
      </div>

      {slip.craLinks && slip.craLinks.length > 0 && (
        <div className="pt-1 border-t border-neutral-100 flex flex-wrap gap-3">
          {slip.craLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-primary-600 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group }: { group: IncomeGroup }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left p-6 flex items-center justify-between gap-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center shrink-0">
            {group.icon}
          </div>
          <div>
            <p className="font-semibold text-neutral-900">{group.label}</p>
            <p className="text-sm text-neutral-500 mt-0.5">{group.description}</p>
          </div>
        </div>
        <div
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-neutral-100">
          {group.slips.map(slip => (
            <SlipDetail key={slip.code} slip={slip} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocumentGuidePage({ isAuthenticated }: { isAuthenticated?: boolean }) {
  return (
    <>
      <div className="min-h-screen bg-neutral-50 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-3">
              Document Guide
            </span>
            <h1 className="text-3xl font-display font-bold text-neutral-900 mb-3">
              Tax slips explained
            </h1>
            <p className="text-lg text-neutral-600">
              Find the income type that applies to you and see exactly which slip you need, who
              sends it, and what to look for when you upload it.
            </p>
          </div>

          {/* Deadline callout */}
          <div className="mb-8 p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong>Filing deadline:</strong> April 30 for most individuals. Self-employed
              individuals have until June 15 to file, but any tax owing is still due April 30. T3
              slips from mutual funds can arrive as late as March 31 — wait for all your slips
              before filing.{' '}
              <a
                href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/important-dates-individuals.html"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-0.5 text-amber-700 underline hover:text-amber-900"
              >
                <ExternalLink className="w-3 h-3" /> Source: CRA
              </a>
            </div>
          </div>

          {/* Income groups */}
          <div className="space-y-4 mb-10">
            {INCOME_GROUPS.map(group => (
              <GroupCard key={group.id} group={group} />
            ))}
          </div>

          {/* CTA */}
          <div className="rounded-xl bg-primary-600 p-8 text-white text-center">
            <h2 className="text-xl font-display font-bold mb-2">Ready to upload your slips?</h2>
            <p className="text-primary-100 text-sm mb-5">
              Once you have your documents, upload them and our AI will read the key numbers for you
              to review.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href={ENTITIES_ROUTE}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors text-sm"
              >
                Upload documents <ArrowRight className="w-4 h-4" />
              </Link>
              {!isAuthenticated && (
                <Link
                  href={SIGNUP_ROUTE}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-primary-500 text-white font-semibold rounded-lg hover:bg-primary-400 transition-colors text-sm border border-primary-400"
                >
                  Create a free account
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      <TaxAssistantCTA />
    </>
  );
}
