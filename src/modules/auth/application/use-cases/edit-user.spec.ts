import { Email } from '@auth-module/domain/value-objects/email';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { makeUser } from '@test/factories/make-user';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditUserUseCase } from './edit-user';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: EditUserUseCase;

describe('[Unit] - EditUserUseCase', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new EditUserUseCase(inMemoryUsersRepository, fakeHasher);
	});

	it('should be able to edit user data', async () => {
		const originalPassword = 'Password@123';
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: await fakeHasher.hash(originalPassword),
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			currentUserId: user.id.toString(),
			passwordToConfirm: originalPassword,
			username: 'John Doe',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			user: expect.objectContaining({
				username: 'John Doe',
			}),
		});
		expect(result.value).toEqual({
			user: inMemoryUsersRepository.items[0],
		});
	});

	it('should not be able to edit user data from an inexistent user', async () => {
		const originalPassword = 'Password@123';
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: await fakeHasher.hash(originalPassword),
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			currentUserId: 'another-user-uuid',
			passwordToConfirm: originalPassword,
			username: 'John Doe',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceOf(ResourceNotFoundError);
	});
});
