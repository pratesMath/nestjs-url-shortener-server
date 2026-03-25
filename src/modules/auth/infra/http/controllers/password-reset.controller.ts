import { PasswordResetInputDTO } from '@auth-module/application/dtos';
import { ExpiredTokenError } from '@auth-module/application/errors/expired-token-error';
import { PasswordResetUseCase } from '@auth-module/application/use-cases/password-reset';
import { Public } from '@config/auth/public';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Put,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';

@ApiTags('Auth')
@Public()
@Controller('/auth')
export class PasswordResetController {
	constructor(private readonly passwordReset: PasswordResetUseCase) {}

	@ApiOperation({ summary: 'Password reset.' })
	@ApiBody({ type: PasswordResetInputDTO })
	@Put('/v1/password-reset')
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(@Body() body: PasswordResetInputDTO) {
		const result = await this.passwordReset.execute(body);

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				case ExpiredTokenError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return null;
	}
}
