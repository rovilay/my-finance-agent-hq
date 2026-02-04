import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiResolver } from './ai.resolver';
import { DocumentModule } from '../document/document.module';
import { ExtractionWorkflow } from './workflows/extraction.workflow';
import { AiOrchestrator } from './ai.orchestrator';
import { DatabaseModule } from '../database/database.module';
import { GeminiService } from './gemini.service';
import { EncryptionModule } from '../encryption/encryption.module';

@Module({
  imports: [EncryptionModule, DatabaseModule, forwardRef(() => DocumentModule)],
  providers: [
    GeminiService,
    AiService,
    AiResolver,
    ExtractionWorkflow,
    AiOrchestrator,
  ],
  exports: [ExtractionWorkflow, AiService, AiOrchestrator],
})
export class AiModule {}
