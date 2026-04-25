import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: Redis;

  constructor(private configService: ConfigService) {}

  onModuleInit() {
    const redisUrl = this.configService.get<string>('REDIS_URL') || 'redis://localhost:6379';
    this.client = new Redis(redisUrl, {
      maxRetriesPerRequest: null,
    });
  }

  onModuleDestroy() {
    this.client.disconnect();
  }

  getClient(): Redis {
    return this.client;
  }

  // Geo-spatial helpers for high-concurrency location tracking
  async updateLocation(userId: string, lat: number, lng: number): Promise<void> {
    await this.client.geoadd('driver_locations', lng, lat, userId);
  }

  async findNearbyDrivers(lat: number, lng: number, radiusKm: number = 5): Promise<string[]> {
    return this.client.georadius('driver_locations', lng, lat, radiusKm, 'km');
  }

  async removeLocation(userId: string): Promise<void> {
    await this.client.zrem('driver_locations', userId);
  }

  // General caching helpers
  async set(key: string, value: any, ttlSeconds?: number): Promise<void> {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    if (ttlSeconds) {
      await this.client.set(key, stringValue, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, stringValue);
    }
  }

  async get<T>(key: string): Promise<T | null> {
    const value = await this.client.get(key);
    if (!value) return null;
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
}
