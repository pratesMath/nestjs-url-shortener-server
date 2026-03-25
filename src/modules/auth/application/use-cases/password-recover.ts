import { Token, TokenType } from '@auth-module/domain/entities/token';
import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { PasswordRecoverInputDTO, PasswordRecoverOutputDTO } from '../dtos';

type PasswordRecoverUseCaseOutput = Either<ResourceNotFoundError, PasswordRecoverOutputDTO>;

@Injectable()
export class PasswordRecoverUseCase {
	private readonly logger = new Logger(PasswordRecoverUseCase.name);

	constructor(
		private readonly tokensRepository: TokensRepository,
		private readonly usersRepository: UsersRepository
	) {}
	async execute({ email }: PasswordRecoverInputDTO): Promise<PasswordRecoverUseCaseOutput> {
		this.logger.log({
			message: 'Password recovery requested.',
			email,
		});

		const foundUser = await this.usersRepository.findByEmail(email);

		if (!foundUser) {
			this.logger.warn({
				message: 'Password recovery failed: email not found.',
				email,
			});
			return left(new ResourceNotFoundError());
		}

		const token = Token.create({
			userId: foundUser.id,
			tokenType: TokenType.PASSWORD_RECOVER,
		});

		await this.tokensRepository.create(token);

		this.logger.log({
			message: 'Recovery token created successfully.',
			userId: foundUser.id.toString(),
			tokenId: token.id.toString(),
		});

		return right({ token });
	}
}
