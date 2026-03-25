import { Injectable } from '@nestjs/common';
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
	constructor(private readonly shortLinksRepository: ShortLinksRepository) {}

	async execute({
		currentUserId,
		shortLinkId,
	}: DeleteShortLinkUseCaseProps): Promise<DeleteShortLinkUseCaseOutput> {
		const shortLink = await this.shortLinksRepository.findById(shortLinkId);

		if (!shortLink) {
			return left(new ResourceNotFoundError());
		}

		if (!shortLink.userId) {
			return left(new NotAllowedError());
		}

		if (!shortLink.userId.equals(new UniqueEntityID(currentUserId))) {
			return left(new NotAllowedError('Delete another user data.'));
		}

		shortLink.deletedAt = new Date();

		await this.shortLinksRepository.delete(shortLink);

		return right(null);
	}
}
