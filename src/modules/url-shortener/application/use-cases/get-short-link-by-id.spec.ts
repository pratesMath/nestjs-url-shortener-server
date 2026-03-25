import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { makeShortLink } from '@test/factories/make-short-link';
import { InMemoryShortLinksRepository } from '@test/repositories/in-memory-short-links-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetShortLinkByIdUseCase } from './get-short-link-by-id';

let inMemoryShortLinksRepository: InMemoryShortLinksRepository;
let sut: GetShortLinkByIdUseCase;

describe('[Unit] - GetShortLinkByIdUseCase', () => {
	beforeEach(() => {
		inMemoryShortLinksRepository = new InMemoryShortLinksRepository();
		sut = new GetShortLinkByIdUseCase(inMemoryShortLinksRepository);
	});

	it('should be able to get a short link by id', async () => {
		const newShortLink = makeShortLink();
		await inMemoryShortLinksRepository.create(newShortLink);

		const result = await sut.execute({
			currentUserId: newShortLink.userId.toString(),
			shortLinkId: newShortLink.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			shortLink: inMemoryShortLinksRepository.items[0],
		});
	});

	it('should not be able to get a non-existing short link', async () => {
		const result = await sut.execute({
			currentUserId: 'any-user-id',
			shortLinkId: 'non-existing-id',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to get a short link from another user', async () => {
		const newShortLink = makeShortLink({
			userId: new UniqueEntityID('user-01'),
		});

		await inMemoryShortLinksRepository.create(newShortLink);

		const result = await sut.execute({
			currentUserId: 'user-02',
			shortLinkId: newShortLink.id.toString(),
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});
});
