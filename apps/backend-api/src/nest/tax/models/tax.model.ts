import { ObjectType, Field, Float, ID } from '@nestjs/graphql';

@ObjectType()
export class TaxProjection {
  @Field(() => ID)
  entityId: string; // The "Owner" of this projection

  @Field()
  taxYear: string; // The "Time" context

  @Field(() => Float)
  totalIncome: number;

  @Field(() => Float)
  taxableIncome: number;

  @Field(() => Float)
  federalTax: number;

  @Field(() => Float)
  provincialTax: number;

  @Field(() => Float, {
    description: 'Federal + Provincial tax before credits',
  })
  totalTax: number;

  @Field(() => Float, {
    description:
      'Total credits applied (includes automatic BPA and user-entered credits)',
  })
  creditsApplied: number;

  @Field(() => Float, {
    description: 'Final amount owed to CRA after credits and prepayments',
  })
  totalTaxLiability: number;

  @Field(() => Float)
  effectiveTaxRate: number;

  // Entry type summaries
  @Field(() => Float, {
    description: 'Total income from all income entries',
  })
  incomeTotal: number;

  @Field(() => Float, {
    description: 'Total deductions from all deduction entries',
  })
  deductionsTotal: number;

  @Field(() => Float, {
    description: 'Total user-entered credits (not including automatic BPA)',
  })
  creditsTotal: number;

  @Field(() => Float, {
    description: 'Total tax already paid throughout the year',
  })
  taxPaidTotal: number;
}
