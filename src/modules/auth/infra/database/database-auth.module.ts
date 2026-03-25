import { TokensRepository } from '@auth-module/domain/repositories/tokens-repository';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { CacheModule } from '@config/cache/cache.module';
import { DrizzleOrmProvider, drizzleProvider } from '@config/database/drizzle/drizzle.provider';
import { EnvModule } from '@config/env/env.module';
import { Module } from '@nestjs/common';
import { DrizzleTokensRepository } from './drizzle/repositories/drizzle-tokens-repository';
import { DrizzleUsersRepository } from './drizzle/repositories/drizzle-users-repository';

@Module({
	imports: [CacheModule, EnvModule],
	providers: [
		...drizzleProvider,
		{
			provide: UsersRepository,
			useClass: DrizzleUsersRepository,
		},
		{
			provide: TokensRepository,
			useClass: DrizzleTokensRepository,
		},
	],
	exports: [DrizzleOrmProvider, UsersRepository, TokensRepository],
})
export class DatabaseAuthModule {}
