import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { CacheRepository } from '@config/cache/cache-repository';
import { DrizzleOrmProvider, type DrizzleSchema } from '@config/database/drizzle/drizzle.provider';
import * as schema from '@config/database/drizzle/schema';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DrizzleUserMapper } from '../mappers/drizzle-user-mapper';

@Injectable()
export class DrizzleUsersRepository implements UsersRepository {
	private readonly logger = new Logger(DrizzleUsersRepository.name);

	constructor(
		private readonly cache: CacheRepository,
		@Inject(DrizzleOrmProvider)
		private readonly db: DrizzleSchema
	) {}

	async passwordReset(userId: string, newPassword: string, tokenCode: number): Promise<void> {
		await this.db.transaction(async tx => {
			await tx
				.update(schema.users)
				.set({ password: newPassword })
				.where(eq(schema.users.id, userId));
			await tx
				.delete(schema.tokens)
				.where(and(eq(schema.tokens.code, tokenCode), eq(schema.tokens.userId, userId)));
		});
	}

	async save(user: User): Promise<void> {
		const data = DrizzleUserMapper.toPersistence(user);

		await this.db.update(schema.users).set(data).where(eq(schema.users.id, data.id));

		await Promise.allSettled([
			this.cache.delete(`user:${data.id}:data`),
			this.cache.delete(`user:${data.email}:data`),
		]);
	}

	async findById(id: string): Promise<User | null> {
		const cacheHit = await this.cache.get(`user:${id}:data`);

		if (cacheHit) {
			const cachedData = JSON.parse(cacheHit);
			this.logger.log({
				message: `[Redis] cached data for user id: ${id}`,
				cachedData,
			});

			return DrizzleUserMapper.toDomain(cachedData);
		}

		const data = await this.db.query.users.findFirst({
			where: eq(schema.users.id, id),
		});

		if (!data) {
			return null;
		}

		await this.cache.set(`user:${id}:data`, JSON.stringify(data));

		return DrizzleUserMapper.toDomain(data);
	}

	async findByEmail(email: string): Promise<User | null> {
		const cacheHit = await this.cache.get(`user:${email}:data`);

		if (cacheHit) {
			const cachedData = JSON.parse(cacheHit);
			this.logger.log({
				message: `[Redis] cached data for user email: ${email}`,
				cachedData,
			});
			return DrizzleUserMapper.toDomain(cachedData);
		}

		const data = await this.db.query.users.findFirst({
			where: eq(schema.users.email, email),
		});

		if (!data) {
			return null;
		}

		await this.cache.set(`user:${email}:data`, JSON.stringify(data));

		return DrizzleUserMapper.toDomain(data);
	}

	async create(user: User): Promise<void> {
		const data = DrizzleUserMapper.toPersistence(user);

		await this.db.insert(schema.users).values(data);
	}
}
