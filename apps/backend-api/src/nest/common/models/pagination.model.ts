import { Type } from '@nestjs/common';
import { Field, ObjectType, Int, InputType, ArgsType } from '@nestjs/graphql';

export interface IPaginatedType<T> {
  items: T[];
  total: number;
  skip: number;
  take: number;
  hasMore: boolean;
}

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  take?: number = 10;
}

@InputType()
export class PaginationInput {
  @Field(() => Int, { nullable: true, defaultValue: 0 })
  skip?: number = 0;

  @Field(() => Int, { nullable: true, defaultValue: 10 })
  take?: number = 10;
}

export function Paginated<T>(classRef: Type<T>): Type<IPaginatedType<T>> {
  @ObjectType({ isAbstract: true })
  abstract class PaginatedType implements IPaginatedType<T> {
    @Field(() => [classRef], { nullable: false })
    items: T[];

    @Field(() => Int)
    total: number;

    @Field(() => Int)
    skip: number;

    @Field(() => Int)
    take: number;

    @Field(() => Boolean)
    hasMore: boolean;
  }

  return PaginatedType as Type<IPaginatedType<T>>;
}
