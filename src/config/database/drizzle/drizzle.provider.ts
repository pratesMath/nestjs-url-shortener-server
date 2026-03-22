import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { EnvService } from '../../env/env.service';
import * as schema from './schema';

export const DrizzleOrmProvider = Symbol('DRIZZLE_ORM');
export type DrizzleSchema = NodePgDatabase<typeof schema>;

export const drizzleProvider = [
	{
		provide: DrizzleOrmProvider,
		inject: [EnvService],
		useFactory: async (env: EnvService) => {
			const pool = new Pool({
				connectionString: env.get('DATABASE_URL'),
			});

			return drizzle({ client: pool, schema: schema, logger: false }) as DrizzleSchema;
		},
	},
];
