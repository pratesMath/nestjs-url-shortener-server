import { JWTAuthModule } from '@config/auth/jwt-auth.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [JWTAuthModule],
})
export class AppModule {}
