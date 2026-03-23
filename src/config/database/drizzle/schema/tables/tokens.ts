import { TokenType } from '@auth-module/domain/entities/token';
import * as t from 'drizzle-orm/pg-core';
import { authSchema } from '../database-schemas';
import { users } from './users';

export const tokenTypeEnum = authSchema.enum('token_type_enum', TokenType);

export const tokens = authSchema.table(
	'tokens',
	{
		id: t.varchar('id').notNull(),
		userId: t.varchar('user_id').notNull(),
		tokenType: tokenTypeEnum('token_type').notNull().default(TokenType.PASSWORD_RECOVER),
		code: t.integer('code').notNull(),
		expiresIn: t.timestamp('expires_in', { withTimezone: true, mode: 'string' }).notNull(),
		createdAt: t.timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
	},
	table => [
		t.primaryKey({ name: 'pk_tokens_id', columns: [table.id] }),
		t.foreignKey({
			name: 'fk_tokens_user_id',
			columns: [table.userId],
			foreignColumns: [users.id],
		}),
	]
);
