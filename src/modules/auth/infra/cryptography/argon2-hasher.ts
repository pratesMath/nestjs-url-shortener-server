import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';
import { Injectable } from '@nestjs/common';
import { comparePassword, passwordHash } from '@shared/libs/argon2';

@Injectable()
export class Argon2Hasher implements HashGenerator, HashComparer {
	hash(password: string): Promise<string> {
		return passwordHash(password);
	}

	compare(hash: string, password: string): Promise<boolean> {
		return comparePassword(hash, password);
	}
}
