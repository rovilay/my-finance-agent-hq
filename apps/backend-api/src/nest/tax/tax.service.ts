import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FinancialEntryService } from '../financial-entry/financial-entry.service';
import {
  FinancialEntry,
  FinancialType,
} from '../financial-entry/models/financial-entry.model';
import { TaxProjection } from './models/tax.model';
import { calculateCanadaFederalTax, calculateOntarioTax } from '@hq/tools';

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
      const entries = await this.financialService.findByEntity(
        entityId,
        taxYear,
      );

      const totalIncome = this.sumByType(entries, FinancialType.income);
      const totalDeductions = this.sumByType(entries, FinancialType.deduction);
      const taxAlreadyPaid = this.sumByType(entries, FinancialType.taxPaid);

      const taxableIncome = Math.max(0, totalIncome - totalDeductions);

      // 1. Calculate Federal Tax
      const federalTax = calculateCanadaFederalTax(taxableIncome, 2026);

      // 2. Calculate Provincial Tax (Ontario)
      const provincialTax = calculateOntarioTax(taxableIncome, 2026);

      // 3. Totals
      const totalTax = federalTax + provincialTax;

      // Basic Personal Amount (BPA) Credit - Simplification for Phase 1
      // 2026 Estimated Federal BPA: ~$16,200. Ontario BPA: ~$12,500.
      // We apply 15% (Fed) and 5.05% (Prov) to these amounts as non-refundable credits.
      const totalCredits = 16200 * 0.15 + 12500 * 0.0505;

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
        totalTaxLiability,
        effectiveTaxRate: totalIncome > 0 ? (totalTax / totalIncome) * 100 : 0,
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
