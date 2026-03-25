import { Injectable } from '@nestjs/common';
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
	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		shortedLink,
	}: GetOriginalUrlByShortLinkInputDTO): Promise<GetOriginalUrlByShortLinkUseCaseOutput> {
		const incrementClickCount = ClickCount.create(1).value;
		const shortLink = await this.shortLinksRepository.findByShortLinkAndIncrementClickCount(
			shortedLink,
			incrementClickCount
		);

		if (!shortLink) {
			return left(new ResourceNotFoundError());
		}

		return right({ originalUrl: shortLink.originalUrl });
	}
}
