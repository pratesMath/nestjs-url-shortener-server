import { AuthenticateUseCase } from '@auth-module/application/use-cases/authenticate';
import { EditUserUseCase } from '@auth-module/application/use-cases/edit-user';
import { GetProfileUseCase } from '@auth-module/application/use-cases/get-profile';
import { PasswordRecoverUseCase } from '@auth-module/application/use-cases/password-recover';
import { PasswordResetUseCase } from '@auth-module/application/use-cases/password-reset';
import { RegisterUserUseCase } from '@auth-module/application/use-cases/register-user';
import { Module } from '@nestjs/common';
import { CryptographyModule } from '../cryptography/cryptography.module';
import { DatabaseAuthModule } from '../database/database-auth.module';
import { AuthenticateController } from './controllers/authenticate.controller';
import { EditUserController } from './controllers/edit-user.controller';
import { GetProfileController } from './controllers/get-profile.controller';
import { PasswordRecoverController } from './controllers/password-recover.controller';
import { PasswordResetController } from './controllers/password-reset.controller';
import { RegisterUserController } from './controllers/register-user.controller';

@Module({
	imports: [DatabaseAuthModule, CryptographyModule],
	controllers: [
		AuthenticateController,
		EditUserController,
		GetProfileController,
		PasswordRecoverController,
		PasswordResetController,
		RegisterUserController,
	],
	providers: [
		AuthenticateUseCase,
		EditUserUseCase,
		GetProfileUseCase,
		PasswordRecoverUseCase,
		PasswordResetUseCase,
		RegisterUserUseCase,
	],
})
export class HttpAuthModule {}
