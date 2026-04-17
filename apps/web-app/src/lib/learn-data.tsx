import { BadgeDollarSign, CheckCircle2, FileText, Landmark } from 'lucide-react';
import React from 'react';
import {
  FEDERAL_TAX_BRACKETS,
  getProvinceConfig,
  type TaxBracket,
  type SupportedProvince,
} from '@hq/tools/province-config';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Bracket {
  range: string;
  rate: string;
  color: string;
}

export interface FilingStep {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

export interface KeyDate {
  date: string;
  label: string;
  detail: string;
  highlight: boolean;
}

export interface Credit {
  name: string;
  amount: string;
  who: string;
  description: string;
}

// ─── Tax brackets ─────────────────────────────────────────────────────────────

// Color palettes — ordered lightest → darkest to match ascending bracket order.
const FEDERAL_BRACKET_COLORS = [
  'bg-blue-100 text-blue-800',
  'bg-blue-200 text-blue-900',
  'bg-blue-300 text-blue-900',
  'bg-blue-400 text-white',
  'bg-blue-600 text-white',
];

const PROVINCE_BRACKET_COLORS: Record<SupportedProvince, string[]> = {
  Ontario: [
    'bg-violet-100 text-violet-800',
    'bg-violet-200 text-violet-900',
    'bg-violet-300 text-violet-900',
    'bg-violet-400 text-white',
    'bg-violet-600 text-white',
  ],
};

const CAD = new Intl.NumberFormat('en-CA', {
  style: 'currency',
  currency: 'CAD',
  maximumFractionDigits: 0,
});

/**
 * Converts TaxBracket[] (descending threshold format used for computation)
 * into Bracket[] (ascending range format used for display).
 */
function bracketsToDisplay(brackets: TaxBracket[], colors: string[]): Bracket[] {
  const ascending = [...brackets].reverse();
  return ascending.map((bracket, i) => {
    const next = ascending[i + 1];
    const range =
      bracket.threshold === 0
        ? `Up to ${CAD.format(next!.threshold)}`
        : next === undefined
          ? `Over ${CAD.format(bracket.threshold)}`
          : `${CAD.format(bracket.threshold)} – ${CAD.format(next.threshold)}`;
    const rate = `${parseFloat((bracket.rate * 100).toFixed(4))}%`;
    return { range, rate, color: colors[i] ?? colors[colors.length - 1] };
  });
}

export const FEDERAL_BRACKETS_2024: Bracket[] = bracketsToDisplay(
  FEDERAL_TAX_BRACKETS[2026],
  FEDERAL_BRACKET_COLORS
);

/** Province-specific brackets keyed by full province name, derived from province-config. */
export const PROVINCIAL_BRACKETS_2024: Record<SupportedProvince, Bracket[]> = {
  Ontario: bracketsToDisplay(
    getProvinceConfig('Ontario').provincialBrackets[2026],
    PROVINCE_BRACKET_COLORS['Ontario']
  ),
};

/**
 * Returns provincial brackets for the given province.
 * Falls back to Ontario when the province is not yet in the map.
 */
export const getProvincialBrackets = (province: string): Bracket[] =>
  PROVINCIAL_BRACKETS_2024[province as SupportedProvince] ?? PROVINCIAL_BRACKETS_2024['Ontario'];

/** @deprecated Use getProvincialBrackets('Ontario') */
export const ONTARIO_BRACKETS_2024: Bracket[] = PROVINCIAL_BRACKETS_2024['Ontario'];

// ─── Filing journey ───────────────────────────────────────────────────────────

export const FILING_STEPS: FilingStep[] = [
  {
    step: '1',
    title: 'Gather your slips',
    description:
      'Collect all tax slips sent by employers, banks, and government (T4, T3, T5, etc.). Most arrive by end of February.',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-primary-100 text-primary-700',
  },
  {
    step: '2',
    title: 'Know your deductions & credits',
    description:
      'Identify what lowers your taxable income (RRSP contributions, tuition) and credits that reduce your tax bill (BPA, climate action).',
    icon: <BadgeDollarSign className="w-5 h-5" />,
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    step: '3',
    title: 'File your return',
    description:
      "Use tax software or a NETFILE-certified service. First-time filers can use the CRA's free SimpleFile program.",
    icon: <Landmark className="w-5 h-5" />,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    step: '4',
    title: 'Track your notice of assessment',
    description:
      'CRA reviews your return and sends a Notice of Assessment (NOA). Check My Account or watch your mail.',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'bg-violet-100 text-violet-700',
  },
];

// ─── Key dates ────────────────────────────────────────────────────────────────

export const KEY_DATES: KeyDate[] = [
  {
    date: 'March 3, 2025',
    label: 'RRSP contribution deadline',
    detail: 'Last day to contribute to your RRSP and deduct it from 2024 income.',
    highlight: true,
  },
  {
    date: 'Late February',
    label: 'Slips deadline',
    detail: 'Employers and financial institutions must mail your T4, T3, T5 slips.',
    highlight: false,
  },
  {
    date: 'March 31',
    label: 'T3 slips deadline',
    detail: 'Mutual fund T3 slips can arrive as late as March 31 — wait before filing.',
    highlight: false,
  },
  {
    date: 'April 30',
    label: 'Filing & payment deadline',
    detail: 'Most individuals must file and pay any balance owing by April 30.',
    highlight: true,
  },
  {
    date: 'June 15',
    label: 'Self-employed filing deadline',
    detail:
      'Extended filing deadline if you or your spouse are self-employed — but taxes owed are still due April 30.',
    highlight: false,
  },
];

// ─── Credits & deductions ─────────────────────────────────────────────────────

/** Federal credits available to all Canadians regardless of province. */
export const FEDERAL_CREDITS: Credit[] = [
  {
    name: 'Basic Personal Amount (BPA)',
    amount: '~$15,705 federal',
    who: 'Everyone',
    description: 'The first ~$15,705 of income is completely tax-free at the federal level.',
  },
  {
    name: 'GST/HST Credit',
    amount: 'Up to $519/year',
    who: 'Lower-income earners',
    description: 'Quarterly payments to offset the GST/HST you pay on purchases.',
  },
  {
    name: 'Canada Workers Benefit',
    amount: 'Up to $1,518',
    who: 'Working low-income Canadians',
    description: 'A refundable tax credit for employed or self-employed people with modest income.',
  },
  {
    name: 'Tuition & Education Credits',
    amount: 'Varies',
    who: 'Students',
    description:
      'Federal and provincial credits on eligible tuition fees. Unused amounts can be carried forward.',
  },
];

/** Province-specific credits keyed by full province name. */
export const PROVINCIAL_CREDITS: Record<SupportedProvince, Credit[]> = {
  Ontario: [
    {
      name: 'Ontario Trillium Benefit',
      amount: 'Varies',
      who: 'Ontario residents',
      description: 'Combines energy, sales, and property tax credits into monthly payments.',
    },
  ],
};

/**
 * Returns the combined federal + provincial credits for the given province.
 * Falls back to Ontario provincial credits when the province is not yet in the map.
 */
export const getCreditsForProvince = (province: string): Credit[] => [
  ...FEDERAL_CREDITS,
  ...(PROVINCIAL_CREDITS[province as SupportedProvince] ?? PROVINCIAL_CREDITS['Ontario']),
];

/** @deprecated Use getCreditsForProvince('Ontario') */
export const COMMON_CREDITS: Credit[] = getCreditsForProvince('Ontario');
