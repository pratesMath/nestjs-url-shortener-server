import { Token } from '@auth-module/domain/entities/token';
import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';

export class InMemoryTokensRepository implements TokensRepository {
	public items: Token[] = [];

	async findByCode(code: number): Promise<Token | null> {
		const token = this.items.find(item => item.code.toValue() === code);

		return token ?? null;
	}

	async create(token: Token): Promise<void> {
		this.items.push(token);
	}
}
