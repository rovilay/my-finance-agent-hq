import { Module } from '@nestjs/common';
import { FinancialEntryService } from './financial-entry.service';
import { FinancialEntryResolver } from './financial-entry.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [FinancialEntryResolver, FinancialEntryService],
  exports: [FinancialEntryService],
})
export class FinancialEntryModule {}
