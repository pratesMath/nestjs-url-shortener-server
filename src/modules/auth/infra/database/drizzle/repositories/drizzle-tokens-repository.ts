import { Token } from '@auth-module/domain/entities/token';
import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { DrizzleOrmProvider, type DrizzleSchema } from '@config/database/drizzle/drizzle.provider';
import * as schema from '@config/database/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DrizzleTokenMapper } from '../mappers/drizzle-token-mapper';

@Injectable()
export class DrizzleTokensRepository implements TokensRepository {
	constructor(
		@Inject(DrizzleOrmProvider)
		private readonly db: DrizzleSchema
	) {}

	async findByCode(code: number): Promise<Token | null> {
		const data = await this.db.query.tokens.findFirst({
			where: eq(schema.tokens.code, code),
		});

		if (!data) {
			return null;
		}

		return DrizzleTokenMapper.toDomain(data);
	}

	async create(token: Token): Promise<void> {
		const data = DrizzleTokenMapper.toPersistence(token);

		await this.db.insert(schema.tokens).values(data);
	}
}
