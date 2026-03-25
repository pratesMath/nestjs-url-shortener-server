import { HttpAuthModule } from '@auth-module/infra/http/http-auth.module';
import { Module } from '@nestjs/common';

@Module({
	imports: [HttpAuthModule],
})
export class AuthModule {}
