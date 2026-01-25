import { Module } from '@nestjs/common';
import { AiService } from './ai.service';
import { TaxService } from '../tax/tax.service';
import { AiResolver } from './ai.resolver';

@Module({
  imports: [TaxService],
  providers: [AiService, AiResolver],
  exports: [],
})
export class AiModule {}
