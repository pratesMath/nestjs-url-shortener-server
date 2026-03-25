import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { makeShortLink } from '@test/factories/make-short-link';
import { InMemoryShortLinksRepository } from '@test/repositories/in-memory-short-links-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetShortLinksByUserIdUseCase } from './get-short-links-by-user-id';

let inMemoryShortLinksRepository: InMemoryShortLinksRepository;
let sut: GetShortLinksByUserIdUseCase;

describe('[Unit] - GetShortLinksByUserIdUseCase', () => {
	beforeEach(() => {
		inMemoryShortLinksRepository = new InMemoryShortLinksRepository();
		sut = new GetShortLinksByUserIdUseCase(inMemoryShortLinksRepository);
	});

	it('should be able to get all short links by user id', async () => {
		const userId = new UniqueEntityID('user-01');

		await inMemoryShortLinksRepository.create(makeShortLink({ userId }));
		await inMemoryShortLinksRepository.create(makeShortLink({ userId }));
		await inMemoryShortLinksRepository.create(
			makeShortLink({ userId: new UniqueEntityID('user-02') })
		);

		const result = await sut.execute({
			currentUserId: 'user-01',
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.shortLinks).toHaveLength(2);
			expect(result.value.shortLinks).toEqual([
				expect.objectContaining({ userId }),
				expect.objectContaining({ userId }),
			]);
		}
	});

	it('should return an empty list or null when user has no short links', async () => {
		const result = await sut.execute({
			currentUserId: 'non-existing-user',
		});

		expect(result.isRight()).toBe(true);
		if (result.isRight()) {
			expect(result.value.shortLinks).toBeNull();
		}
	});
});
