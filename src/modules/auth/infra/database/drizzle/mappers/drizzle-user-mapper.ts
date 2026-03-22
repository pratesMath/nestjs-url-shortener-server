import { User } from '@auth-module/domain/entities/user';
import { Email } from '@auth-module/domain/value-objects/email';
import { UserStatus } from '@auth-module/domain/value-objects/user-status';
import { users } from '@config/database/drizzle/schema';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';

export class DrizzleUserMapper {
	static toDomain(raw: typeof users.$inferSelect): User {
		return User.create(
			{
				username: raw.username,
				email: Email.create(raw.email),
				password: raw.password,
				status: UserStatus.create(raw.status),
				createdAt: new Date(raw.createdAt),
				updatedAt: new Date(raw.updatedAt),
				deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
			},
			new UniqueEntityID(raw.id)
		);
	}

	static toPersistence(user: User): typeof users.$inferInsert {
		return {
			id: user.id.toString(),
			username: user.username,
			email: user.email.toString(),
			password: user.password,
			status: user.status.toValue(),
			createdAt: user.createdAt.toUTCString(),
			updatedAt: user.updatedAt?.toUTCString(),
			deletedAt: user.deletedAt?.toUTCString(),
		};
	}
}
