import { Mutation, Resolver, Query, Args } from '@nestjs/graphql';
import { FinancialEntryService } from './financial-entry.service';
import {
  CreateFinancialEntryInput,
  FinancialEntry,
} from './models/financial-entry.model';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createFinancialEntrySchema } from '@hq/validation-schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';

@Resolver()
@UseGuards(GqlAuthGuard)
export class FinancialEntryResolver {
  constructor(private readonly financialEntryService: FinancialEntryService) {}

  @Mutation(() => FinancialEntry)
  async addFinancialEntry(
    @Args('input', new ZodValidationPipe(createFinancialEntrySchema))
    input: CreateFinancialEntryInput,
  ) {
    return this.financialEntryService.create(input);
  }

  @Query(() => [FinancialEntry])
  async ledger(
    @Args('entityId') entityId: string,
    @Args('taxYear', { nullable: true }) taxYear?: string,
  ) {
    return this.financialEntryService.findByEntity(entityId, taxYear);
  }
}
