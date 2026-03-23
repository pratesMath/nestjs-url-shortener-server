import { Encrypter, EncryptPromise } from '@auth-module/domain/services/cryptography/encrypter';

export class FakeEncrypter implements Encrypter {
	async encrypt(payload: Record<string, unknown>): Promise<EncryptPromise> {
		const accessToken = JSON.stringify(payload);

		return {
			accessToken,
		};
	}
}
