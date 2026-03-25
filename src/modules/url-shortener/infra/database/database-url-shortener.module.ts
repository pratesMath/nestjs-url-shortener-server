import { CacheModule } from '@config/cache/cache.module';
import { DrizzleOrmProvider, drizzleProvider } from '@config/database/drizzle/drizzle.provider';
import { EnvModule } from '@config/env/env.module';
import { Module } from '@nestjs/common';
import { ShortLinksRepository } from '@url-shortener-module/domain/repositories/short-links-repository';
import { DrizzleShortLinksRepository } from './drizzle/repositories/drizzle-short-links-repository';

@Module({
	imports: [CacheModule, EnvModule],
	providers: [
		...drizzleProvider,
		{
			provide: ShortLinksRepository,
			useClass: DrizzleShortLinksRepository,
		},
	],
	exports: [DrizzleOrmProvider, ShortLinksRepository],
})
export class DatabaseUrlShortenerModule {}
