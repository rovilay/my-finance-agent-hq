import { z } from 'zod';
import { supportedTaxYears } from '@hq/tools';

export const taxYearSchema = z.enum(supportedTaxYears.map(String) as [string, ...string[]], {
  errorMap: () => ({
    message: `Tax year must be one of: ${supportedTaxYears.join(', ')}`,
  }),
});

export type TaxYear = z.infer<typeof taxYearSchema>;
