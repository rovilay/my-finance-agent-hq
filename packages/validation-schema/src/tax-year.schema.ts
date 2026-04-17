import { z } from 'zod';

export const supportedTaxYears = [2026, 2025] as const;
export type SupportedTaxYear = (typeof supportedTaxYears)[number];

export const taxYearSchema = z.coerce
  .number()
  .refine((v): v is SupportedTaxYear => (supportedTaxYears as readonly number[]).includes(v), {
    message: `Tax year must be one of: ${supportedTaxYears.join(', ')}`,
  });

export type TaxYear = z.infer<typeof taxYearSchema>; // 2025 | 2026
