import { CurrentUser } from '@config/auth/jwt/decorators/current-user.decorator';
import type { UserPayload } from '@config/auth/jwt/jwt.strategy';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	UnauthorizedException,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { NotAllowedError } from '@shared/errors/errors/not-allowed-error';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { GetShortLinkByIdUseCase } from '@url-shortener-module/application/use-cases/get-short-link-by-id';
import { ShortLinkPresenter } from '../presenters/short-link.presenter';

@ApiBearerAuth('access-token')
@ApiTags('Url Shortener')
@Controller('/url-shortener')
export class GetShortLinkByIdController {
	constructor(private getShortLinkById: GetShortLinkByIdUseCase) {}

	@ApiOperation({ summary: 'Get short link data by id.' })
	@ApiParam({
		name: 'shortLinkId',
		type: String,
		required: true,
		example: 'baa7e502-cf66-4ef6-9d96-6740b1496b5f',
	})
	@Get('/v1/:shortLinkId')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('shortLinkId') shortLinkId: string, @CurrentUser() user: UserPayload) {
		const result = await this.getShortLinkById.execute({
			currentUserId: user.sub,
			shortLinkId,
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
			data: {
				shortLink: ShortLinkPresenter.toHTTP(result.value.shortLink),
			},
		};
	}
}
