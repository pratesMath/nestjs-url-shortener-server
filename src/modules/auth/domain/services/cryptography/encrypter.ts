export type EncryptPromise = {
	accessToken: string;
};

export abstract class Encrypter {
	abstract encrypt(payload: Record<string, unknown>): Promise<EncryptPromise>;
}
