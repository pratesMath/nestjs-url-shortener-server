import { Token } from '@auth-module/domain/entities/token';
import { ExpiresIn, TimeToExpires } from '@auth-module/domain/value-objects/expires-in';
import { UniqueCodeToken } from '@auth-module/domain/value-objects/unique-code-token';
import { tokens } from '@config/database/drizzle/schema';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';

export class DrizzleTokenMapper {
	static toDomain(raw: typeof tokens.$inferSelect): Token {
		return Token.create(
			{
				userId: new UniqueEntityID(raw.userId),
				tokenType: raw.tokenType,
				code: UniqueCodeToken.create(raw.code),
				expiresIn: ExpiresIn.create(raw.expiresIn as TimeToExpires),
				createdAt: new Date(raw.createdAt),
			},
			new UniqueEntityID(raw.id)
		);
	}

	static toPersistence(token: Token): typeof tokens.$inferInsert {
		return {
			id: token.id.toString(),
			userId: token.userId.toString(),
			tokenType: token.tokenType,
			code: token.code.toValue(),
			expiresIn: new Date(token.expiresIn.toString()).toUTCString(),
			createdAt: token.createdAt.toUTCString(),
		};
	}
}
