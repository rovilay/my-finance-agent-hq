import { Module } from '@nestjs/common';
import { DocumentResolver } from './document.resolver';
import { DocumentService } from './document.service';
import { GcsService } from './gcs.service';
import { AiModule } from '../ai/ai.module';
import { EncryptionModule } from '../encryption/encryption.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [EncryptionModule, AuthModule, AiModule],
  providers: [GcsService, DocumentResolver, DocumentService],
  exports: [DocumentService, GcsService],
})
export class DocumentModule {}
