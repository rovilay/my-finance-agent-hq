import { Module } from '@nestjs/common';
import { OnboardingService } from './onboarding.service';
import { OnboardingResolver } from './onboarding.resolver';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  providers: [OnboardingService, OnboardingResolver],
  exports: [OnboardingService],
})
export class OnboardingModule {}
