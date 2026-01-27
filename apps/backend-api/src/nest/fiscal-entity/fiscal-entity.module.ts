import { Module } from '@nestjs/common';
import { FiscalEntityService } from './fiscal-entity.service';
import { AuthModule } from '../auth/auth.module';
import { FiscalEntityResolver } from './fiscal-entity.resolver';

@Module({
  imports: [AuthModule],
  providers: [FiscalEntityService, FiscalEntityResolver],
  exports: [FiscalEntityService],
})
export class FiscalEntityModule {}
