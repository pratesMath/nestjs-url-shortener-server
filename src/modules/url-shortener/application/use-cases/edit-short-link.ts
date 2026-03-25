import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { ShortUrl } from '../../domain/value-objects/short-url';
import { EditShortLinkInputDTO, EditShortLinkOutputDTO } from '../dtos';
import { MalformedURLError } from '../errors/malformed-url-error';

export type EditShortLinkUseCaseProps = EditShortLinkInputDTO & { currentUserId: string };

type EditShortLinkUseCaseOutput = Either<
	ResourceNotFoundError | NotAllowedError | MalformedURLError,
	EditShortLinkOutputDTO
>;

@Injectable()
export class EditShortLinkUseCase {
	private readonly logger = new Logger(EditShortLinkUseCase.name);

	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
		shortLinkId,
		newOriginalUrl,
		newDescription,
	}: EditShortLinkUseCaseProps): Promise<EditShortLinkUseCaseOutput> {
		this.logger.log({
			message: 'Attempting to edit short link.',
			shortLinkId,
			userId: currentUserId,
		});

		const shortLink = await this.shortLinksRepository.findById(shortLinkId);

		if (!shortLink) {
			this.logger.warn({
				message: 'Edit failed: short link not found.',
				shortLinkId,
				userId: currentUserId,
			});
			return left(new ResourceNotFoundError());
		}

		if (!shortLink.userId) {
			this.logger.warn({
				message: 'Edit failed: anonymous link cannot be edited.',
				shortLinkId,
				userId: currentUserId,
			});
			return left(new NotAllowedError());
		}

		if (!shortLink.userId.equals(new UniqueEntityID(currentUserId))) {
			this.logger.warn({
				message: 'Edit failed: unauthorized access attempt.',
				shortLinkId,
				ownerId: shortLink.userId.toString(),
				attemptedById: currentUserId,
			});
			return left(new NotAllowedError('Edit another user data.'));
		}

		const isValidURL = ShortUrl.isValid(newOriginalUrl);

		if (!isValidURL) {
			this.logger.warn({
				message: 'Edit failed: new URL is malformed.',
				shortLinkId,
				invalidUrl: newOriginalUrl,
			});
			return left(new MalformedURLError(newOriginalUrl));
		}

		const oldUrl = shortLink.originalUrl;

		shortLink.originalUrl = newOriginalUrl;
		shortLink.description = newDescription ?? null;
		shortLink.shortUrl = ShortUrl.create(newOriginalUrl);

		await this.shortLinksRepository.save(shortLink);

		this.logger.log({
			message: 'Short link updated successfully.',
			shortLinkId,
			userId: currentUserId,
			previousUrl: oldUrl,
			updatedUrl: newOriginalUrl,
		});

		return right(null);
	}
}
