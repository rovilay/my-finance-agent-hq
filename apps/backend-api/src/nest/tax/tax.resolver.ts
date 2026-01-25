import { Query, Resolver, Args, Float } from '@nestjs/graphql';
import { Tax } from './models/tax.model';
import { TaxService } from './tax.service';

@Resolver()
export class TaxResolver {
  constructor(private readonly taxService: TaxService) {}

  @Query(() => Tax)
  async getTaxProjection(
    @Args('annualSalary', { type: () => Float }) annualSalary: number,
    @Args('userId', { type: () => String }) userId: string,
  ) {
    return this.taxService.getTaxProjection(annualSalary, userId);
  }
}
