'use client';

import { CheckCircle2, Circle, ChevronRight, BookOpen } from 'lucide-react';
import Link from 'next/link';
import {
  useGetMyOnboardingQuery,
  useGetDocumentsByEntityQuery,
  DocumentStatus,
} from '@/lib/graphql';
import { GUIDE_ROUTE } from '@/lib/constants';

// ─── Slip map ─────────────────────────────────────────────────────────────────

const SLIP_MAP: Record<string, { code: string; label: string }> = {
  employment: { code: 'T4', label: 'Employment income (T4)' },
  contract: { code: 'T4A', label: 'Contract / self-employment (T4A)' },
  savings: { code: 'T5', label: 'Investment income (T5)' },
  funds: { code: 'T3', label: 'Mutual fund distributions (T3)' },
  studies: { code: 'T2202', label: 'Tuition certificate (T2202)' },
  ei: { code: 'T4E', label: 'Employment Insurance (T4E)' },
};

const DEFAULT_SOURCES = ['employment', 'savings'];

// ─── Types ────────────────────────────────────────────────────────────────────

interface ChecklistStep {
  id: string;
  label: string;
  description: string;
  href: string;
  done: boolean;
  always?: boolean;
}

interface OnboardingChecklistProps {
  entityId: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingChecklist({ entityId }: OnboardingChecklistProps) {
  const { data: onboardingData } = useGetMyOnboardingQuery();
  const onboarding = onboardingData?.myOnboarding;
  const sources = onboarding?.incomeSources ?? DEFAULT_SOURCES;

  const { data: verifiedDocsData } = useGetDocumentsByEntityQuery({
    variables: {
      entityId,
      pagination: { skip: 0, take: 1 },
      status: DocumentStatus.Verified,
    },
  });

  const hasVerifiedDoc = (verifiedDocsData?.documentsByEntity.total ?? 0) > 0;

  const slipSteps: ChecklistStep[] = sources
    .filter(s => SLIP_MAP[s])
    .map(s => ({
      id: `slip-${s}`,
      label: `Gather your ${SLIP_MAP[s].code}`,
      description: SLIP_MAP[s].label,
      href: GUIDE_ROUTE,
      done: false, // gathering slips is offline — never auto-completed
    }));

  const steps: ChecklistStep[] = [
    ...(onboarding
      ? [
          {
            id: 'start-here',
            label: 'Complete "Start Here"',
            description: 'Personalized document list ready',
            href: '/start',
            done: true,
            always: true,
          },
        ]
      : [
          {
            id: 'start-here',
            label: 'Complete "Start Here"',
            description: 'Answer a few questions for a personalized checklist',
            href: '/start',
            done: false,
            always: true,
          },
        ]),
    ...slipSteps,
    {
      id: 'upload',
      label: 'Upload your documents',
      description: 'Bring your tax slips into Finance Agent',
      href: `/entities/${entityId}/documents`,
      done: hasVerifiedDoc,
    },
    {
      id: 'review',
      label: 'Review extracted values',
      description: 'Confirm the numbers we pulled from your slips',
      href: `/entities/${entityId}/entries`,
      done: hasVerifiedDoc,
    },
    {
      id: 'summary',
      label: 'Check your tax estimate',
      description: 'See what you may owe or get back',
      href: `/entities/${entityId}/tax`,
      done: false,
    },
  ];

  const doneCount = steps.filter(s => s.done).length;
  const totalCount = steps.length;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-neutral-900">Filing checklist</h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            {doneCount} of {totalCount} steps complete
          </p>
        </div>
        {!onboarding && (
          <Link
            href="/start"
            className="text-xs text-primary-600 font-medium hover:underline flex items-center gap-1"
          >
            <BookOpen className="w-3.5 h-3.5" />
            Personalise
          </Link>
        )}
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-neutral-100">
        <div
          className="h-1 bg-primary-500 transition-all duration-500"
          style={{ width: `${Math.round((doneCount / totalCount) * 100)}%` }}
        />
      </div>

      {/* Steps */}
      <ul className="divide-y divide-neutral-50">
        {steps.map(step => (
          <li key={step.id}>
            <Link
              href={step.href}
              className="flex items-center gap-3 px-5 py-3.5 hover:bg-neutral-50 transition-colors group"
            >
              {step.done ? (
                <CheckCircle2 className="w-5 h-5 text-success-600 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-neutral-300 shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium ${step.done ? 'text-neutral-400 line-through' : 'text-neutral-900'}`}
                >
                  {step.label}
                </p>
                <p className="text-xs text-neutral-500 truncate">{step.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-500 shrink-0 transition-colors" />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
