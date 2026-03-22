import process from 'node:process';
import { UserStatusEnum } from '@auth-module/domain/value-objects/user-status';
import { passwordHash } from '@shared/libs/argon2';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { v7 as uuid } from 'uuid';
import * as schema from './schema';

const pg = new Pool({
	connectionString: String(process.env.DATABASE_URL),
});
const db = drizzle({ client: pg, schema: schema });

async function seed() {
	await db.delete(schema.tokens);
	await db.delete(schema.users);

	await Promise.all([
		db.insert(schema.users).values({
			id: uuid(),
			username: 'John Doe',
			email: 'john.doe@acme.com',
			password: await passwordHash('JohnDoe@123'),
			status: UserStatusEnum.ACTIVE,
			createdAt: new Date().toUTCString(),
		}),
		db.insert(schema.users).values({
			id: uuid(),
			username: 'Mary Doe',
			email: 'mary.doe@acme.com',
			password: await passwordHash('MaryDoe@123'),
			status: UserStatusEnum.ACTIVE,
			createdAt: new Date().toUTCString(),
		}),
	]);
}

seed()
	.then(() => {
		console.log('Database seeded!');
	})
	.finally(() => {
		pg.end();
	});
