import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { GetProfileInputDTO, GetProfileOutputDTO } from '../dtos';

type GetProfileUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, GetProfileOutputDTO>;

@Injectable()
export class GetProfileUseCase {
	constructor(private readonly usersRepository: UsersRepository) {}

	async execute({ currentUserId }: GetProfileInputDTO): Promise<GetProfileUseCaseOutput> {
		const user = await this.usersRepository.findById(currentUserId);

		if (!user) {
			return left(new ResourceNotFoundError());
		}

		if (currentUserId !== user.id.toString()) {
			return left(new NotAllowedError());
		}

		return right({ profile: { user } });
	}
}
