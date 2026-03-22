import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';

export class FakeHasher implements HashGenerator, HashComparer {
	async hash(plain: string): Promise<string> {
		return plain.concat('-hashed');
	}

	async compare(plain: string, hash: string): Promise<boolean> {
		return plain.concat('-hashed') === hash;
	}
}
