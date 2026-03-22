import { Token, TokenProps } from '@auth-module/domain/entities/token';
import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';

export function makeToken(override: Partial<TokenProps> = {}, id?: UniqueEntityID) {
	const token = Token.create(
		{
			userId: new UniqueEntityID(faker.string.uuid()),
			tokenType: override.tokenType ?? 'PASSWORD_RECOVER',
			...override,
		},
		id
	);

	return token;
}
