import { Token } from '../entities/token';

export abstract class TokensRepository {
	abstract findByCode(code: number): Promise<Token | null>;
	abstract create(token: Token): Promise<void>;
}
