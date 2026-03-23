import { z } from 'zod/v4';

export const envSchema = z.object({
	NODE_ENV: z.enum(['development', 'homolog', 'production']).default('production'),
	PORT: z.coerce.number().optional().default(7070),
	JWT_PRIVATE_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
	DATABASE_URL: z.url(),
	PASSWORD_PEPPER: z.string(),
	REDIS_DB: z.coerce.number().optional().default(0),
	REDIS_HOST: z.string().optional().default('127.0.0.1'),
	REDIS_PORT: z.coerce.number().optional().default(6379),
});

export type Env = z.infer<typeof envSchema>;
