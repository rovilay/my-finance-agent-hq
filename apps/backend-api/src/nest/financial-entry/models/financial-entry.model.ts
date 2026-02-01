import {
  Field,
  Float,
  ID,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { Paginated } from '../../common/models';

export enum FinancialType {
  income = 'income',
  deduction = 'deduction',
  credit = 'credit',
  taxPaid = 'tax_paid',
}

registerEnumType(FinancialType, { name: 'FinancialType' });

@ObjectType()
export class FinancialEntry {
  @Field(() => ID)
  id: string;

  @Field(() => ID)
  entityId: string;

  @Field(() => FinancialType)
  type: FinancialType;

  @Field()
  category: string; // e.g., 'employment_salary'

  @Field(() => Float)
  amount: number;

  @Field()
  currency: string;

  @Field()
  date: Date;

  @Field()
  taxYear: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class CreateFinancialEntryInput {
  @Field(() => String)
  entityId: string;

  @Field(() => FinancialType)
  type: FinancialType;

  @Field()
  category: string;

  @Field(() => Float)
  amount: number;

  @Field({ defaultValue: 'CAD' })
  currency: string;

  @Field()
  date: Date;

  @Field()
  taxYear: string;
}

@ObjectType()
export class PaginatedFinancialEntry extends Paginated(FinancialEntry) {}
