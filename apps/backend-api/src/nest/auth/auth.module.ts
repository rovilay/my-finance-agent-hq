import { Module } from '@nestjs/common';
import { UserService } from './user/user.service';
import { GqlAuthGuard } from './guards/gql-auth.guard';
import { AuthResolver } from './auth.resolver';

@Module({
  providers: [AuthResolver, UserService, GqlAuthGuard],
  exports: [UserService, GqlAuthGuard],
})
export class AuthModule {}
