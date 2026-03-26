import { AuthenticateInputDTO, AuthenticateOutputDTO } from '@auth-module/application/dtos';
import { WrongCredentialsError } from '@auth-module/application/errors/wrong-credentials-error';
import { AuthenticateUseCase } from '@auth-module/application/use-cases/authenticate';
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
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Auth')
@Public()
@Controller('/auth')
export class AuthenticateController {
	constructor(private readonly authenticate: AuthenticateUseCase) {}

	@ApiOperation({ summary: 'Sign-in.' })
	@ApiBody({ type: AuthenticateInputDTO })
	@ApiResponse({ status: HttpStatus.CREATED, description: 'User authenticated successfully.' })
	@ApiResponse({ status: HttpStatus.CONFLICT, description: 'Invalid credentials provided.' })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
	@Post('/v1/sign-in')
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body() body: AuthenticateInputDTO) {
		const result = await this.authenticate.execute(body);

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case WrongCredentialsError:
					throw new ConflictException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const { accessToken } = result.value;

		return { accessToken };
	}
}
