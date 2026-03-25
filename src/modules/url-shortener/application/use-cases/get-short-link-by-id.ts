import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { GetShortLinkByIdInputDTO, GetShortLinkByIdOutputDTO } from '../dtos';

export type GetShortLinkByIdUseCaseProps = GetShortLinkByIdInputDTO & { currentUserId: string };

type GetShortLinkByIdUseCaseOutput = Either<
	ResourceNotFoundError | NotAllowedError,
	GetShortLinkByIdOutputDTO
>;

@Injectable()
export class GetShortLinkByIdUseCase {
	private readonly logger = new Logger(GetShortLinkByIdUseCase.name);

	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
		shortLinkId,
	}: GetShortLinkByIdUseCaseProps): Promise<GetShortLinkByIdUseCaseOutput> {
		this.logger.log({
			message: 'Fetching short link details.',
			shortLinkId,
			userId: currentUserId,
		});

		const shortLink = await this.shortLinksRepository.findById(shortLinkId);

		if (!shortLink) {
			this.logger.warn({
				message: 'Fetch failed: short link not found.',
				shortLinkId,
				userId: currentUserId,
			});
			return left(new ResourceNotFoundError());
		}

		if (!shortLink.userId) {
			this.logger.warn({
				message: 'Fetch failed: cannot access anonymous link details via authenticated route.',
				shortLinkId,
				userId: currentUserId,
			});
			return left(new NotAllowedError());
		}

		if (!shortLink.userId.equals(new UniqueEntityID(currentUserId))) {
			this.logger.warn({
				message: 'Fetch failed: unauthorized access attempt to private link.',
				shortLinkId,
				ownerId: shortLink.userId.toString(),
				attemptedById: currentUserId,
			});
			return left(new NotAllowedError('Access another user data.'));
		}

		this.logger.log({
			message: 'Short link details fetched successfully.',
			shortLinkId,
			userId: currentUserId,
		});

		return right({ shortLink });
	}
}
