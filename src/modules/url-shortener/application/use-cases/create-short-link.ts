import { EnvService } from '@config/env/env.service';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { ShortLink } from '../../domain/entities/short-link';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { ClickCount } from '../../domain/value-objects/click-count';
import { ShortUrl } from '../../domain/value-objects/short-url';
import { CreateShortLinkInputDTO, CreateShortLinkOutputDTO } from '../dtos';
import { MalformedURLError } from '../errors/malformed-url-error';
import { ShortLinkAlreadyExistsError } from '../errors/short-link-already-exists-error';

export type CreateShortLinkUseCaseProps = CreateShortLinkInputDTO & {
	currentUserId: string | null;
};

type CreateShortLinkUseCaseOutput = Either<
	ShortLinkAlreadyExistsError | MalformedURLError,
	CreateShortLinkOutputDTO
>;

@Injectable()
export class CreateShortLinkUseCase {
	private readonly logger = new Logger(CreateShortLinkUseCase.name);

	constructor(
		private readonly env: EnvService,
		private readonly shortLinksRepository: ShortLinksRepository
	) {}

	async execute({
		currentUserId,
		description,
		originalUrl,
	}: CreateShortLinkUseCaseProps): Promise<CreateShortLinkUseCaseOutput> {
		this.logger.log({
			message: 'Attempting to create short link.',
			originalUrl,
			userId: currentUserId ?? 'anonymous',
		});

		const foundShortLink = await this.shortLinksRepository.findByOriginalUrl(
			originalUrl,
			currentUserId
		);

		if (foundShortLink) {
			this.logger.warn({
				message: 'Short link creation failed: original URL already exists for this user.',
				originalUrl,
				shortUrl: foundShortLink.shortUrl.toString(),
				userId: currentUserId ?? 'anonymous',
			});
			return left(new ShortLinkAlreadyExistsError(foundShortLink.shortUrl.toString()));
		}

		const isValidURL = ShortUrl.isValid(originalUrl);

		if (!isValidURL) {
			this.logger.warn({
				message: 'Short link creation failed: malformed URL.',
				originalUrl,
				userId: currentUserId ?? 'anonymous',
			});
			return left(new MalformedURLError(originalUrl));
		}

		const createdShortLink = ShortUrl.create(originalUrl);

		const shortLink = ShortLink.create({
			userId: currentUserId ? new UniqueEntityID(currentUserId) : null,
			originalUrl,
			description,
			clickCount: ClickCount.create(0),
			shortUrl: createdShortLink,
		});

		await this.shortLinksRepository.create(shortLink);

		const fullShortLink = `${this.env.get('BASE_URL')}/${createdShortLink}`;

		this.logger.log({
			message: 'Short link created successfully.',
			userId: currentUserId ?? 'anonymous',
			shortLinkId: shortLink.id.toString(),
			fullShortLink,
		});

		return right({
			shortLink,
			fullShortLink,
		});
	}
}
