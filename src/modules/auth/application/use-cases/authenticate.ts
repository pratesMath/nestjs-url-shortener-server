import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Encrypter } from '@auth-module/domain/services/cryptography/encrypter';
import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { AuthenticateInputDTO, AuthenticateOutputDTO } from '../dtos';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

type AuthenticateUseCaseOutput = Either<WrongCredentialsError, AuthenticateOutputDTO>;

@Injectable()
export class AuthenticateUseCase {
	private readonly logger = new Logger(AuthenticateUseCase.name);

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashComparer: HashComparer,
		private readonly encrypter: Encrypter
	) {}

	async execute({ email, password }: AuthenticateInputDTO): Promise<AuthenticateUseCaseOutput> {
		this.logger.log({ message: 'Attempting to authenticate user.', email });
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			this.logger.warn({ message: 'Authentication failed: user not found.', email });
			return left(new WrongCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(user.password, password);

		if (!isPasswordValid) {
			this.logger.warn({
				message: 'Authentication failed: invalid password.',
				userId: user.id.toString(),
				email,
			});
			return left(new WrongCredentialsError());
		}

		const { accessToken } = await this.encrypter.encrypt({
			sub: user.id.toString(),
		});

		this.logger.log({
			message: 'User authenticated successfully.',
			userId: user.id.toString(),
		});

		return right({
			accessToken,
		});
	}
}
