import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { makeShortLink } from '@test/factories/make-short-link';
import { InMemoryShortLinksRepository } from '@test/repositories/in-memory-short-links-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { MalformedURLError } from '../errors/malformed-url-error';
import { EditShortLinkUseCase } from './edit-short-link';

let inMemoryShortLinksRepository: InMemoryShortLinksRepository;
let sut: EditShortLinkUseCase;

describe('[Unit] - EditShortLinkUseCase', () => {
	beforeEach(() => {
		inMemoryShortLinksRepository = new InMemoryShortLinksRepository();
		sut = new EditShortLinkUseCase(inMemoryShortLinksRepository);
	});

	it('should be able to edit a short link', async () => {
		const shortLink = makeShortLink({
			userId: new UniqueEntityID('user-01'),
		});

		await inMemoryShortLinksRepository.create(shortLink);

		const result = await sut.execute({
			currentUserId: 'user-01',
			shortLinkId: shortLink.id.toString(),
			newOriginalUrl: 'https://new-url.com',
			newDescription: 'New Description',
		});

		expect(result.isRight()).toBe(true);
		expect(inMemoryShortLinksRepository.items[0].originalUrl).toBe('https://new-url.com');
		expect(inMemoryShortLinksRepository.items[0].description).toBe('New Description');
	});

	it('should not be able to edit a non-existing short link', async () => {
		const result = await sut.execute({
			currentUserId: 'any-user',
			shortLinkId: 'non-existing-id',
			newOriginalUrl: 'https://google.com',
			newDescription: null,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should not be able to edit another user data', async () => {
		const shortLink = makeShortLink({
			userId: new UniqueEntityID('user-01'),
		});

		await inMemoryShortLinksRepository.create(shortLink);

		const result = await sut.execute({
			currentUserId: 'user-02',
			shortLinkId: shortLink.id.toString(),
			newOriginalUrl: 'invalid-url',
			newDescription: null,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(NotAllowedError);
	});

	it('should not be able to edit with a malformed URL', async () => {
		const shortLink = makeShortLink({
			userId: new UniqueEntityID('user-01'),
		});

		await inMemoryShortLinksRepository.create(shortLink);

		const result = await sut.execute({
			currentUserId: 'user-01',
			shortLinkId: shortLink.id.toString(),
			newOriginalUrl: 'invalid-url',
			newDescription: null,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(MalformedURLError);
	});
});
