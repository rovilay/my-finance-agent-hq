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
import {
  Document,
  DocumentStatus,
  PaginatedDocument,
} from './models/document.model';
import { GqlAuthGuard } from '../auth/guards/gql-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/models/user.model';
import { PaginationInput } from '../common/models';

@Resolver(() => Document)
@UseGuards(GqlAuthGuard)
export class DocumentResolver {
  constructor(private readonly documentService: DocumentService) {}
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
    @Args('status', { nullable: true }) status?: DocumentStatus,
  ): Promise<PaginatedDocument> {
    const docs = await this.documentService.documentsByEntityId(
      entityId,
      user.id,
      pagination ?? {},
      status,
    );
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
