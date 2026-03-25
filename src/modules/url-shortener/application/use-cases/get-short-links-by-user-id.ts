import { Injectable, Logger } from '@nestjs/common';
import { Either, right } from '@shared/either';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { GetShortLinksByUserIdInputDTO, GetShortLinksByUserIdOutputDTO } from '../dtos';

type GetShortLinksByUserIdUseCaseOutput = Either<null, GetShortLinksByUserIdOutputDTO>;

@Injectable()
export class GetShortLinksByUserIdUseCase {
	private readonly logger = new Logger(GetShortLinksByUserIdUseCase.name);

	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
	}: GetShortLinksByUserIdInputDTO): Promise<GetShortLinksByUserIdUseCaseOutput> {
		this.logger.log({
			message: 'Fetching all short links for user.',
			userId: currentUserId,
		});

		const shortLinks = await this.shortLinksRepository.findManyByUserId(currentUserId);

		this.logger.log({
			message: 'User short links retrieved successfully.',
			userId: currentUserId,
			count: shortLinks ? shortLinks.length : 0,
		});

		return right({ shortLinks });
	}
}
