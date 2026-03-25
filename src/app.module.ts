import { AuthModule } from '@auth-module/auth.module';
import { JWTAuthModule } from '@config/auth/jwt-auth.module';
import { envSchema } from '@config/env/env';
import { EnvModule } from '@config/env/env.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlShortenerModule } from './modules/url-shortener/url-shortener.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: env => envSchema.parse(env),
			isGlobal: true,
		}),
		EnvModule,
		JWTAuthModule,
		AuthModule,
		UrlShortenerModule,
	],
})
export class AppModule {}
