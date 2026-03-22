import { Email } from '@auth-module/domain/value-objects/email';
import { FakeEncrypter } from '@test/cryptography/fake-encrypter';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { makeUser } from '@test/factories/make-user';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { WrongCredentialsError } from '../errors/wrong-credentials-error';
import { AuthenticateUseCase } from './authenticate';

let fakeHasher: FakeHasher;
let fakeEncrypter: FakeEncrypter;
let inMemoryUsersRepository: InMemoryUsersRepository;
let sut: AuthenticateUseCase;

describe('[Unit] - AuthenticateUseCase', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		fakeEncrypter = new FakeEncrypter();
		inMemoryUsersRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(inMemoryUsersRepository, fakeHasher, fakeEncrypter);
	});

	it('should be able to authenticate', async () => {
		const originalPassword = 'Password@123';
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: await fakeHasher.hash(originalPassword),
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			email: user.email.toValue(),
			password: originalPassword,
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toEqual({
			accessToken: expect.any(String),
		});
	});

	it('should not be able to authenticate with wrong credentials (password)', async () => {
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: 'Password@123',
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			email: 'johndoe@example.com',
			password: 'WrongPassword@123',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceof(WrongCredentialsError);
	});

	it('should not be able to authenticate with wrong credentials (e-mail)', async () => {
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: 'Password@123',
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			email: 'johndoe+wrongemail@example.com',
			password: 'Password@123',
		});

		expect(result.isLeft()).toBe(true);
		expect(result.value).instanceof(WrongCredentialsError);
	});
});
