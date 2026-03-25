import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { makeShortLink } from '@test/factories/make-short-link';
import { InMemoryShortLinksRepository } from '@test/repositories/in-memory-short-links-repository';
import { ClickCount } from '@url-shortener-module/domain/value-objects/click-count';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetOriginalUrlByShortLinkUseCase } from './get-original-url-by-short-link';

let inMemoryShortLinksRepository: InMemoryShortLinksRepository;
let sut: GetOriginalUrlByShortLinkUseCase;

describe('[Unit] - GetOriginalUrlByShortLinkUseCase', () => {
	beforeEach(() => {
		inMemoryShortLinksRepository = new InMemoryShortLinksRepository();
		sut = new GetOriginalUrlByShortLinkUseCase(inMemoryShortLinksRepository);
	});

	it('should be able to get original url and increment click count', async () => {
		const shortLink = makeShortLink();
		await inMemoryShortLinksRepository.create(shortLink);

		const initialClicks = shortLink.clickCount.toValue();

		const result = await sut.execute({
			shortedLink: shortLink.shortUrl.toValue(),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			originalUrl: shortLink.originalUrl,
		});

		expect(inMemoryShortLinksRepository.items[0].clickCount.toValue()).toBe(initialClicks + 1);
	});

	it('should return ResourceNotFoundError when short link does not exist', async () => {
		const result = await sut.execute({
			shortedLink: 'non-existing-code',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).toBeInstanceOf(ResourceNotFoundError);
	});

	it('should increment the click count multiple times on subsequent calls', async () => {
		const shortLink = makeShortLink({
			clickCount: ClickCount.create(0),
		});
		await inMemoryShortLinksRepository.create(shortLink);

		const shortCode = shortLink.shortUrl.toValue();

		await sut.execute({ shortedLink: shortCode });
		await sut.execute({ shortedLink: shortCode });
		const result = await sut.execute({ shortedLink: shortCode });

		expect(result.isRight()).toBe(true);
		expect(inMemoryShortLinksRepository.items[0].clickCount.toValue()).toBe(3);
	});
});
