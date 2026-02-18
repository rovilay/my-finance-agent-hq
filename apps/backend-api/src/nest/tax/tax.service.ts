import {
  Injectable,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { FinancialEntryService } from '../financial-entry/financial-entry.service';
import {
  FinancialEntry,
  FinancialType,
} from '../financial-entry/models/financial-entry.model';
import { TaxProjection } from './models/tax.model';
import {
  calculateCanadaFederalTax,
  calculateOntarioTax,
  calculateBasicPersonalAmountCredit,
} from '@hq/tools';
import { SupportedTaxYear, taxYearSchema } from '@hq/validation-schema';

@Injectable()
export class TaxService {
  constructor(private readonly financialService: FinancialEntryService) {}

  async calculateProjection(
    entityId: string,
    taxYear: string,
  ): Promise<TaxProjection> {
    console.log(
      `[TaxService] 🚀 Starting Progressive Tax Calculation | Entity: ${entityId} | Year: ${taxYear}`,
    );

    try {
      // Validate tax year using Zod schema
      const validationResult = taxYearSchema.safeParse(taxYear);

      if (!validationResult.success) {
        throw new BadRequestException(
          validationResult.error.errors[0]?.message ||
            'Invalid tax year: enter a supported year (e.g., 2025, 2026)',
        );
      }

      // Parse validated tax year as number for calculation
      const year = parseInt(validationResult.data, 10) as SupportedTaxYear;

      const entries = await this.financialService.findByEntity(
        entityId,
        taxYear,
      );

      const totalIncome = this.sumByType(entries, FinancialType.income);
      const totalDeductions = this.sumByType(entries, FinancialType.deduction);
      const userCredits = this.sumByType(entries, FinancialType.credit);
      const taxAlreadyPaid = this.sumByType(entries, FinancialType.taxPaid);

      const taxableIncome = Math.max(0, totalIncome - totalDeductions);

      // 1. Calculate Federal Tax
      const federalTax = calculateCanadaFederalTax(taxableIncome, year);

      // 2. Calculate Provincial Tax (Ontario)
      const provincialTax = calculateOntarioTax(taxableIncome, year);

      // 3. Totals
      const totalTax = federalTax + provincialTax;

      // Basic Personal Amount (BPA) Credits - automatic non-refundable credits
      const totalCredits = calculateBasicPersonalAmountCredit(year);

      const totalTaxLiability = Math.max(
        0,
        totalTax - totalCredits - taxAlreadyPaid,
      );

      const result: TaxProjection = {
        entityId,
        taxYear,
        totalIncome,
        taxableIncome,
        federalTax,
        provincialTax,
        totalTax,
        creditsApplied: totalCredits,
        totalTaxLiability,
        effectiveTaxRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
        // Entry type summaries
        incomeTotal: totalIncome,
        deductionsTotal: totalDeductions,
        creditsTotal: userCredits,
        taxPaidTotal: taxAlreadyPaid,
      };

      console.log(
        `[TaxService] ✅ Calculation successful for ${entityId}. Final Liability: $${totalTaxLiability.toFixed(2)}`,
      );
      return result;
    } catch (error) {
      console.error(
        `[TaxService] ❌ Calculation failed for Entity: ${entityId}`,
        error,
      );
      throw new InternalServerErrorException(
        'Error calculating tax projection',
      );
    }
  }

  private sumByType(entries: FinancialEntry[], type: FinancialType): number {
    return entries
      .filter((e) => e.type === type)
      .reduce((sum, e) => sum + e.amount, 0);
  }
}
