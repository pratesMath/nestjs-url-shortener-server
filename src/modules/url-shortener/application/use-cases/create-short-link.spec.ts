import { Env } from '@config/env/env';
import { EnvService } from '@config/env/env.service';
import { ConfigService } from '@nestjs/config';
import { makeShortLink } from '@test/factories/make-short-link';
import { InMemoryShortLinksRepository } from '@test/repositories/in-memory-short-links-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { MalformedURLError } from '../errors/malformed-url-error';
import { ShortLinkAlreadyExistsError } from '../errors/short-link-already-exists-error';
import { CreateShortLinkUseCase } from './create-short-link';

let env: EnvService;
let inMemoryShortLinksRepository: InMemoryShortLinksRepository;
let sut: CreateShortLinkUseCase;

describe('[Unit] - CreateShortLinkUseCase', () => {
	beforeEach(() => {
		const configService = new ConfigService<Env, true>();

		inMemoryShortLinksRepository = new InMemoryShortLinksRepository();
		env = new EnvService(configService);
		sut = new CreateShortLinkUseCase(env, inMemoryShortLinksRepository);
	});

	it('should be able to create a short link', async () => {
		const shortLink = makeShortLink();

		const result = await sut.execute({
			currentUserId: shortLink.userId ? shortLink.userId.toValue() : null,
			description: shortLink.description,
			originalUrl: shortLink.originalUrl,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			shortLink: inMemoryShortLinksRepository.items[0],
			fullShortLink: expect.any(String),
		});
	});

	it('should not be able to create short link with existing email', async () => {
		const shortLink = makeShortLink();

		await inMemoryShortLinksRepository.create(shortLink);

		const result = await sut.execute({
			currentUserId: shortLink.userId ? shortLink.userId.toValue() : null,
			description: null,
			originalUrl: shortLink.originalUrl,
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceof(ShortLinkAlreadyExistsError);
	});

	it('should not be able to create short link with invalid URL', async () => {
		const shortLink = makeShortLink();

		await inMemoryShortLinksRepository.create(shortLink);

		const result = await sut.execute({
			currentUserId: shortLink.userId ? shortLink.userId.toValue() : null,
			description: null,
			originalUrl: 'my-random-and-invalid-url',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceof(MalformedURLError);
	});
});
