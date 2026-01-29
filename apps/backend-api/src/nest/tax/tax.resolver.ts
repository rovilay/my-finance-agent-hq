import { Resolver, Query, Args } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxProjection } from './models/tax.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { ZodValidationPipe } from '../common/pipes/zod-validation.pipe';
import { taxYearSchema } from '@hq/validation-schema';

@Resolver()
@UseGuards(GqlAuthGuard)
export class TaxResolver {
  constructor(private readonly taxService: TaxService) {}

  @Query(() => TaxProjection)
  async getTaxProjection(
    @Args('entityId') entityId: string,
    @Args('taxYear', new ZodValidationPipe(taxYearSchema.optional()))
    taxYear?: string,
  ) {
    console.log(`[TaxResolver] Query received for Entity: ${entityId}`);
    return this.taxService.calculateProjection(entityId, taxYear ?? '2026');
  }
}
