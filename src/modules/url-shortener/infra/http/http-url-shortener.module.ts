import { EnvModule } from '@config/env/env.module';
import { Module } from '@nestjs/common';
import { CreateShortLinkUseCase } from '@url-shortener-module/application/use-cases/create-short-link';
import { DeleteShortLinkUseCase } from '@url-shortener-module/application/use-cases/delete-short-link';
import { EditShortLinkUseCase } from '@url-shortener-module/application/use-cases/edit-short-link';
import { GetOriginalUrlByShortLinkUseCase } from '@url-shortener-module/application/use-cases/get-original-url-by-short-link';
import { GetShortLinkByIdUseCase } from '@url-shortener-module/application/use-cases/get-short-link-by-id';
import { GetShortLinksByUserIdUseCase } from '@url-shortener-module/application/use-cases/get-short-links-by-user-id';
import { DatabaseUrlShortenerModule } from '../database/database-url-shortener.module';
import { CreateShortLinkController } from './controllers/create-short-link.controller';
import { DeleteShortLinkController } from './controllers/delete-short-link.controller';
import { EditShortLinkController } from './controllers/edit-short-link.controller';
import { GetOriginalUrlByShortLinkController } from './controllers/get-original-url-by-short-link.controller';
import { GetShortLinkByIdController } from './controllers/get-short-link-by-id.controller';
import { GetShortLinksByUserIdController } from './controllers/get-short-links-by-user-id.controller';

@Module({
	imports: [DatabaseUrlShortenerModule, EnvModule],
	controllers: [
		CreateShortLinkController,
		DeleteShortLinkController,
		EditShortLinkController,
		GetOriginalUrlByShortLinkController,
		GetShortLinkByIdController,
		GetShortLinksByUserIdController,
	],
	providers: [
		CreateShortLinkUseCase,
		DeleteShortLinkUseCase,
		EditShortLinkUseCase,
		GetOriginalUrlByShortLinkUseCase,
		GetShortLinkByIdUseCase,
		GetShortLinksByUserIdUseCase,
	],
})
export class HttpUrlShortenerModule {}
