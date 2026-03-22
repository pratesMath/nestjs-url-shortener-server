import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { Either, left, right } from '@shared/either';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';

interface GetProfileUseCaseInput {
	currentUserId: string;
}

type GetProfileUseCaseOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	{ profile: { user: User } }
>;

export class GetProfileUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ currentUserId }: GetProfileUseCaseInput): Promise<GetProfileUseCaseOutput> {
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
