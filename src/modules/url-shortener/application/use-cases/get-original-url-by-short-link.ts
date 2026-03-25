import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { ClickCount } from '../../domain/value-objects/click-count';
import { GetOriginalUrlByShortLinkInputDTO, GetOriginalUrlByShortLinkOutputDTO } from '../dtos';

type GetOriginalUrlByShortLinkUseCaseOutput = Either<
	ResourceNotFoundError,
	GetOriginalUrlByShortLinkOutputDTO
>;

@Injectable()
export class GetOriginalUrlByShortLinkUseCase {
	private readonly logger = new Logger(GetOriginalUrlByShortLinkUseCase.name);

	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		shortedLink,
	}: GetOriginalUrlByShortLinkInputDTO): Promise<GetOriginalUrlByShortLinkUseCaseOutput> {
		this.logger.log({
			message: 'Processing link redirection.',
			shortedLink,
		});

		const incrementClickCount = ClickCount.create(1).value;
		const shortLink = await this.shortLinksRepository.findByShortLinkAndIncrementClickCount(
			shortedLink,
			incrementClickCount
		);

		if (!shortLink) {
			this.logger.warn({
				message: 'Redirection failed: short link not found.',
				shortedLink,
			});
			return left(new ResourceNotFoundError());
		}

		this.logger.log({
			message: 'Redirection successful.',
			shortedLink,
			originalUrl: shortLink.originalUrl,
			userId: shortLink.userId?.toString() ?? 'anonymous',
			shortLinkId: shortLink.id.toString(),
		});

		return right({ originalUrl: shortLink.originalUrl });
	}
}
