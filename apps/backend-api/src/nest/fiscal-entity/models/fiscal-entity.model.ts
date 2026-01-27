import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  InputType,
} from '@nestjs/graphql';

// Register your Drizzle Enum so GraphQL understands it
export enum FiscalEntityType {
  individual = 'individual',
  business = 'business',
  household = 'household',
}

registerEnumType(FiscalEntityType, { name: 'FiscalEntityType' });

@ObjectType()
export class FiscalEntity {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => FiscalEntityType)
  type: FiscalEntityType;

  @Field()
  country: string;

  @Field()
  province: string;

  @Field()
  userId: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@InputType()
export class FiscalEntityInput {
  @Field()
  name: string;
}
