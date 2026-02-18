import { SupportedTaxYear } from '@hq/validation-schema';
import { tool } from 'ai';
import z from 'zod';

/**
 * Simplified 2026 Combined Tax Brackets (Federal + Ontario)
 * Note: These are representative of the progressive brackets for 2026.
 */
const INCOME_TAX_BRACKETS: Record<SupportedTaxYear, { threshold: number; rate: number }[]> = {
  2025: [
    { threshold: 53891, rate: 0.1905 }, // Combined rate for first bracket
    { threshold: 58523, rate: 0.2315 },
    { threshold: 107785, rate: 0.2965 },
    { threshold: 117045, rate: 0.3148 },
    { threshold: Infinity, rate: 0.3389 },
  ],
  2026: [
    { threshold: 53891, rate: 0.1905 }, // Combined rate for first bracket
    { threshold: 58523, rate: 0.2315 },
    { threshold: 107785, rate: 0.2965 },
    { threshold: 117045, rate: 0.3148 },
    { threshold: Infinity, rate: 0.3389 },
  ],
};

const CANADA_FEDERAL_INCOME_TAX_BRACKETS: Record<
  SupportedTaxYear,
  { threshold: number; rate: number }[]
> = {
  2025: [
    { threshold: 173205, rate: 0.29 },
    { threshold: 111733, rate: 0.26 },
    { threshold: 55867, rate: 0.205 },
    { threshold: 0, rate: 0.15 },
  ],
  2026: [
    { threshold: 173205, rate: 0.29 },
    { threshold: 111733, rate: 0.26 },
    { threshold: 55867, rate: 0.205 },
    { threshold: 0, rate: 0.15 },
  ],
};

const ONTARIO_INCOME_TAX_BRACKETS: Record<SupportedTaxYear, { threshold: number; rate: number }[]> =
  {
    2025: [
      { threshold: 173205, rate: 0.29 },
      { threshold: 111733, rate: 0.26 },
      { threshold: 55867, rate: 0.205 },
      { threshold: 0, rate: 0.15 },
    ],
    2026: [
      { threshold: 173205, rate: 0.29 },
      { threshold: 111733, rate: 0.26 },
      { threshold: 55867, rate: 0.205 },
      { threshold: 0, rate: 0.15 },
    ],
  };

const OntarioTaxSchema = z.object({
  income: z.number().min(0).describe('Total annual gross income in CAD.'),
  invoiceAmount: z
    .number()
    .optional()
    .describe('An optional business invoice amount to calculate HST for in CAD.'),
});

export type OntarioTaxSchemaType = z.infer<typeof OntarioTaxSchema>;
export type OntarioTaxResult = {
  currency: 'CAD';
  incomeTax: number;
  netIncome: number;
  hst: number;
  effectiveRate: string;
  disclaimer: string;
};

export const calculateOntarioIncomeTax = async ({
  income,
  invoiceAmount,
}: OntarioTaxSchemaType): Promise<OntarioTaxResult> => {
  // 1. Calculate Progressive Income Tax
  let remainingIncome = income;
  let totalIncomeTax = 0;
  let previousThreshold = 0;

  for (const { threshold, rate } of INCOME_TAX_BRACKETS[2026]) {
    const taxableInThisBracket = Math.min(
      Math.max(remainingIncome, 0),
      threshold - previousThreshold
    );
    totalIncomeTax += taxableInThisBracket * rate;
    remainingIncome -= taxableInThisBracket;
    previousThreshold = threshold;
    if (remainingIncome <= 0) break;
  }

  // 2. Calculate HST if invoiceAmount is provided
  const hst = invoiceAmount ? invoiceAmount * 0.13 : 0;

  return {
    currency: 'CAD',
    incomeTax: Number(totalIncomeTax.toFixed(2)),
    netIncome: Number((income - totalIncomeTax).toFixed(2)),
    hst: Number(hst.toFixed(2)),
    effectiveRate: `${((totalIncomeTax / income) * 100).toFixed(2)}%`,
    disclaimer: 'Based on simplified 2026 Ontario/Federal combined estimates.',
  };
};

export const calculateOntarioTaxTool = tool({
  description: 'Calculates Ontario HST (13%) and progressive personal income tax for 2026.',
  inputSchema: OntarioTaxSchema,
  execute: calculateOntarioIncomeTax,
});

const applyBrackets = (income: number, brackets: { threshold: number; rate: number }[]): number => {
  let tax = 0;
  let remainingIncome = income;

  for (const bracket of brackets) {
    if (remainingIncome > bracket.threshold) {
      const taxableAtThisRate = remainingIncome - bracket.threshold;
      tax += taxableAtThisRate * bracket.rate;
      remainingIncome = bracket.threshold;
    }
  }
  return tax;
};

export const calculateCanadaFederalTax = (
  income: number,
  taxYear: SupportedTaxYear = 2026
): number => {
  return applyBrackets(income, CANADA_FEDERAL_INCOME_TAX_BRACKETS[taxYear]);
};

export const calculateOntarioTax = (income: number, taxYear: SupportedTaxYear = 2026): number => {
  return applyBrackets(income, ONTARIO_INCOME_TAX_BRACKETS[taxYear]);
};

/**
 * Basic Personal Amount (BPA) Credit configuration by year
 * These are non-refundable tax credits that reduce the amount of tax owed
 * Federal BPA: The amount you can earn before paying federal tax, with credit at lowest tax rate (15%)
 * Provincial BPA: The amount you can earn before paying provincial tax, with credit at lowest tax rate (5.05% for Ontario)
 */
const BPA_CREDITS: Record<
  SupportedTaxYear,
  { federalBPA: number; federalRate: number; ontarioBPA: number; ontarioRate: number }
> = {
  2025: {
    federalBPA: 16200,
    federalRate: 0.15,
    ontarioBPA: 12500,
    ontarioRate: 0.0505,
  },
  2026: {
    federalBPA: 16200,
    federalRate: 0.15,
    ontarioBPA: 12500,
    ontarioRate: 0.0505,
  },
};

/**
 * Calculate the total Basic Personal Amount (BPA) tax credits
 * This includes both federal and provincial (Ontario) credits
 *
 * @param taxYear - The tax year to calculate credits for
 * @returns The total dollar amount of BPA credits
 */
export const calculateBasicPersonalAmountCredit = (taxYear: SupportedTaxYear = 2026): number => {
  const bpa = BPA_CREDITS[taxYear];
  return bpa.federalBPA * bpa.federalRate + bpa.ontarioBPA * bpa.ontarioRate;
};
