import { UserStatusEnum } from '@auth-module/domain/value-objects/user-status';
import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { authSchema } from '../database-schemas';

export const userStatusEnum = authSchema.enum('user_status_enum', UserStatusEnum);

export const users = authSchema.table(
	'users',
	{
		id: t.varchar('id').notNull(),
		username: t.varchar('username').notNull(),
		email: t.varchar('email').notNull(),
		password: t.varchar('password').notNull(),
		status: userStatusEnum().notNull().default(UserStatusEnum.ACTIVE),
		createdAt: t.timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
		updatedAt: t
			.timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.default(sql`now()`),
		deletedAt: t.timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
	},
	table => [
		t.primaryKey({ name: 'pk_users_id', columns: [table.id] }),
		t.unique('uk_users_email').on(table.email),
	]
);
