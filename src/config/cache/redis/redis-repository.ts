import { Injectable } from '@nestjs/common';
import { CacheRepository } from '../cache-repository';
import { RedisService } from './redis.service';

@Injectable()
export class RedisCacheRepository implements CacheRepository {
	constructor(private redis: RedisService) {}

	async set(key: string, value: string): Promise<void> {
		const threeMinutes = 60 * 3;
		await this.redis.set(key, value, 'EX', threeMinutes);
	}

	get(key: string): Promise<string | null> {
		return this.redis.get(key);
	}

	async delete(key: string): Promise<void> {
		await this.redis.del(key);
	}
}
