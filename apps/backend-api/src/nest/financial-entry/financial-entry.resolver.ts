import { Mutation, Resolver, Query, Args, ID } from '@nestjs/graphql';
import { FinancialEntryService } from './financial-entry.service';
import {
  CreateFinancialEntryInput,
  FinancialEntry,
  PaginatedFinancialEntry,
} from './models/financial-entry.model';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { createFinancialEntrySchema } from '@hq/validation-schema';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { PaginationInput } from '../common/models';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';

@Resolver()
@UseGuards(GqlAuthGuard)
export class FinancialEntryResolver {
  constructor(private readonly financialEntryService: FinancialEntryService) {}

  @Mutation(() => FinancialEntry)
  async addFinancialEntry(
    @CurrentUser() user: User,
    @Args('input', new ZodValidationPipe(createFinancialEntrySchema))
    input: CreateFinancialEntryInput,
  ) {
    return this.financialEntryService.create(input, user.id);
  }

  @Query(() => PaginatedFinancialEntry, { name: 'financialEntries' })
  async ledger(
    @Args('entityId', { type: () => ID }) entityId: string,
    @Args('taxYear', { nullable: true }) taxYear?: string,
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    paginationArgs?: PaginationInput,
  ): Promise<PaginatedFinancialEntry> {
    return this.financialEntryService.findByEntityPaginated(
      entityId,
      taxYear,
      paginationArgs,
    );
  }

  @Query(() => FinancialEntry, { name: 'financialEntry' })
  async getFinancialEntry(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<FinancialEntry> {
    return this.financialEntryService.findById(id, user.id);
  }
}
