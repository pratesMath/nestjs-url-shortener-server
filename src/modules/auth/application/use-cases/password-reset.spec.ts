import { TokenType } from '@auth-module/domain/entities/token';
import { FakeHasher } from '@test/cryptography/fake-hasher';
import { makeToken } from '@test/factories/make-token';
import { makeUser } from '@test/factories/make-user';
import { InMemoryTokensRepository } from '@test/repositories/in-memory-tokens-repository';
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { PasswordResetUseCase } from './password-reset';

let fakeHasher: FakeHasher;
let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryTokensRepository: InMemoryTokensRepository;
let sut: PasswordResetUseCase;

describe('[Unit] - PasswordResetUseCase', () => {
	beforeEach(() => {
		fakeHasher = new FakeHasher();
		inMemoryUsersRepository = new InMemoryUsersRepository();
		inMemoryTokensRepository = new InMemoryTokensRepository();
		sut = new PasswordResetUseCase(inMemoryTokensRepository, inMemoryUsersRepository, fakeHasher);
	});

	it('should be able to reset password', async () => {
		const originalPassword = 'Password@123';
		const user = makeUser({ password: await fakeHasher.hash(originalPassword) });
		const token = makeToken({ userId: user.id, tokenType: TokenType.PASSWORD_RECOVER });

		await inMemoryUsersRepository.create(user);
		await inMemoryTokensRepository.create(token);

		const result = await sut.execute({
			code: token.code.toValue(),
			password: 'NewPassword@123',
		});

		expect(result.isRight()).toBe(true);
		expect(result.value).toBeNull();
	});
});
