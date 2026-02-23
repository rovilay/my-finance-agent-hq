import { Module, DynamicModule, Global } from '@nestjs/common';
import { CacheService, CacheConfig, CACHE_CONFIG } from './cache.service';

@Global()
@Module({})
export class CacheModule {
  static forRoot(config: CacheConfig): DynamicModule {
    return {
      module: CacheModule,
      providers: [
        {
          provide: CACHE_CONFIG,
          useValue: config,
        },
        CacheService,
      ],
      exports: [CacheService],
    };
  }
}
