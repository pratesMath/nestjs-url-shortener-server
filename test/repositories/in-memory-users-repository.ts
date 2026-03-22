import { Token } from '@auth-module/domain/entities/token';
import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';

export class InMemoryUsersRepository implements UsersRepository {
	public items: User[] = [];
	public tokens: Token[] = [];

	async save(user: User): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id.equals(user.id));

		if (itemIndex >= 0) {
			this.items[itemIndex] = user;
		} else {
			this.items.push(user);
		}
	}

	async passwordReset(userId: string, newPassword: string, tokenCode: number): Promise<void> {
		const userIndex = this.items.findIndex(item => item.id.toString() === userId);

		if (userIndex >= 0) {
			this.items[userIndex].password = newPassword;
		}

		const tokenIndex = this.tokens.findIndex(
			token => token.userId.toString() === userId && token.code.toValue() === tokenCode
		);

		if (tokenIndex >= 0) {
			this.tokens.splice(tokenIndex, 1);
		}
	}

	async findById(id: string): Promise<User | null> {
		const user = this.items.find(item => item.id.toString() === id);

		return user ?? null;
	}

	async findByEmail(email: string): Promise<User | null> {
		const user = this.items.find(item => item.email.toValue() === email);

		return user ?? null;
	}

	async create(user: User): Promise<void> {
		this.items.push(user);
	}
}
