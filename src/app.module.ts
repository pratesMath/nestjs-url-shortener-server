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
			validate: env => {
				const result = envSchema.safeParse(env);
				if (!result.success) {
					console.error('❌ ENV variables validations error:', result.error);
					throw new Error('Invalid environment setup.');
				}
				return result.data;
			},
			isGlobal: true,
		}),
		EnvModule,
		JWTAuthModule,
		AuthModule,
		UrlShortenerModule,
	],
})
export class AppModule {}
