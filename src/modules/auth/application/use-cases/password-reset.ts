import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { dateFns } from '@shared/libs/date-fns';
import { PasswordResetInputDTO, PasswordResetOutputDTO } from '../dtos';
import { ExpiredTokenError } from '../errors/expired-token-error';

type PasswordResetUseCaseOutput = Either<ResourceNotFoundError, PasswordResetOutputDTO>;

@Injectable()
export class PasswordResetUseCase {
	private readonly logger = new Logger(PasswordResetUseCase.name);

	constructor(
		private readonly tokensRepository: TokensRepository,
		private readonly usersRepository: UsersRepository,
		private readonly hashGenerator: HashGenerator
	) {}
	async execute({ code, newPassword }: PasswordResetInputDTO): Promise<PasswordResetUseCaseOutput> {
		this.logger.log({
			message: 'Attempting to reset password.',
			code,
		});

		const foundToken = await this.tokensRepository.findByCode(code);

		if (!foundToken) {
			this.logger.warn({
				message: 'Password reset failed: token code not found.',
				code,
			});
			return left(new ResourceNotFoundError());
		}

		const expirationDate = new Date(foundToken.expiresIn.toString());
		const isTokenExpired = dateFns.isAfter(new Date(), expirationDate);

		if (isTokenExpired) {
			this.logger.warn({
				message: 'Password reset failed: token expired.',
				code,
				userId: foundToken.userId.toString(),
				expiredAt: expirationDate,
			});
			return left(new ExpiredTokenError(foundToken.code.toValue()));
		}

		const newHashedPassword = await this.hashGenerator.hash(newPassword);

		await this.usersRepository.passwordReset(foundToken.userId.toString(), newHashedPassword, code);

		this.logger.log({
			message: 'Password reset successful.',
			userId: foundToken.userId.toString(),
			code,
		});

		return right(null);
	}
}
