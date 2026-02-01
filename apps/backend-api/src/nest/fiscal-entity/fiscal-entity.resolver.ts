import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FiscalEntityService } from './fiscal-entity.service';
import {
  FiscalEntity,
  FiscalEntityInput,
  FiscalEntityType,
  PaginatedFiscalEntity,
  UpdateFiscalEntityInput,
} from './models/fiscal-entity.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';
import { PaginationInput } from '../common/models';

@Resolver(() => FiscalEntity)
@UseGuards(GqlAuthGuard)
export class FiscalEntityResolver {
  constructor(private readonly service: FiscalEntityService) {}

  @Query(() => PaginatedFiscalEntity, { name: 'fiscalEntities' })
  async getFiscalEntities(
    @CurrentUser() user: User,
    @Args('fiscalEntityType', { type: () => FiscalEntityType, nullable: true })
    fiscalEntityType?: FiscalEntityType,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedFiscalEntity> {
    return this.service.findAllForUser(
      user.id,
      fiscalEntityType,
      pagination ?? {},
    );
  }

  @Query(() => FiscalEntity, { name: 'fiscalEntity' })
  async getFiscalEntity(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<FiscalEntity> {
    return this.service.findById(id, user.id);
  }

  @Mutation(() => FiscalEntity)
  async createFiscalEntity(
    @CurrentUser() user: User,
    @Args('input') input: FiscalEntityInput,
  ): Promise<FiscalEntity> {
    console.log(
      'Creating fiscal entity for user:',
      user.id,
      'with data:',
      input,
    );
    return this.service.create(user.id, input);
  }

  @Mutation(() => FiscalEntity)
  async updateFiscalEntity(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
    @Args('input') input: UpdateFiscalEntityInput,
  ): Promise<FiscalEntity> {
    return this.service.update(id, user.id, input);
  }

  @Mutation(() => Boolean)
  async deleteFiscalEntity(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<boolean> {
    return this.service.delete(id, user.id);
  }
}
