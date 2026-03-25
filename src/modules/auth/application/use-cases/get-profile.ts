import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { GetProfileInputDTO, GetProfileOutputDTO } from '../dtos';

type GetProfileUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, GetProfileOutputDTO>;

@Injectable()
export class GetProfileUseCase {
	private readonly logger = new Logger(GetProfileUseCase.name);

	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ currentUserId }: GetProfileInputDTO): Promise<GetProfileUseCaseOutput> {
		this.logger.warn({
			message: 'Profile fetch failed: user not found.',
			userId: currentUserId,
		});

		const user = await this.usersRepository.findById(currentUserId);

		if (!user) {
			this.logger.warn({
				message: 'Profile fetch failed: unauthorized access attempt.',
				authenticatedUserId: currentUserId,
			});
			return left(new ResourceNotFoundError());
		}

		if (currentUserId !== user.id.toString()) {
			this.logger.warn({
				message: 'Profile fetch failed: unauthorized access attempt.',
				requestedId: user.id.toString(),
				authenticatedUserId: currentUserId,
			});
			return left(new NotAllowedError());
		}

		this.logger.log({
			message: 'Profile fetched successfully.',
			userId: currentUserId,
		});

		return right({ profile: { user } });
	}
}
