import { Injectable } from '@nestjs/common';
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
	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
		shortLinkId,
	}: GetShortLinkByIdUseCaseProps): Promise<GetShortLinkByIdUseCaseOutput> {
		const shortLink = await this.shortLinksRepository.findById(shortLinkId);

		if (!shortLink) {
			return left(new ResourceNotFoundError());
		}

		if (!shortLink.userId) {
			return left(new NotAllowedError());
		}

		if (!shortLink.userId.equals(new UniqueEntityID(currentUserId))) {
			return left(new NotAllowedError('Access another user data.'));
		}

		return right({ shortLink });
	}
}
