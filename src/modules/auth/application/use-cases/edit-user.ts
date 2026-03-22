import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

interface EditUserUseCaseInput {
	currentUserId: string;
	username: string;
	passwordToConfirm: string;
}

type EditUserUseCaseOutput = Either<ResourceNotFoundError, { user: User }>;

export class EditUserUseCase {
	constructor(
		private usersRepository: UsersRepository,
		private hashComparer: HashComparer
	) {}

	async execute({
		currentUserId,
		username,
		passwordToConfirm,
	}: EditUserUseCaseInput): Promise<EditUserUseCaseOutput> {
		const user = await this.usersRepository.findById(currentUserId);

		if (!user) {
			return left(new ResourceNotFoundError());
		}

		const isPasswordValid = await this.hashComparer.compare(passwordToConfirm, user.password);

		if (!isPasswordValid) {
			return left(new WrongCredentialsError());
		}

		user.username = username;

		await this.usersRepository.save(user);

		return right({ user });
	}
}
