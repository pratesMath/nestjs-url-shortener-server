import { GetProfileUseCase } from '@auth-module/application/use-cases/get-profile';
import { CurrentUser } from '@config/auth/jwt/decorators/current-user.decorator';
import { type UserPayload } from '@config/auth/jwt/jwt.strategy';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { UserPresenter } from '../presenters/user-presenter';

@ApiTags('Auth')
@ApiBearerAuth('access-token')
@Controller('/auth')
export class GetProfileController {
	constructor(private readonly getProfile: GetProfileUseCase) {}

	@ApiOperation({ summary: 'Get profile.' })
	@ApiResponse({ status: HttpStatus.OK, description: 'User profile returned successfully.' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'User not found.' })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
	@Get('/v1/profile')
	@HttpCode(HttpStatus.OK)
	async handle(@CurrentUser() user: UserPayload) {
		const result = await this.getProfile.execute({
			currentUserId: user.sub,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				case NotAllowedError:
					throw new UnauthorizedException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			profile: {
				user: UserPresenter.toHTTP(result.value.profile.user),
			},
		};
	}
}
