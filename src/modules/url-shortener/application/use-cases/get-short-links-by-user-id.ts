import { Injectable } from '@nestjs/common';
import { Either, right } from '@shared/either';
import { ShortLinksRepository } from '../../domain/repositories/short-links-repository';
import { GetShortLinksByUserIdInputDTO, GetShortLinksByUserIdOutputDTO } from '../dtos';

type GetShortLinksByUserIdUseCaseOutput = Either<null, GetShortLinksByUserIdOutputDTO>;

@Injectable()
export class GetShortLinksByUserIdUseCase {
	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
	}: GetShortLinksByUserIdInputDTO): Promise<GetShortLinksByUserIdUseCaseOutput> {
		const shortLinks = await this.shortLinksRepository.findManyByUserId(currentUserId);

		return right({ shortLinks });
	}
}
