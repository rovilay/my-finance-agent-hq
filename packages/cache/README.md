# @hq/cache

Shared caching infrastructure for the HQ workspace using Redis.

## Features

- **CacheService**: NestJS-ready cache client with lifecycle management
- **CacheModule**: Global module with `.forRoot()` configuration
- **Type-safe**: Full TypeScript support
- **Production-ready**: Connection retry strategy, error handling, logging

## Installation

This package is part of the HQ monorepo. Install dependencies:

```bash
pnpm install
```

## Usage

### 1. Configure Cache Module

Import and configure `CacheModule` in your app module:

```typescript
import { Module } from '@nestjs/common';
import { CacheModule } from '@hq/cache';

@Module({
  imports: [
    CacheModule.forRoot({
      host: 'localhost',
      port: 6379,
      password: 'optional-password',
    }),
  ],
})
export class AppModule {}
```

### 2. Inject CacheService

Use `CacheService` in any service:

```typescript
import { Injectable } from '@nestjs/common';
import { CacheService } from '@hq/cache';

@Injectable()
export class MyService {
  constructor(private readonly cache: CacheService) {}

  async cacheData(key: string, value: string, ttlSeconds = 300) {
    await this.cache.set(key, value, ttlSeconds);
  }

  async getCachedData(key: string): Promise<string | null> {
    return await this.cache.get(key);
  }

  async invalidateCache(key: string) {
    await this.cache.del(key);
  }
}
```

## API Reference

### CacheService Methods

- **`get(key: string): Promise<string | null>`** - Get value from cache
- **`set(key: string, value: string, ttlSeconds?: number): Promise<void>`** - Set value with optional TTL
- **`del(key: string): Promise<void>`** - Delete a key
- **`delPattern(pattern: string): Promise<void>`** - Delete keys matching pattern
- **`exists(key: string): Promise<boolean>`** - Check if key exists
- **`expire(key: string, ttlSeconds: number): Promise<void>`** - Set TTL on existing key
- **`getClient(): Redis`** - Get raw ioredis client for advanced operations

### CacheConfig Interface

```typescript
interface RedisConfig {
  host: string;
  port: number;
  password?: string;
}
```

## Redis Setup

### Development (Docker Compose)

Start Redis container:

```bash
docker-compose up redis -d
```

### Environment Variables

Configure your app's environment:

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

## Example: Financial Data Caching

```typescript
@Injectable()
export class AiService {
  private readonly CACHE_TTL_SECONDS = 5 * 60; // 5 minutes
  private readonly CACHE_KEY_PREFIX = 'financial-context:';

  constructor(private readonly cache: CacheService) {}

  private getCacheKey(entityId: string, taxYear?: string): string {
    return `${this.CACHE_KEY_PREFIX}${entityId}-${taxYear || 'current'}`;
  }

  async getFinancialContext(entityId: string, taxYear?: string) {
    // Check cache first
    const cacheKey = this.getCacheKey(entityId, taxYear);
    const cached = await this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    // Fetch fresh data
    const data = await this.fetchFinancialData(entityId, taxYear);

    // Cache with TTL
    await this.cache.set(cacheKey, data, this.CACHE_TTL_SECONDS);

    return data;
  }
}
```

## Benefits

- **Performance**: Reduced database queries with intelligent caching
- **Scalability**: Shared cache across multiple server instances
- **Persistence**: Cache survives server restarts (with Redis persistence)
- **Automatic Expiration**: Redis handles TTL expiration automatically
- **Production-Ready**: Connection retry, error handling, graceful shutdown

## Dependencies

- **ioredis**: ^5.4.2 - High-performance Redis client
- **@nestjs/common**: >=10.0.0 <12.0.0 - NestJS framework (peer dependency)
