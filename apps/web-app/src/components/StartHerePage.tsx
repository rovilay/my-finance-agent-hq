'use client';

import { Button } from '@/components/ui';
import { ENTITIES_ROUTE, UPLOAD_ROUTE } from '@/lib/constants';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  FileText,
  Briefcase,
  GraduationCap,
  TrendingUp,
  Wallet,
  Building2,
  AlertCircle,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

// ─── Types ───────────────────────────────────────────────────────────────────

type FilingPath = 'newcomer' | 'resident';
type Step = 'path-select' | 'arrival' | 'income-sources' | 'results';

interface IncomeSource {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface RecommendedDoc {
  code: string;
  name: string;
  from: string;
  why: string;
  priority: 'required' | 'likely' | 'possible';
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const INCOME_SOURCES: IncomeSource[] = [
  {
    id: 'employment',
    label: 'Employment (salary or wages)',
    description: 'You worked for an employer who deducted tax from your pay.',
    icon: <Briefcase className="w-5 h-5" />,
  },
  {
    id: 'contract',
    label: 'Freelance or contract work',
    description: 'You were self-employed, a consultant, or took on gig work.',
    icon: <Building2 className="w-5 h-5" />,
  },
  {
    id: 'savings',
    label: 'Savings or investment income',
    description: 'You earned interest on bank accounts, or received dividends from stocks.',
    icon: <Wallet className="w-5 h-5" />,
  },
  {
    id: 'funds',
    label: 'Mutual funds or ETFs',
    description: 'You received distributions from mutual funds, ETFs, or a trust.',
    icon: <TrendingUp className="w-5 h-5" />,
  },
  {
    id: 'studies',
    label: 'Full- or part-time studies',
    description: 'You were enrolled at a college or university and paid tuition.',
    icon: <GraduationCap className="w-5 h-5" />,
  },
  {
    id: 'ei',
    label: 'Employment Insurance (EI)',
    description: 'You received EI benefits after a job loss or parental leave.',
    icon: <FileText className="w-5 h-5" />,
  },
];

function buildRecommendations(
  sources: Set<string>,
  path: FilingPath,
  arrivedThisYear: boolean
): RecommendedDoc[] {
  const docs: RecommendedDoc[] = [];

  if (sources.has('employment')) {
    docs.push({
      code: 'T4',
      name: 'Statement of Remuneration Paid',
      from: 'Your employer',
      why: 'Reports your employment income and tax already deducted.',
      priority: 'required',
    });
  }

  if (sources.has('contract')) {
    docs.push({
      code: 'T4A',
      name: 'Statement of Pension, Retirement, Annuity, and Other Income',
      from: 'Your clients or payers',
      why: 'Reports freelance, contract, or self-employment payments above $500.',
      priority: 'required',
    });
  }

  if (sources.has('savings')) {
    docs.push({
      code: 'T5',
      name: 'Statement of Investment Income',
      from: 'Your bank or broker',
      why: 'Reports interest income and dividends from your accounts.',
      priority: 'likely',
    });
  }

  if (sources.has('funds')) {
    docs.push({
      code: 'T3',
      name: 'Statement of Trust Income Allocations',
      from: 'Your mutual fund or ETF provider',
      why: 'Reports distributions from mutual funds, ETFs, and unit trusts.',
      priority: 'likely',
    });
  }

  if (sources.has('studies')) {
    docs.push({
      code: 'T2202',
      name: 'Tuition and Enrolment Certificate',
      from: 'Your college or university',
      why: 'Required to claim the tuition tax credit on your return.',
      priority: 'required',
    });
  }

  if (sources.has('ei')) {
    docs.push({
      code: 'T4E',
      name: 'Statement of Employment Insurance Benefits',
      from: 'Service Canada',
      why: 'EI benefits are taxable income and must be reported.',
      priority: 'required',
    });
  }

  if (path === 'newcomer' && arrivedThisYear) {
    docs.push({
      code: 'NR4',
      name: 'Statement of Amounts Paid to Non-Residents',
      from: 'Foreign payers or financial institutions',
      why: 'If you received income before becoming a Canadian tax resident this year, an NR4 may apply.',
      priority: 'possible',
    });
  }

  return docs;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ step }: { step: Step }) {
  const steps: Step[] = ['path-select', 'arrival', 'income-sources', 'results'];
  const current = steps.indexOf(step);
  const total = steps.length - 1; // results is the endpoint, not a "question"
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full bg-neutral-200 rounded-full h-1.5 mb-8">
      <div
        className="bg-primary-600 h-1.5 rounded-full transition-all duration-500"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function PriorityBadge({ priority }: { priority: RecommendedDoc['priority'] }) {
  const styles = {
    required: 'bg-red-100 text-red-700',
    likely: 'bg-amber-100 text-amber-700',
    possible: 'bg-neutral-100 text-neutral-600',
  };
  const labels = { required: 'Required', likely: 'Likely needed', possible: 'May apply' };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${styles[priority]}`}>
      {labels[priority]}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function StartHerePage() {
  const [step, setStep] = useState<Step>('path-select');
  const [path, setPath] = useState<FilingPath | null>(null);
  const [arrivedThisYear, setArrivedThisYear] = useState<boolean | null>(null);
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set());

  const toggleSource = (id: string) => {
    setSelectedSources(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePathSelect = (chosen: FilingPath) => {
    setPath(chosen);
    if (chosen === 'newcomer') {
      setStep('arrival');
    } else {
      setArrivedThisYear(false);
      setStep('income-sources');
    }
  };

  const handleArrivalSelect = (thisYear: boolean) => {
    setArrivedThisYear(thisYear);
    setStep('income-sources');
  };

  const handleIncomeNext = () => {
    setStep('results');
  };

  const handleBack = () => {
    if (step === 'income-sources') {
      setStep(path === 'newcomer' ? 'arrival' : 'path-select');
    } else if (step === 'arrival') {
      setStep('path-select');
    } else if (step === 'results') {
      setStep('income-sources');
    }
  };

  const recommendations =
    step === 'results' && path
      ? buildRecommendations(selectedSources, path, arrivedThisYear ?? false)
      : [];

  return (
    <div className="min-h-screen bg-neutral-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 bg-primary-100 text-primary-700 text-sm font-medium rounded-full mb-3">
            Start Here
          </span>
          <h1 className="text-3xl font-display font-bold text-neutral-900">
            Let's find your tax documents
          </h1>
          <p className="text-neutral-600 mt-2">
            Answer a few quick questions and we'll tell you exactly what to gather.
          </p>
        </div>

        <ProgressBar step={step} />

        {/* Step: Path select */}
        {step === 'path-select' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-6">
              Have you filed a Canadian tax return before?
            </h2>
            <button
              onClick={() => handlePathSelect('newcomer')}
              className="w-full text-left p-6 rounded-xl border-2 border-neutral-200 bg-white hover:border-primary-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">🇨🇦</span>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-700">
                    No — I'm new to filing in Canada
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    I recently moved here or this is my first Canadian tax return.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 ml-auto mt-1 shrink-0" />
              </div>
            </button>

            <button
              onClick={() => handlePathSelect('resident')}
              className="w-full text-left p-6 rounded-xl border-2 border-neutral-200 bg-white hover:border-primary-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-start gap-4">
                <span className="text-3xl">📋</span>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-700">
                    Yes — I've filed before
                  </p>
                  <p className="text-sm text-neutral-500 mt-1">
                    I just want help organizing my slips and seeing my tax picture.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 ml-auto mt-1 shrink-0" />
              </div>
            </button>
          </div>
        )}

        {/* Step: Arrival (newcomers only) */}
        {step === 'arrival' && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Did you arrive in Canada this year?
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              This affects which documents may apply to income you earned before arriving.
            </p>

            <button
              onClick={() => handleArrivalSelect(true)}
              className="w-full text-left p-6 rounded-xl border-2 border-neutral-200 bg-white hover:border-primary-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">✈️</span>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-700">
                    Yes, I arrived in {new Date().getFullYear()}
                  </p>
                  <p className="text-sm text-neutral-500">
                    This is my first tax year as a Canadian resident.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 ml-auto shrink-0" />
              </div>
            </button>

            <button
              onClick={() => handleArrivalSelect(false)}
              className="w-full text-left p-6 rounded-xl border-2 border-neutral-200 bg-white hover:border-primary-400 hover:shadow-sm transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className="text-2xl">🏠</span>
                <div>
                  <p className="font-semibold text-neutral-900 group-hover:text-primary-700">
                    No, I arrived in a previous year
                  </p>
                  <p className="text-sm text-neutral-500">
                    I was already a resident at the start of this tax year.
                  </p>
                </div>
                <ArrowRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-600 ml-auto shrink-0" />
              </div>
            </button>

            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mt-4"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        )}

        {/* Step: Income sources */}
        {step === 'income-sources' && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              Which of these applied to you last year?
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              Select all that apply. You can always add more documents later.
            </p>

            <div className="space-y-3 mb-8">
              {INCOME_SOURCES.map(source => {
                const selected = selectedSources.has(source.id);
                return (
                  <button
                    key={source.id}
                    onClick={() => toggleSource(source.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                      selected
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-neutral-200 bg-white hover:border-neutral-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`shrink-0 ${selected ? 'text-primary-600' : 'text-neutral-400'}`}
                      >
                        {source.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium ${selected ? 'text-primary-900' : 'text-neutral-900'}`}
                        >
                          {source.label}
                        </p>
                        <p className="text-sm text-neutral-500 truncate">{source.description}</p>
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-all ${
                          selected ? 'bg-primary-600 border-primary-600' : 'border-neutral-300'
                        }`}
                      >
                        {selected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="currentColor"
                            viewBox="0 0 12 12"
                          >
                            <path
                              d="M10 3L5 8.5 2 5.5"
                              stroke="currentColor"
                              strokeWidth="2"
                              fill="none"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleBack}
                className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700"
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>
              <Button onClick={handleIncomeNext} className="gap-2">
                {selectedSources.size === 0 ? 'Skip — nothing applies' : 'See my document list'}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}

        {/* Step: Results */}
        {step === 'results' && (
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">
              {recommendations.length > 0
                ? 'Here are the documents you likely need'
                : "You're in good shape — no slips identified"}
            </h2>
            <p className="text-sm text-neutral-500 mb-6">
              {recommendations.length > 0
                ? 'Collect these from the senders listed, then upload them to Finance Agent.'
                : 'Your income profile is simple. You can still upload documents if you receive any slips.'}
            </p>

            {recommendations.length > 0 ? (
              <div className="space-y-3 mb-8">
                {recommendations.map(doc => (
                  <div key={doc.code} className="p-5 rounded-xl border border-neutral-200 bg-white">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-primary-100 text-primary-700 text-sm font-bold rounded-full">
                          {doc.code}
                        </span>
                        <span className="font-semibold text-neutral-900">{doc.name}</span>
                      </div>
                      <PriorityBadge priority={doc.priority} />
                    </div>
                    <p className="text-xs text-neutral-500 mb-1">Sent by: {doc.from}</p>
                    <p className="text-sm text-neutral-600">{doc.why}</p>
                  </div>
                ))}

                {path === 'newcomer' && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-800">
                      <strong>Tip for newcomers:</strong> Most T4 and T5 slips are mailed by the end
                      of February. If you haven&apos;t received one, contact the sender directly or
                      check your CRA My Account online.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-6 rounded-xl bg-secondary-50 border border-secondary-200 flex gap-3 mb-8">
                <CheckCircle className="w-5 h-5 text-secondary-600 shrink-0 mt-0.5" />
                <p className="text-sm text-secondary-800">
                  Based on your answers, you don't have complex income sources. If you receive any
                  slips in the mail, you can still upload them and we'll help you review them.
                </p>
              </div>
            )}

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={UPLOAD_ROUTE} className="flex-1">
                <Button className="w-full gap-2">
                  Upload my documents <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href={ENTITIES_ROUTE} className="flex-1">
                <Button variant="outline" className="w-full">
                  Go to my dashboard
                </Button>
              </Link>
            </div>

            <button
              onClick={handleBack}
              className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 mt-5"
            >
              <ArrowLeft className="w-4 h-4" /> Change my answers
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
