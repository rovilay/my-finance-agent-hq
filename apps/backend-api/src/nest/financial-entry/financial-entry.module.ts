import { Module } from '@nestjs/common';
import { FinancialEntryService } from './financial-entry.service';
import { FinancialEntryResolver } from './financial-entry.resolver';
import { AuthModule } from '../auth/auth.module';
import { AiModule } from '../ai/ai.module';
import { DocumentModule } from '../document/document.module';
import { EncryptionModule } from '../encryption/encryption.module';

@Module({
  imports: [AuthModule, AiModule, DocumentModule, EncryptionModule],
  providers: [FinancialEntryResolver, FinancialEntryService],
  exports: [FinancialEntryService],
})
export class FinancialEntryModule {}
