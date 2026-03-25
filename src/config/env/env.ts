import { z } from 'zod/v4';

export const envSchema = z.object({
	BASE_URL: z.url().default('http://localhost:7070'),
	NODE_ENV: z.enum(['development', 'homolog', 'production']).default('production'),
	PORT: z.coerce.number().optional().default(7070),
	PASSWORD_PEPPER: z.string(),
	DATABASE_URL: z.url().startsWith('postgresql://'),
	REDIS_DB: z.coerce.number().optional().default(0),
	REDIS_HOST: z.string().optional().default('127.0.0.1'),
	REDIS_PORT: z.coerce.number().optional().default(6379),
	CORS_ORIGIN: z.string().optional().default('*'),
	JWT_PRIVATE_KEY: z.string(),
	JWT_PUBLIC_KEY: z.string(),
});

export type Env = z.infer<typeof envSchema>;
