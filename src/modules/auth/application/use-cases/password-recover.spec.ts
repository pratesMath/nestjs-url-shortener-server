import { Email } from '@auth-module/domain/value-objects/email';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { makeUser } from '@test/factories/make-user';
import { InMemoryTokensRepository } from '@test/repositories/in-memory-tokens-repository';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { PasswordRecoverUseCase } from './password-recover';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTokensRepository: InMemoryTokensRepository;
let sut: PasswordRecoverUseCase;

describe('[Unit] - PasswordRecoverUseCase', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryTokensRepository = new InMemoryTokensRepository();
		sut = new PasswordRecoverUseCase(inMemoryTokensRepository, inMemoryUsersRepository);
	});

	it('should be able to get token to password recover', async () => {
		const originalPassword = 'Password@123';
		const user = makeUser({
			email: Email.create('johndoe@example.com'),
			password: await fakeHasher.hash(originalPassword),
		});
		await inMemoryUsersRepository.create(user);

		const result = await sut.execute({
			email: user.email.toValue(),
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toMatchObject({
			token: expect.objectContaining({
				userId: user.id,
				tokenType: 'PASSWORD_RECOVER',
			}),
		});
		expect(result.value).toEqual({
			token: inMemoryTokensRepository.items[0],
		});
	});
});
