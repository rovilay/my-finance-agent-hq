import { BadgeDollarSign, CheckCircle2, FileText, Landmark } from 'lucide-react';
import React from 'react';

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

export const FEDERAL_BRACKETS_2024: Bracket[] = [
  { range: 'Up to $57,375', rate: '15%', color: 'bg-blue-100 text-blue-800' },
  { range: '$57,375 – $114,750', rate: '20.5%', color: 'bg-blue-200 text-blue-900' },
  { range: '$114,750 – $158,519', rate: '26%', color: 'bg-blue-300 text-blue-900' },
  { range: '$158,519 – $220,000', rate: '29%', color: 'bg-blue-400 text-white' },
  { range: 'Over $220,000', rate: '33%', color: 'bg-blue-600 text-white' },
];

export const ONTARIO_BRACKETS_2024: Bracket[] = [
  { range: 'Up to $51,446', rate: '5.05%', color: 'bg-violet-100 text-violet-800' },
  { range: '$51,446 – $102,894', rate: '9.15%', color: 'bg-violet-200 text-violet-900' },
  { range: '$102,894 – $150,000', rate: '11.16%', color: 'bg-violet-300 text-violet-900' },
  { range: '$150,000 – $220,000', rate: '12.16%', color: 'bg-violet-400 text-white' },
  { range: 'Over $220,000', rate: '13.16%', color: 'bg-violet-600 text-white' },
];

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

export const COMMON_CREDITS: Credit[] = [
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
    name: 'Ontario Trillium Benefit',
    amount: 'Varies',
    who: 'Ontario residents',
    description: 'Combines energy, sales, and property tax credits into monthly payments.',
  },
  {
    name: 'Tuition & Education Credits',
    amount: 'Varies',
    who: 'Students',
    description:
      'Federal and provincial credits on eligible tuition fees. Unused amounts can be carried forward.',
  },
];
