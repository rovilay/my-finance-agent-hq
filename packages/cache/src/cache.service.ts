import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import Redis from 'ioredis';

export interface CacheConfig {
  host: string;
  port: number;
  password?: string;
  tlsEnabled?: boolean;
}

export const CACHE_CONFIG = 'CACHE_CONFIG';

@Injectable()
export class CacheService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(@Inject(CACHE_CONFIG) private readonly config: CacheConfig) {}

  async onModuleInit() {
    const redisConfig: any = {
      host: this.config.host,
      port: this.config.port,
      password: this.config.password,
      maxRetriesPerRequest: 3,
      enableReadyCheck: false,
      connectTimeout: 10000, // Increase timeout to 10s
      retryStrategy: (times: number) => {
        if (times > 3) {
          return null; // Stop retrying
        }
        const delay = Math.min(times * 100, 3000);
        return delay;
      },
    };

    // Use TLS if explicitly enabled
    if (this.config.tlsEnabled) {
      redisConfig.tls = {
        rejectUnauthorized: false,
      };
    }

    this.client = new Redis(redisConfig);

    this.client.on('connect', () => {
      console.log('[CacheService] ✅ Connected to Redis');
    });

    this.client.on('error', (err: Error) => {
      console.error('[CacheService] ❌ Redis error:', err);
    });
  }

  async onModuleDestroy() {
    await this.client.quit();
    console.log('[CacheService] Disconnected from Redis');
  }

  /**
   * Get a value from cache
   */
  get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  /**
   * Set a value in cache with optional TTL (in seconds)
   */
  async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.setex(key, ttlSeconds, value);
    } else {
      await this.client.set(key, value);
    }
  }

  /**
   * Delete a key from cache
   */
  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  /**
   * Delete multiple keys matching a pattern
   */
  async delPattern(pattern: string): Promise<void> {
    const keys = await this.client.keys(pattern);
    if (keys.length > 0) {
      await this.client.del(...keys);
    }
  }

  /**
   * Check if a key exists
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result === 1;
  }

  /**
   * Set TTL on an existing key (in seconds)
   */
  async expire(key: string, ttlSeconds: number): Promise<void> {
    await this.client.expire(key, ttlSeconds);
  }

  /**
   * Get the Redis client for advanced operations
   */
  getClient(): Redis {
    return this.client;
  }
}
