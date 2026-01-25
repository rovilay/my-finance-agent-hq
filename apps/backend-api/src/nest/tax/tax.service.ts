import { calculateOntarioIncomeTax } from '@hq/tools';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TaxService {
  async getTaxProjection(salary: number, userId: string) {
    console.log('Calculating tax for user:', userId);
    const result = await calculateOntarioIncomeTax({
      income: salary,
    });

    return {
      grossIncome: salary,
      totalTax: result.incomeTax,
      netIncome: result.netIncome,
      marginalRate: parseFloat(result.effectiveRate),
    };
  }
}
