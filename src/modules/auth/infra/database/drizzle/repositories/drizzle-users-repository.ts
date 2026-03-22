import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { DrizzleOrmProvider, type DrizzleSchema } from '@config/database/drizzle/drizzle.provider';
import * as schema from '@config/database/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { DrizzleUserMapper } from '../mappers/drizzle-user-mapper';

@Injectable()
export class DrizzleUsersRepository implements UsersRepository {
	constructor(
		@Inject(DrizzleOrmProvider)
		private db: DrizzleSchema
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
	}

	async findById(id: string): Promise<User | null> {
		const data = await this.db.query.users.findFirst({
			where: eq(schema.users.id, id),
		});

		if (!data) {
			return null;
		}

		return DrizzleUserMapper.toDomain(data);
	}

	async findByEmail(email: string): Promise<User | null> {
		const data = await this.db.query.users.findFirst({
			where: eq(schema.users.email, email),
		});

		if (!data) {
			return null;
		}

		return DrizzleUserMapper.toDomain(data);
	}

	async create(user: User): Promise<void> {
		const data = DrizzleUserMapper.toPersistence(user);

		await this.db.insert(schema.users).values(data);
	}
}
