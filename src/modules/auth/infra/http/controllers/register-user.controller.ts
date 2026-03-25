import { RegisterUserInputDTO } from '@auth-module/application/dtos/input/register-user-input.dto';
import { UserAlreadyExistsError } from '@auth-module/application/errors/user-already-exists-error';
import { RegisterUserUseCase } from '@auth-module/application/use-cases/register-user';
import { Public } from '@config/auth/public';
import {
	BadRequestException,
	Body,
	ConflictException,
	Controller,
	HttpCode,
	HttpStatus,
	Post,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserPresenter } from '../presenters/user-presenter';

@ApiTags('Auth')
@Public()
@Controller('/auth')
export class RegisterUserController {
	constructor(private registerUser: RegisterUserUseCase) {}

	@ApiOperation({ summary: 'Register user.' })
	@ApiBody({ type: RegisterUserInputDTO })
	@Post('/v1/sign-up')
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body() body: RegisterUserInputDTO) {
		const { username, email, password } = body;

		const result = await this.registerUser.execute({
			username,
			email,
			password,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case UserAlreadyExistsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			data: {
				user: UserPresenter.toHTTP(result.value.user),
			},
		};
	}
}
