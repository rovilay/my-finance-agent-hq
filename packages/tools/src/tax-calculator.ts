import { SupportedTaxYear, taxYearSchema } from '@hq/validation-schema';
import { tool } from 'ai';
import z from 'zod';
import {
  getProvinceConfig,
  DEFAULT_PROVINCE,
  FEDERAL_TAX_BRACKETS,
  FEDERAL_BPA,
} from './province-config';
// All bracket data lives in province-config.ts — see FEDERAL_TAX_BRACKETS and each ProvinceConfig.

const OntarioTaxSchema = z.object({
  income: z.number().min(0).describe('Total annual gross income in CAD.'),
  invoiceAmount: z
    .number()
    .optional()
    .describe('An optional business invoice amount to calculate sales tax for in CAD.'),
  province: z
    .string()
    .optional()
    .describe('Canadian province for which to calculate tax. Defaults to Ontario.'),
  taxYear: taxYearSchema.optional().describe('Tax year for which to calculate. Defaults to 2026.'),
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
  province = DEFAULT_PROVINCE,
  taxYear = 2026,
}: OntarioTaxSchemaType): Promise<OntarioTaxResult> => {
  const provinceConfig = getProvinceConfig(province);

  // Combine federal + provincial taxes from their separate sources of truth
  const federalTax = calculateCanadaFederalTax(income, taxYear);
  const provincialTax = calculateProvincialTax(income, province, taxYear);
  const totalIncomeTax = federalTax + provincialTax;

  // Sales tax on invoice amount if provided
  const salesTax = invoiceAmount ? invoiceAmount * provinceConfig.salesTaxRate : 0;

  return {
    currency: 'CAD',
    incomeTax: Number(totalIncomeTax.toFixed(2)),
    netIncome: Number((income - totalIncomeTax).toFixed(2)),
    hst: Number(salesTax.toFixed(2)),
    effectiveRate: `${((totalIncomeTax / income) * 100).toFixed(2)}%`,
    disclaimer: `Based on simplified ${taxYear} ${provinceConfig.name}/Federal combined estimates.`,
  };
};

export const calculateOntarioTaxTool = tool({
  description:
    'Calculates provincial sales tax and progressive personal income tax for a given year. ' +
    'Supports any Canadian province — defaults to Ontario when province is not specified.',
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
  return applyBrackets(income, FEDERAL_TAX_BRACKETS[taxYear]);
};

/** Calculate provincial income tax. Defaults to Ontario when no province is supplied. */
export const calculateProvincialTax = (
  income: number,
  province: string = DEFAULT_PROVINCE,
  taxYear: SupportedTaxYear = 2026
): number => {
  return applyBrackets(income, getProvinceConfig(province).provincialBrackets[taxYear]);
};

/** @deprecated Use calculateProvincialTax instead */
export const calculateOntarioTax = (income: number, taxYear: SupportedTaxYear = 2026): number =>
  calculateProvincialTax(income, 'Ontario', taxYear);

/** Calculate the combined federal + provincial Basic Personal Amount (BPA) tax credit.
 * Federal BPA data is sourced from FEDERAL_BPA in province-config.ts.
 */
export const calculateBasicPersonalAmountCredit = (
  taxYear: SupportedTaxYear = 2026,
  province: string = DEFAULT_PROVINCE
): number => {
  const federal = FEDERAL_BPA[taxYear];
  const provincial = getProvinceConfig(province).basicPersonalAmount[taxYear];
  return federal.amount * federal.rate + provincial.amount * provincial.lowestRate;
};
