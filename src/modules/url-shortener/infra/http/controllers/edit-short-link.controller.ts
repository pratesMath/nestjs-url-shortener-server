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
	UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { EditShortLinkInputDTO } from '@url-shortener-module/application/dtos';
import { MalformedURLError } from '@url-shortener-module/application/errors/malformed-url-error';
import { EditShortLinkUseCase } from '@url-shortener-module/application/use-cases/edit-short-link';

@ApiBearerAuth('access-token')
@ApiTags('Url Shortener')
@Controller('/url-shortener')
export class EditShortLinkController {
	constructor(private readonly editShortLink: EditShortLinkUseCase) {}

	@ApiOperation({ summary: 'Edit short link.' })
	@ApiBody({ type: EditShortLinkInputDTO })
	@ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Short link edited successfully.' })
	@ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Short link not found.' })
	@ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized.' })
	@ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad request.' })
	@Put('/v1/edit')
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(@Body() body: EditShortLinkInputDTO, @CurrentUser() user: UserPayload) {
		const result = await this.editShortLink.execute({
			currentUserId: user.sub,
			...body,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				case NotAllowedError:
					throw new UnauthorizedException(error.message);
				case MalformedURLError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return null;
	}
}
