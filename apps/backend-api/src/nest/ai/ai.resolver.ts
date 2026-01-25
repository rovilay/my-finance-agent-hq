import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TaxService } from '../tax/tax.service';
import { AiService } from './ai.service';

@Resolver()
export class AiResolver {
  constructor(
    private readonly aiService: AiService,
    private readonly taxService: TaxService,
  ) {}

  @Mutation(() => String)
  @Mutation(() => String)
  async askAdvisor(
    @Args('question') question: string,
    @Args('salary') salary: number,
    @Args('userId') userId: string,
  ) {
    // 1. Get the deterministic "Ground Truth" numbers
    const taxData = await this.taxService.getTaxProjection(salary, userId);

    // 2. Let the AI explain these numbers to the user
    return this.aiService.getAdvisorInsights(question, userId, taxData);
  }
}
