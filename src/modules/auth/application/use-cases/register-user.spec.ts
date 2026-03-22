import { Email } from '@auth-module/domain/value-objects/email';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { makeUser } from '@test/factories/make-user';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { RegisterUserUseCase } from './register-user';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: RegisterUserUseCase;

describe('[Unit] - RegisterUserUseCase', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new RegisterUserUseCase(fakeHasher, inMemoryUsersRepository);
	});

	it('should be able to create user account', async () => {
		const result = await sut.execute({
			username: 'John Doe',
			email: 'johndoe@example.com',
			password: 'Password@123',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			user: expect.objectContaining({
				email: expect.objectContaining({
					value: 'johndoe@example.com',
				}),
			}),
		});
		expect(result.value).toEqual({
			user: inMemoryUsersRepository.items[0],
		});
	});

	it('should hash user password upon registration', async () => {
		const result = await sut.execute({
			username: 'John Doe',
			email: 'johndoe@example.com',
			password: 'Password@123',
		});

		const hashedPassword = await fakeHasher.hash('Password@123');

		expect(result.isRight()).toBe(true);
		expect(inMemoryUsersRepository.items[0].password).toEqual(hashedPassword);
	});

	it('should not be able to create user account with existing email', async () => {
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
		});

		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			username: 'John Doe',
			email: 'johndoe@example.com',
			password: 'Password@123',
		});

		expect(result.isLeft()).toBe(true);
	});
});
