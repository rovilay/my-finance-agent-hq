import { Module } from '@nestjs/common';
import { TaxResolver } from './tax.resolver';
import { TaxService } from './tax.service';

@Module({
  imports: [],
  providers: [TaxResolver, TaxService],
  exports: [TaxService],
})
export class TaxModule {}
