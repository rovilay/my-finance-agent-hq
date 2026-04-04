import { DocumentStatus, FinancialType, FiscalEntityType } from '@/lib/graphql';
import clsx from 'clsx';
import {
  Building2,
  CheckCircle2,
  Eye,
  Home,
  Loader2,
  Trash2,
  TrendingDown,
  TrendingUp,
  User,
  XCircle,
} from 'lucide-react';

export const entityTypeIcons = {
  [FiscalEntityType.Individual]: User,
  [FiscalEntityType.Household]: Home,
  [FiscalEntityType.Business]: Building2,
};

export const entityTypeLabels = {
  [FiscalEntityType.Individual]: 'Individual',
  [FiscalEntityType.Household]: 'Household',
  [FiscalEntityType.Business]: 'Business',
};

export const entityTypeColors = {
  [FiscalEntityType.Individual]: 'bg-blue-100 text-blue-700',
  [FiscalEntityType.Household]: 'bg-green-100 text-green-700',
  [FiscalEntityType.Business]: 'bg-purple-100 text-purple-700',
};

export const entityTypes = [
  {
    type: FiscalEntityType.Individual,
    label: entityTypeLabels[FiscalEntityType.Individual],
    description: 'Personal tax filing',
    icon: entityTypeIcons[FiscalEntityType.Individual],
    color: clsx(entityTypeColors[FiscalEntityType.Individual], 'border-blue-300'),
    activeColor: 'bg-blue-600 text-white border-blue-600',
  },
  {
    type: FiscalEntityType.Household,
    label: entityTypeLabels[FiscalEntityType.Household],
    description: 'Joint filing with spouse/partner',
    icon: entityTypeIcons[FiscalEntityType.Household],
    color: clsx(entityTypeColors[FiscalEntityType.Household], 'border-green-300'),
    activeColor: 'bg-green-600 text-white border-green-600',
  },
  {
    type: FiscalEntityType.Business,
    label: entityTypeLabels[FiscalEntityType.Business],
    description: 'Corporation or sole proprietorship',
    icon: entityTypeIcons[FiscalEntityType.Business],
    color: clsx(entityTypeColors[FiscalEntityType.Business], 'border-purple-300'),
    activeColor: 'bg-purple-600 text-white border-purple-600',
  },
];

// Popular categories organized by entry type
export const CATEGORIES_BY_TYPE = {
  income: [
    'Employment Income',
    'Self-Employment Income',
    'Investment Income',
    'Rental Income',
    'Capital Gains',
    'Pension Income',
    'Business Income',
    'RRSP Withdrawals',
    'Foreign Income',
  ],
  deduction: [
    'RRSP Contributions',
    'Medical Expenses',
    'Charitable Donations',
    'Professional Fees',
    'Union Dues',
    'Childcare Expenses',
    'Moving Expenses',
    'Student Loan Interest',
    'Investment Expenses',
    'Home Office Expenses',
  ],
  credit: [
    'Basic Personal Amount',
    'Spousal Amount',
    'Disability Credit',
    'Tuition Credit',
    'Medical Expenses Credit',
    'Charitable Donations Credit',
    'First-Time Home Buyer',
    'Canada Employment Credit',
    'Public Transit Credit',
    'Digital News Credit',
  ],
  tax_paid: [
    'Federal Tax Withheld',
    'Provincial Tax Withheld',
    'CPP Contributions',
    'EI Premiums',
    'Installment Payments',
    'Foreign Tax Paid',
    'Quebec Tax Withheld',
    'Prior Year Balance',
    'Penalties Paid',
    'Interest Paid',
  ],
} as const;

export const TYPE_CONFIG = {
  [FinancialType.Income]: {
    label: 'Income',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    icon: TrendingUp,
  },
  [FinancialType.Deduction]: {
    label: 'Deduction',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    icon: TrendingDown,
  },
  [FinancialType.Credit]: {
    label: 'Credit',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    icon: TrendingDown,
  },
  [FinancialType.TaxPaid]: {
    label: 'Tax Paid',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    icon: TrendingDown,
  },
};

export const STATUS_CONFIG = {
  [DocumentStatus.Uploaded]: {
    label: 'Reading your document',
    tabLabel: 'In Progress',
    icon: Loader2,
    iconClassName: 'animate-spin',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    hint: "We're reading your document — check back in a moment.",
  },
  [DocumentStatus.Processed]: {
    label: 'Needs your review',
    tabLabel: 'Needs Review',
    icon: Eye,
    iconClassName: '',
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    hint: 'We found data in this document. Tap \u2018Review Extraction\u2019 to confirm.',
  },
  [DocumentStatus.Verified]: {
    label: 'Saved to your tax summary',
    tabLabel: 'Saved',
    icon: CheckCircle2,
    iconClassName: '',
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    hint: 'Your entries have been added to your tax summary.',
  },
  [DocumentStatus.Purged]: {
    label: 'File removed for privacy',
    tabLabel: 'Archived',
    icon: Trash2,
    iconClassName: '',
    color: 'text-neutral-500',
    bgColor: 'bg-neutral-50',
    hint: 'Your file was deleted after review. The extracted data is still saved.',
  },
  [DocumentStatus.Failed]: {
    label: 'Could not read this document',
    tabLabel: "Couldn't Read",
    icon: XCircle,
    iconClassName: '',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    hint: "We couldn't read this file. Try uploading a clearer copy.",
  },
};
