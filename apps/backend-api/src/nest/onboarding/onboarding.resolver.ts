import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import {
  UserOnboarding,
  SaveOnboardingInput,
} from './models/user-onboarding.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';

@Resolver(() => UserOnboarding)
@UseGuards(GqlAuthGuard)
export class OnboardingResolver {
  constructor(private readonly service: OnboardingService) {}

  @Query(() => UserOnboarding, { nullable: true, name: 'myOnboarding' })
  async getMyOnboarding(
    @CurrentUser() user: User,
  ): Promise<UserOnboarding | null> {
    return this.service.findByUserId(user.id);
  }

  @Mutation(() => UserOnboarding)
  async saveOnboarding(
    @CurrentUser() user: User,
    @Args('input') input: SaveOnboardingInput,
  ): Promise<UserOnboarding> {
    return this.service.saveOnboarding(user.id, input);
  }
}
