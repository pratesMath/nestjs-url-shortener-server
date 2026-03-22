import { Token } from '@auth-module/domain/entities/token';
import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';

interface PasswordRecoverUseCaseInput {
	email: string;
}

type PasswordRecoverUseCaseOutput = Either<ResourceNotFoundError, { token: Token }>;

export class PasswordRecoverUseCase {
	constructor(
		private tokensRepository: TokensRepository,
		private usersRepository: UsersRepository
	) {}
	async execute({ email }: PasswordRecoverUseCaseInput): Promise<PasswordRecoverUseCaseOutput> {
		const foundUser = await this.usersRepository.findByEmail(email);

		if (!foundUser) {
			return left(new ResourceNotFoundError());
		}

		const token = Token.create({
			userId: foundUser.id,
			tokenType: 'PASSWORD_RECOVER',
		});

		await this.tokensRepository.create(token);

		return right({ token });
	}
}
