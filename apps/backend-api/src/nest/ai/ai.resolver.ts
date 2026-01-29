import { Args, Mutation, Resolver, ID } from '@nestjs/graphql';
import { AiService } from './ai.service';

@Resolver()
export class AiResolver {
  constructor(private readonly aiService: AiService) {}

  @Mutation(() => Boolean)
  async verifyDocument(
    @Args('documentId', { type: () => ID }) documentId: string,
    @Args('approved') approved: boolean,
    @Args('shouldKeepFile') shouldKeepFile: boolean,
  ): Promise<boolean> {
    console.log(`[AiResolver] 🔘 Resuming workflow for Doc: ${documentId}`);

    return this.aiService.verifyDocument(documentId, approved, shouldKeepFile);
  }
}
