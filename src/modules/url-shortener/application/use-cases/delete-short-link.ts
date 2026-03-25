import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { DeleteShortLinkInputDTO, DeleteShortLinkOutputDTO } from '../dtos';
import { MalformedURLError } from '../errors/malformed-url-error';

export type DeleteShortLinkUseCaseProps = DeleteShortLinkInputDTO & { currentUserId: string };

type DeleteShortLinkUseCaseOutput = Either<
	ResourceNotFoundError | NotAllowedError | MalformedURLError,
	DeleteShortLinkOutputDTO
>;

@Injectable()
export class DeleteShortLinkUseCase {
	private readonly logger = new Logger(DeleteShortLinkUseCase.name);

	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
		shortLinkId,
	}: DeleteShortLinkUseCaseProps): Promise<DeleteShortLinkUseCaseOutput> {
		this.logger.log({
			message: 'Attempting to delete short link.',
			shortLinkId,
			userId: currentUserId,
		});

		const shortLink = await this.shortLinksRepository.findById(shortLinkId);

		if (!shortLink) {
			this.logger.warn({
				message: 'Delete failed: short link not found.',
				shortLinkId,
				userId: currentUserId,
			});
			return left(new ResourceNotFoundError());
		}

		if (!shortLink.userId) {
			this.logger.warn({
				message: 'Delete failed: unauthorized user attempt.',
				shortLinkId,
				ownerId: null,
				attemptedById: currentUserId,
			});
			return left(new NotAllowedError());
		}

		if (!shortLink.userId.equals(new UniqueEntityID(currentUserId))) {
			return left(new NotAllowedError('Delete another user data.'));
		}

		shortLink.deletedAt = new Date();

		await this.shortLinksRepository.delete(shortLink);

		this.logger.log({
			message: 'Short link deleted successfully.',
			shortLinkId,
			userId: currentUserId,
			originalUrl: shortLink.originalUrl,
		});

		return right(null);
	}
}
