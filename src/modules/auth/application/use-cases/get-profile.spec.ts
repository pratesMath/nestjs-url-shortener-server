import { Email } from '@auth-module/domain/value-objects/email';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { makeUser } from '@test/factories/make-user';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { GetProfileUseCase } from './get-profile';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: GetProfileUseCase;

describe('[Unit] - GetProfileUseCase', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new GetProfileUseCase(inMemoryUsersRepository);
	});

	it('should be able to get profile', async () => {
		const originalPassword = 'Password@123';
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: await fakeHasher.hash(originalPassword),
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			currentUserId: user.id.toString(),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			profile: {
				user: {
					username: user.username,
					email: user.email,
				},
			},
		});
		expect(result.value).toEqual({
			profile: { user: inMemoryUsersRepository.items[0] },
		});
	});
});
