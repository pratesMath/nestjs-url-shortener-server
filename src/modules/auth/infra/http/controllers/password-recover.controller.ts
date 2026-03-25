import { PasswordRecoverInputDTO } from '@auth-module/application/dtos';
import { PasswordRecoverUseCase } from '@auth-module/application/use-cases/password-recover';
import { Public } from '@config/auth/public';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { TokenPresenter } from '../presenters/token-presenter';

@ApiTags('Auth')
@Public()
@Controller('/auth')
export class PasswordRecoverController {
	constructor(private readonly passwordRecover: PasswordRecoverUseCase) {}

	@ApiOperation({ summary: 'Password recover.' })
	@ApiBody({ type: PasswordRecoverInputDTO })
	@Post('/v1/password-recover')
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body() body: PasswordRecoverInputDTO) {
		const result = await this.passwordRecover.execute(body);

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const token = result.value.token;

		return { token: TokenPresenter.toHTTP(token) };
	}
}
