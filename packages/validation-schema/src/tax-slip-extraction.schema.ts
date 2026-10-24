import { z } from 'zod';

const nullableString = z.string().nullable();
const nullableNumber = z.number().nullable();
const nullableInteger = z.number().int().nullable();
const nullableTaxYear = z.union([z.number().int(), z.string().regex(/^\d{4}$/)]).nullable();

const otherBoxesSchema = z.array(
  z.object({
    box: z.string(),
    amount: nullableNumber,
  })
);

export const t4ExtractionSchema = z
  .object({
    documentType: z.literal('T4'),
    taxYear: nullableTaxYear,
    employerName: nullableString,
    employerAccountNumber: nullableString,
    provinceOfEmployment: nullableString,
    sin: nullableString,
    employmentCode: nullableInteger,
    employmentIncome: nullableNumber,
    incomeTaxDeducted: nullableNumber,
    cppContributions: nullableNumber,
    cpp2Contributions: nullableNumber,
    eiPremiums: nullableNumber,
    rppContributions: nullableNumber,
    pensionAdjustment: nullableNumber,
    rppOrDrspNumber: nullableString,
    cppPensionableEarnings: nullableNumber,
    eiInsurableEarnings: nullableNumber,
    unionDues: nullableNumber,
    employerHealthPremiums: nullableNumber,
    otherTaxableAllowances: nullableNumber,
    dentalBenefitsCode: nullableInteger,
    otherBoxes: otherBoxesSchema.optional().default([]),
  })
  .passthrough();

export const t3ExtractionSchema = z
  .object({
    documentType: z.literal('T3'),
    taxYear: nullableTaxYear,
    trustName: nullableString,
    beneficiaryName: nullableString,
    sin: nullableString,
    accountNumber: nullableString,
    beneficiaryCode: nullableString,
    reportCode: nullableString,
    actualEligibleDividends: nullableNumber,
    taxableEligibleDividends: nullableNumber,
    dividendTaxCreditEligible: nullableNumber,
    actualOtherDividends: nullableNumber,
    taxableOtherDividends: nullableNumber,
    dividendTaxCreditOther: nullableNumber,
    capitalGains: nullableNumber,
    capitalGainsEligibleForDeduction: nullableNumber,
    otherIncome: nullableNumber,
    foreignNonBusinessIncome: nullableNumber,
    foreignNonBusinessIncomeTaxPaid: nullableNumber,
    otherBoxes: otherBoxesSchema.optional().default([]),
  })
  .passthrough();

export const t4aExtractionSchema = z
  .object({
    documentType: z.literal('T4A'),
    taxYear: nullableTaxYear,
    payerName: nullableString,
    sin: nullableString,
    incomeTaxDeducted: nullableNumber,
    pensionOrSuperannuation: nullableNumber,
    lumpSumPayments: nullableNumber,
    selfEmployedCommissions: nullableNumber,
    annuities: nullableNumber,
    feesForServices: nullableNumber,
    scholarships: nullableNumber,
    respEducationalPayments: nullableNumber,
    otherBoxes: otherBoxesSchema.optional().default([]),
  })
  .passthrough();

export const t5ExtractionSchema = z
  .object({
    documentType: z.literal('T5'),
    taxYear: nullableTaxYear,
    payerName: nullableString,
    sin: nullableString,
    currency: nullableString,
    actualEligibleDividends: nullableNumber,
    taxableEligibleDividends: nullableNumber,
    dividendTaxCreditEligible: nullableNumber,
    actualOtherDividends: nullableNumber,
    taxableOtherDividends: nullableNumber,
    dividendTaxCreditOther: nullableNumber,
    interestFromCanadianSources: nullableNumber,
    otherIncome: nullableNumber,
    foreignIncome: nullableNumber,
    foreignTaxPaid: nullableNumber,
    otherBoxes: otherBoxesSchema.optional().default([]),
  })
  .passthrough();

export const t4eExtractionSchema = z
  .object({
    documentType: z.literal('T4E'),
    taxYear: nullableTaxYear,
    sin: nullableString,
    totalBenefitsPaid: nullableNumber,
    regularBenefits: nullableNumber,
    maternityPaternityBenefits: nullableNumber,
    incomeTaxDeducted: nullableNumber,
    eiInsurableEarnings: nullableNumber,
    repayment: nullableNumber,
    otherBoxes: otherBoxesSchema.optional().default([]),
  })
  .passthrough();

export const t2202ExtractionSchema = z
  .object({
    documentType: z.literal('T2202'),
    taxYear: nullableTaxYear,
    institutionName: nullableString,
    sin: nullableString,
    studentNumber: nullableString,
    tuitionEligibleFees: nullableNumber,
    partTimeMonths: nullableInteger,
    fullTimeMonths: nullableInteger,
    otherBoxes: otherBoxesSchema.optional().default([]),
  })
  .passthrough();

export const unknownSlipExtractionSchema = z
  .object({
    documentType: z.string(),
    taxYear: nullableTaxYear,
  })
  .passthrough();

export const taxSlipExtractionSchemas = {
  T3: t3ExtractionSchema,
  T4: t4ExtractionSchema,
  T4A: t4aExtractionSchema,
  T4E: t4eExtractionSchema,
  T5: t5ExtractionSchema,
  T2202: t2202ExtractionSchema,
  UNKNOWN: unknownSlipExtractionSchema,
} as const;

export type SupportedSlipSchemaType = keyof typeof taxSlipExtractionSchemas;
