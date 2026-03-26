import { EditUserInputDTO } from '@auth-module/application/dtos';
import { WrongCredentialsError } from '@auth-module/application/errors/wrong-credentials-error';
import { EditUserUseCase } from '@auth-module/application/use-cases/edit-user';
import { CurrentUser } from '@config/auth/jwt/decorators/current-user.decorator';
import type { UserPayload } from '@config/auth/jwt/jwt.strategy';
import {
	BadRequestException,
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Put,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('/auth')
export class EditUserController {
	constructor(private readonly editUser: EditUserUseCase) {}

	@ApiOperation({ summary: 'Edit user.' })
	@ApiBody({ type: EditUserInputDTO })
	@ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'User edited successfully.' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
	@Put('/v1/edit')
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(@Body() body: EditUserInputDTO, @CurrentUser() user: UserPayload) {
		const result = await this.editUser.execute({
			currentUserId: user.sub,
			...body,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				case WrongCredentialsError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return null;
	}
}
