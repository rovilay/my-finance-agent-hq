import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TaxService } from '../tax/tax.service';
import { AiResolver } from './ai.resolver';
import { DocumentModule } from '../document/document.module';
import { ExtractionWorkflow } from './workflows/extraction.workflow';
import { AiOrchestrator } from './ai.orchestrator';

@Module({
  imports: [TaxService, forwardRef(() => DocumentModule)],
  providers: [AiService, AiResolver, ExtractionWorkflow, AiOrchestrator],
  exports: [ExtractionWorkflow, AiService, AiOrchestrator],
})
export class AiModule {}
