import { Buffer } from 'node:buffer';
import process from 'node:process';
import * as Argon2 from 'argon2';

const argon2 = Argon2;

const memoryCost64MB = 65536; // 64 MB

const hashOptions: Argon2.Options = {
	type: argon2.argon2id,
	salt: Buffer.alloc(16, String(process.env.PASSWORD_SALT)),
	secret: Buffer.from(String(process.env.PASSWORD_PEPPER)),
	memoryCost: memoryCost64MB,
	timeCost: 3,
	parallelism: 4,
};

export async function passwordHash(password: string) {
	return argon2.hash(password, hashOptions);
}

export async function comparePassword(hash: string, password: string): Promise<boolean> {
	const passwordMatch = await argon2.verify(hash, password, {
		secret: hashOptions.secret,
	});

	return !!passwordMatch;
}
