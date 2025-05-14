import { Cache } from 'cache-manager';
import { RedisStore } from 'cache-manager-redis-store';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, type OnModuleDestroy } from '@nestjs/common';

interface RedisCache extends Cache {
	store: RedisStore;
}

interface RedisClient {
	quit(): Promise<void>;
}

@Injectable()
export class CacheService implements OnModuleDestroy {
	constructor(@Inject(CACHE_MANAGER) private readonly cache: RedisCache) {}

	async get<T>(key: string): Promise<T | null> {
		return await this.cache.get<T>(key);
	}

	async set(key: string, value: any, ttl?: number): Promise<void> {
		await this.cache.set(key, value, ttl);
	}

	async del(key: string): Promise<void> {
		await this.cache.del(key);
	}

	async reset(): Promise<void> {
		await this.cache.clear();
	}

	async onModuleDestroy() {
		const redisClient = this.cache.store.getClient() as unknown as RedisClient;
		await redisClient.quit();
	}
}
