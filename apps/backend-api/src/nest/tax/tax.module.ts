import { Module } from '@nestjs/common';
import { TaxResolver } from './tax.resolver';
import { TaxService } from './tax.service';
import { AuthModule } from '../auth/auth.module';
import { FinancialEntryModule } from '../financial-entry/financial-entry.module';

@Module({
  imports: [AuthModule, FinancialEntryModule],
  providers: [TaxResolver, TaxService],
  exports: [TaxService],
})
export class TaxModule {}
