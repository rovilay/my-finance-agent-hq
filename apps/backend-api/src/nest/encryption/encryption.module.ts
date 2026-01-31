import { KmsService } from '@hq/encryption';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type EnvConfig } from 'src/config/env';

@Module({
  providers: [
    {
      provide: KmsService,
      useFactory: (configService: ConfigService) => {
        const config = configService.get<EnvConfig>('envConfig')!;
        return new KmsService(
          config.GCP_KMS_PROJECT_ID,
          config.GCP_KMS_LOCATION_ID,
          config.GCP_KMS_KEY_RING_ID,
          config.GCP_KMS_KEY_ID,
        );
      },
      inject: [ConfigService],
    },
  ],
  exports: [KmsService],
})
export class EncryptionModule {}
