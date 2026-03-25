import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { EditUserInputDTO, EditUserOutputDTO } from '../dtos';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';

type EditUserUseCaseOutput = Either<ResourceNotFoundError, EditUserOutputDTO>;

export type EditUserUseCaseProps = EditUserInputDTO & { currentUserId: string };

@Injectable()
export class EditUserUseCase {
	private readonly logger = new Logger(EditUserUseCase.name);

	constructor(
		private readonly usersRepository: UsersRepository,
		private readonly hashComparer: HashComparer
	) {}

	async execute({
		currentUserId,
		username,
		passwordToConfirm,
	}: EditUserUseCaseProps): Promise<EditUserUseCaseOutput> {
		this.logger.log({
			message: 'Starting user profile update.',
			userId: currentUserId,
			newUsername: username,
		});

		const user = await this.usersRepository.findById(currentUserId);

		if (!user) {
			this.logger.warn({
				message: 'Update failed: user not found.',
				userId: currentUserId,
			});
			return left(new ResourceNotFoundError());
		}

		const isPasswordValid = await this.hashComparer.compare(user.password, passwordToConfirm);

		if (isPasswordValid !== true) {
			this.logger.warn({
				message: 'Update failed: invalid confirmation password.',
				userId: currentUserId,
			});
			return left(new WrongCredentialsError());
		}

		user.username = username;

		await this.usersRepository.save(user);

		this.logger.log({
			message: 'User profile updated successfully.',
			userId: currentUserId,
		});

		return right({ user });
	}
}
