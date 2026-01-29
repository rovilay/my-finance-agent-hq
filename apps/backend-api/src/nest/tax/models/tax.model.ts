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
    description: 'Final amount owed to CRA after credits and prepayments',
  })
  totalTaxLiability: number;

  @Field(() => Float)
  effectiveTaxRate: number;
}
