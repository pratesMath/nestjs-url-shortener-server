import { User } from '../entities/user';

export abstract class UsersRepository {
	abstract passwordReset(userId: string, newPassword: string, tokenCode: number): Promise<void>;
	abstract findByEmail(email: string): Promise<User | null>;
	abstract findById(id: string): Promise<User | null>;
	abstract save(user: User): Promise<void>;
	abstract create(user: User): Promise<void>;
}
