import { sql } from 'drizzle-orm';
import * as t from 'drizzle-orm/pg-core';
import { urlShortenerSchema } from '../database-schemas';
import { users } from './users';

export const shortLinks = urlShortenerSchema.table(
	'short_links',
	{
		id: t.varchar('id').notNull(),
		userId: t.varchar('user_id'),
		description: t.text('description'),
		originalUrl: t.text('original_url').notNull(),
		shortUrl: t.text('short_url').notNull(),
		clickCount: t.integer('click_count').notNull(),
		createdAt: t.timestamp('created_at', { withTimezone: true, mode: 'string' }).notNull(),
		updatedAt: t
			.timestamp('updated_at', { withTimezone: true, mode: 'string' })
			.notNull()
			.default(sql`now()`),
		deletedAt: t.timestamp('deleted_at', { withTimezone: true, mode: 'string' }),
	},
	table => [
		t.primaryKey({ name: 'pk_short_links_id', columns: [table.id] }),
		t.foreignKey({
			name: 'fk_short_links_user_id',
			columns: [table.userId],
			foreignColumns: [users.id],
		}),
	]
);
