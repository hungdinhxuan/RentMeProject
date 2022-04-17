import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisClientType } from '@node-redis/client';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private readonly redisClient: RedisClientType;
  constructor(private readonly configService: ConfigService) {
    this.redisClient = createClient({
      url: this.configService.get<string>('REDIS_URL'),
    });
    this.connect();
  }

  public getRedisClient() {
    return this.redisClient;
  }

  async set(key: string, value: string, expireTime: number = -1) {
    await this.redisClient.set(key, value);
    if (expireTime > 0) {
      await this.redisClient.expire(key, expireTime);
    }
  }

  async get(key: string) {
    return await this.redisClient.get(key);
  }

  async connect() {
    try {
      await this.redisClient.connect();
      console.log('Redis Client Connected');
    } catch (error) {
      console.log('🚀 ~ file: redis.util.ts ~ line 12 ~ error', error);
    }
  }
}
