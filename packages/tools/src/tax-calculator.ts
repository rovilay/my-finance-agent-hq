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

export const calculateCanadaFederalTax = (income: number, taxYear: SupportedTaxYear): number => {
  return applyBrackets(income, CANADA_FEDERAL_INCOME_TAX_BRACKETS[taxYear]);
};

export const calculateOntarioTax = (income: number, taxYear: SupportedTaxYear): number => {
  return applyBrackets(income, ONTARIO_INCOME_TAX_BRACKETS[taxYear]);
};
