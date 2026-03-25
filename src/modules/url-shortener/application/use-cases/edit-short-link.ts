import { Injectable } from '@nestjs/common';
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
	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
		shortLinkId,
		newOriginalUrl,
		newDescription,
	}: EditShortLinkUseCaseProps): Promise<EditShortLinkUseCaseOutput> {
		const shortLink = await this.shortLinksRepository.findById(shortLinkId);

		if (!shortLink) {
			return left(new ResourceNotFoundError());
		}

		if (!shortLink.userId) {
			return left(new NotAllowedError());
		}

		if (!shortLink.userId.equals(new UniqueEntityID(currentUserId))) {
			return left(new NotAllowedError('Edit another user data.'));
		}

		const isValidURL = ShortUrl.isValid(newOriginalUrl);

		if (!isValidURL) {
			return left(new MalformedURLError(newOriginalUrl));
		}

		shortLink.originalUrl = newOriginalUrl;
		shortLink.description = newDescription ?? null;
		shortLink.shortUrl = ShortUrl.create(newOriginalUrl);

		await this.shortLinksRepository.save(shortLink);

		return right(null);
	}
}
