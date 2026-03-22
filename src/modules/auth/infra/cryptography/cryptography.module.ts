import { Encrypter } from '@auth-module/domain/services/cryptography/encrypter';
import { HashComparer } from '@auth-module/domain/services/cryptography/hash-comparer';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';
import { Module } from '@nestjs/common';
import { Argon2Hasher } from './argon2-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
	providers: [
		{ provide: Encrypter, useClass: JwtEncrypter },
		{ provide: HashComparer, useClass: Argon2Hasher },
		{ provide: HashGenerator, useClass: Argon2Hasher },
	],
	exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
