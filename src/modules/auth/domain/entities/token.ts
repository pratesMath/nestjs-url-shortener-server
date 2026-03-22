import { BaseEntity } from '@shared/entities/base-entity';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { Optional } from '@shared/types/optional';
import { ExpiresIn } from '../value-objects/expires-in';
import { UniqueCodeToken } from '../value-objects/unique-code-token';

export enum TokenType {
	PASSWORD_RECOVER = 'PASSWORD_RECOVER',
}

export interface TokenProps {
	userId: UniqueEntityID;
	tokenType: TokenType;
	code: UniqueCodeToken;
	expiresIn: ExpiresIn;
	createdAt: Date;
}

export class Token extends BaseEntity<TokenProps> {
	get userId() {
		return this.props.userId;
	}

	get tokenType() {
		return this.props.tokenType;
	}

	get code() {
		return this.props.code;
	}

	get expiresIn() {
		return this.props.expiresIn;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	static create(
		props: Optional<TokenProps, 'createdAt' | 'expiresIn' | 'code'>,
		id?: UniqueEntityID
	) {
		const token = new Token(
			{
				...props,
				createdAt: props.createdAt ?? new Date(),
				expiresIn: props.expiresIn ?? ExpiresIn.create('THIRTY_MINUTES'),
				code: UniqueCodeToken.create(),
			},
			id
		);

		return token;
	}
}
