import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { dateFns } from '@shared/libs/date-fns';
import { ExpiredTokenError } from '../errors/expired-token-error';

interface PasswordResetUseCaseInput {
	code: number;
	password: string;
}

type PasswordResetUseCaseOutput = Either<ResourceNotFoundError, null>;

export class PasswordResetUseCase {
	constructor(
		private tokensRepository: TokensRepository,
		private usersRepository: UsersRepository,
		private hashGenerator: HashGenerator
	) {}
	async execute({
		code,
		password,
	}: PasswordResetUseCaseInput): Promise<PasswordResetUseCaseOutput> {
		const foundToken = await this.tokensRepository.findByCode(code);

		if (!foundToken) {
			return left(new ResourceNotFoundError());
		}

		const expirationDate = new Date(foundToken.expiresIn.toString());
		const isTokenExpired = dateFns.isAfter(new Date(), expirationDate);

		if (isTokenExpired) {
			return left(new ExpiredTokenError(foundToken.code.toValue()));
		}

		const newHashedPassword = await this.hashGenerator.hash(password);

		await this.usersRepository.passwordReset(foundToken.userId.toString(), newHashedPassword, code);

		return right(null);
	}
}
