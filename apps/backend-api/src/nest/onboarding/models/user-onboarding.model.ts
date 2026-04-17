import { ObjectType, Field, ID, InputType } from '@nestjs/graphql';

@ObjectType()
export class UserOnboarding {
  @Field(() => ID)
  id: string;

  @Field()
  userId: string;

  @Field()
  filingPath: string;

  @Field()
  arrivedThisYear: boolean;

  @Field(() => [String])
  incomeSources: string[];

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class SaveOnboardingInput {
  @Field()
  filingPath: string;

  @Field()
  arrivedThisYear: boolean;

  @Field(() => [String])
  incomeSources: string[];
}
