import { Module } from '@nestjs/common';
import { TaxResolver } from './tax.resolver';
import { TaxService } from './tax.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [TaxResolver, TaxService],
  exports: [TaxService],
})
export class TaxModule {}
