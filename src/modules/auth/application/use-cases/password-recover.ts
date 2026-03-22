import { Token, TokenType } from '@auth-module/domain/entities/token';
import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { PasswordRecoverInputDTO, PasswordRecoverOutputDTO } from '../dtos';

type PasswordRecoverUseCaseOutput = Either<ResourceNotFoundError, PasswordRecoverOutputDTO>;

export class PasswordRecoverUseCase {
	constructor(
		private readonly tokensRepository: TokensRepository,
		private readonly usersRepository: UsersRepository
	) {}
	async execute({ email }: PasswordRecoverInputDTO): Promise<PasswordRecoverUseCaseOutput> {
		const foundUser = await this.usersRepository.findByEmail(email);

		if (!foundUser) {
			return left(new ResourceNotFoundError());
		}

		const token = Token.create({
			userId: foundUser.id,
			tokenType: TokenType.PASSWORD_RECOVER,
		});

		await this.tokensRepository.create(token);

		return right({ token });
	}
}
