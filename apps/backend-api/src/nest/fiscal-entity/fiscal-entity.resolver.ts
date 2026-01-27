import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { FiscalEntityService } from './fiscal-entity.service';
import { FiscalEntity, FiscalEntityInput } from './models/fiscal-entity.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';

@Resolver(() => FiscalEntity)
@UseGuards(GqlAuthGuard)
export class FiscalEntityResolver {
  constructor(private readonly service: FiscalEntityService) {}

  @Query(() => [FiscalEntity])
  async getFiscalEntities(@CurrentUser() user: User): Promise<FiscalEntity[]> {
    return this.service.findAllForUser(user.id);
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
}
