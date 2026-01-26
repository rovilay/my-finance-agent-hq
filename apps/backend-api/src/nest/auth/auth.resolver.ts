import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from './user/user.service';
import { User, UserInput } from './models/user.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@Resolver()
export class AuthResolver {
  constructor(private readonly userService: UserService) {}

  @Mutation(() => User)
  async syncUser(@Args('data') data: UserInput): Promise<User> {
    return this.userService.syncUser(data);
  }

  @Query(() => User, { name: 'me' })
  @UseGuards(GqlAuthGuard)
  async me(@CurrentUser() user: User): Promise<User> {
    return Promise.resolve(user);
  }
}
