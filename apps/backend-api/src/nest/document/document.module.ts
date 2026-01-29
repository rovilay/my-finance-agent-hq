import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { GcsService } from './gcs.service';

@Module({
  imports: [],
  providers: [GcsService, DocumentResolver, DocumentService],
  exports: [DocumentService, GcsService],
})
export class DocumentModule {}
