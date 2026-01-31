import {
  Resolver,
  Mutation,
  Args,
  ID,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { DocumentService } from './document.service';
import { Document, DocumentInput, PaginatedDocument } from './models/document.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AiOrchestrator } from '../ai/ai.orchestrator';
import { User } from '../auth/models/user.model';
import { PaginationInput } from '../common/models';

@Resolver(() => Document)
@UseGuards(GqlAuthGuard)
export class DocumentResolver {
  constructor(
    private readonly documentService: DocumentService,
    private readonly aiOrchestrator: AiOrchestrator,
  ) {}
  @Mutation(() => Document)
  async uploadDocument(
    @CurrentUser() user: User,
    @Args('input') input: DocumentInput,
  ) {
    // 1. Secure the file in the Vault (GCS + Encrypted DB Record)
    const doc = await this.documentService.handleUpload(input);

    // 2. Hand off to the Orchestrator to start the "Brain" work
    // We don't await this because we want the user to get their "Upload Success" UI immediately
    void this.aiOrchestrator.initiateExtraction(doc.id);

    return doc;
  }

  @Mutation(() => Document)
  async verifyAndFinalize(
    @Args('documentId', { type: () => ID }) documentId: string,
    @Args('shouldKeep', { type: () => Boolean }) shouldKeep: boolean,
  ) {
    console.log(
      `[DocumentResolver] Finalizing doc ${documentId}. Keep: ${shouldKeep}`,
    );
    return this.documentService.finalize(documentId, shouldKeep);
  }

  @Query(() => PaginatedDocument, { name: 'documentsByEntity' })
  async getDocumentsByEntity(
    @CurrentUser() user: User,
    @Args('entityId', { type: () => ID }) entityId: string,
    @Args('pagination', { nullable: true }) pagination?: PaginationInput,
  ): Promise<PaginatedDocument> {
    const docs = await this.documentService.documentsByEntityId(entityId, user.id, pagination ?? {});
    return docs;
  }

  @Query(() => Document, { name: 'document' })
  async getDocument(
    @CurrentUser() user: User,
    @Args('id', { type: () => ID }) id: string,
  ): Promise<Document> {
    const doc = await this.documentService.findDocOrThrow(id, user.id);
    return doc;
  }

  @ResolveField(() => String, { nullable: true })
  async decryptedData(@Parent() document: Document) {
    return this.documentService.decryptDocumentData(document);
  }
}
