import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { makeShortLink } from '@test/factories/make-short-link';
import { InMemoryShortLinksRepository } from '@test/repositories/in-memory-short-links-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { DeleteShortLinkUseCase } from './delete-short-link';

let inMemoryShortLinksRepository: InMemoryShortLinksRepository;
let sut: DeleteShortLinkUseCase;

describe('[Unit] - DeleteShortLinkUseCase', () => {
	beforeEach(() => {
		inMemoryShortLinksRepository = new InMemoryShortLinksRepository();
		sut = new DeleteShortLinkUseCase(inMemoryShortLinksRepository);
	});

	it('should be able to delete a short link', async () => {
		const newShortLink = makeShortLink({
			userId: new UniqueEntityID('user-01'),
		});

		await inMemoryShortLinksRepository.create(newShortLink);

		const result = await sut.execute({
			shortLinkId: newShortLink.id.toString(),
			currentUserId: 'user-01',
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryShortLinksRepository.items).toHaveLength(0);
	});

	it('should not be able to delete a non-existing short link', async () => {
		const result = await sut.execute({
			shortLinkId: 'non-existing-id',
			currentUserId: 'any-user-id',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to delete a short link from another user', async () => {
		const newShortLink = makeShortLink({
			userId: new UniqueEntityID('user-01'),
		});

		await inMemoryShortLinksRepository.create(newShortLink);

		const result = await sut.execute({
			shortLinkId: newShortLink.id.toString(),
			currentUserId: 'user-02',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
