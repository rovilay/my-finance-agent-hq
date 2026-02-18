import { z } from 'zod';

export const supportedTaxYears = [2026, 2025] as const;
export type SupportedTaxYear = (typeof supportedTaxYears)[number];

export const taxYearSchema = z.enum(supportedTaxYears.map(String) as [string, ...string[]], {
  errorMap: () => ({
    message: `Tax year must be one of: ${supportedTaxYears.join(', ')}`,
  }),
});

export type TaxYear = z.infer<typeof taxYearSchema>;
