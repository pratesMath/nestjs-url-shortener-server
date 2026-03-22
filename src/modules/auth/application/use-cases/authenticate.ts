import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Encrypter } from '@auth-module/domain/services/cryptography/encrypter';
import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { Either, left, right } from '@shared/either';
import { AuthenticateInputDTO, AuthenticateOutputDTO } from '../dtos';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

type AuthenticateUseCaseOutput = Either<WrongCredentialsError, AuthenticateOutputDTO>;

export class AuthenticateUseCase {
	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashComparer: HashComparer,
		private readonly encrypter: Encrypter
	) {}

	async execute({ email, password }: AuthenticateInputDTO): Promise<AuthenticateUseCaseOutput> {
		const user = await this.usersRepository.findByEmail(email);

		if (!user) {
			return left(new WrongCredentialsError());
		}

		const isPasswordValid = await this.hashComparer.compare(password, user.password);

		if (!isPasswordValid) {
			return left(new WrongCredentialsError());
		}

		const { accessToken } = await this.encrypter.encrypt({
			sub: user.id.toString(),
		});

		return right({
			accessToken,
		});
	}
}
