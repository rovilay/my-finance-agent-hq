import { forwardRef, Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { AiResolver } from './ai.resolver';
import { AiController } from './ai.controller';
import { DocumentModule } from '../document/document.module';
import { ExtractionWorkflow } from './workflows/extraction.workflow';
import { AiOrchestrator } from './ai.orchestrator';
import { DatabaseModule } from '../database/database.module';
import { GeminiService } from './gemini.service';
import { EncryptionModule } from '../encryption/encryption.module';
import { AuthModule } from '../auth/auth.module';
import { TaxModule } from '../tax/tax.module';
import { FinancialEntryModule } from '../financial-entry/financial-entry.module';
import { CacheModule } from '@hq/cache';
import { envConfig } from 'src/config/env';

@Module({
  imports: [
    EncryptionModule,
    DatabaseModule,
    AuthModule,
    CacheModule.forRoot({
      host: envConfig().REDIS_HOST,
      port: envConfig().REDIS_PORT,
      password: envConfig().REDIS_PASSWORD,
      tlsEnabled: ['staging', 'production'].includes(envConfig().NODE_ENV),
    }),
    forwardRef(() => TaxModule),
    forwardRef(() => FinancialEntryModule),
    forwardRef(() => DocumentModule),
  ],
  controllers: [AiController],
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
