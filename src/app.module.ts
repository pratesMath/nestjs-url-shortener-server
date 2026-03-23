import { AuthModule } from '@auth-module/auth.module';
import { JWTAuthModule } from '@config/auth/jwt-auth.module';
import { envSchema } from '@config/env/env';
import { EnvModule } from '@config/env/env.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
	imports: [
		ConfigModule.forRoot({
			validate: env => envSchema.parse(env),
			isGlobal: true,
		}),
		AuthModule,
		JWTAuthModule,
		EnvModule,
	],
})
export class AppModule {}
