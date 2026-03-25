import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { JwtAuthGuard } from './jwt/jwt-auth.guard';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [EnvModule],
			inject: [EnvService],
			global: true,
			useFactory(env: EnvService) {
				const privateKey = env.get('JWT_PRIVATE_KEY');
				const publicKey = env.get('JWT_PUBLIC_KEY');

				return {
					signOptions: { algorithm: 'RS256', expiresIn: '30m' },
					privateKey: Buffer.from(privateKey, 'base64'),
					publicKey: Buffer.from(publicKey, 'base64'),
				};
			},
		}),
		PassportModule,
	],
	providers: [
		JwtStrategy,
		EnvService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class JWTAuthModule {}
