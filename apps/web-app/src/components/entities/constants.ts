import { FiscalEntityType } from '@/lib/graphql';
import clsx from 'clsx';
import { Building2, Home, User } from 'lucide-react';

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
