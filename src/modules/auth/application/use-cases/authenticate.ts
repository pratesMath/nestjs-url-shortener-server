import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Encrypter } from '@auth-module/domain/services/cryptography/encrypter';
import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { Either, left, right } from '@shared/either';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

interface AuthenticateUseCaseInput {
	email: string;
	password: string;
}

type AuthenticateUseCaseOutput = Either<WrongCredentialsError, { accessToken: string }>;

export class AuthenticateUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hashComparer: HashComparer,
		private encrypter: Encrypter
	) {}

	async execute({ email, password }: AuthenticateUseCaseInput): Promise<AuthenticateUseCaseOutput> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return left(new WrongCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(password, user.password);

		if (!isPasswordValid) {
			return left(new WrongCredentialsError());
		}

		const accessToken = await this.encrypter.encrypt({
			sub: user.id.toString(),
		});

		return right({
			accessToken,
		});
	}
}
