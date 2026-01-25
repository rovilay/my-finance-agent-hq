import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class Tax {
  @Field(() => Float)
  grossIncome: number;

  @Field(() => Float)
  totalTax: number;

  @Field(() => Float)
  netIncome: number;

  @Field(() => Float)
  marginalRate: number;
}
