import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	dialect: 'postgresql',
	out: 'src/config/database/drizzle/.migrations',
	schema: 'src/config/database/drizzle/schema.ts',
	casing: 'snake_case',
	dbCredentials: {
		url: process.env.DATABASE_URL as string,
	},
});
