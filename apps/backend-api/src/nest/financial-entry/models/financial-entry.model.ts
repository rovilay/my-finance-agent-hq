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

  @Field({ nullable: true })
  sourceDocumentId?: string;

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

  @Field({ nullable: true })
  sourceDocumentId?: string;
}

@InputType()
export class ExtractFinancialEntryInput {
  @Field()
  documentId: string;
}

@ObjectType()
export class ExtractedFinancialEntry {
  @Field({ nullable: true })
  date?: string;

  @Field(() => Float, { nullable: true })
  amount?: number;

  @Field({ nullable: true })
  currency?: string;

  @Field({ nullable: true })
  category?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  taxYear?: string;

  @Field(() => FinancialType, { nullable: true })
  type?: FinancialType;
}

@ObjectType()
export class PaginatedFinancialEntry extends Paginated(FinancialEntry) {}
