import { CurrentUser } from '@config/auth/jwt/decorators/current-user.decorator';
import type { UserPayload } from '@config/auth/jwt/jwt.strategy';
import {
	BadRequestException,
	Body,
	Controller,
	Delete,
	HttpCode,
	HttpStatus,
	NotFoundException,
	UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { DeleteShortLinkInputDTO } from '@url-shortener-module/application/dtos';
import { MalformedURLError } from '@url-shortener-module/application/errors/malformed-url-error';
import { DeleteShortLinkUseCase } from '@url-shortener-module/application/use-cases/delete-short-link';

@ApiBearerAuth('access-token')
@ApiTags('Url Shortener')
@Controller('/url-shortener')
export class DeleteShortLinkController {
	constructor(private deleteShortLink: DeleteShortLinkUseCase) {}

	@ApiOperation({ summary: 'Delete short link.' })
	@ApiBody({ type: DeleteShortLinkInputDTO })
	@Delete('/v1/delete')
	@HttpCode(HttpStatus.NO_CONTENT)
	async handle(@Body() body: DeleteShortLinkInputDTO, @CurrentUser() user: UserPayload) {
		const result = await this.deleteShortLink.execute({
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
