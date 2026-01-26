import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql/dist/services/gql-execution-context';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const user = ctx.getContext<{ req: Request }>().req.user;

    if (!user) {
      throw new Error('No user found in request context');
    }

    return user;
  },
);
