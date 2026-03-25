import { Module } from '@nestjs/common';
import { HttpUrlShortenerModule } from './infra/http/http-url-shortener.module';

@Module({
	imports: [HttpUrlShortenerModule],
})
export class UrlShortenerModule {}
