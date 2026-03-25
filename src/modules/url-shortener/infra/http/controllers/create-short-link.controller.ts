import { CurrentUser } from '@config/auth/jwt/decorators/current-user.decorator';
import type { UserPayload } from '@config/auth/jwt/jwt.strategy';
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
import { CreateShortLinkInputDTO } from '@url-shortener-module/application/dtos';
import { MalformedURLError } from '@url-shortener-module/application/errors/malformed-url-error';
import { ShortLinkAlreadyExistsError } from '@url-shortener-module/application/errors/short-link-already-exists-error';
import { CreateShortLinkUseCase } from '@url-shortener-module/application/use-cases/create-short-link';
import { ShortLinkPresenter } from '../presenters/short-link.presenter';

@Public()
@ApiTags('Url Shortener')
@Controller('/url-shortener')
export class CreateShortLinkController {
	constructor(private createShortLink: CreateShortLinkUseCase) {}

	@ApiOperation({ summary: 'Create a short link.' })
	@ApiBody({ type: CreateShortLinkInputDTO })
	@Post('/v1/shorten')
	@HttpCode(HttpStatus.CREATED)
	async handle(@Body() body: CreateShortLinkInputDTO, @CurrentUser() user?: UserPayload) {
		const { description, originalUrl } = body;

		const result = await this.createShortLink.execute({
			currentUserId: user ? user.sub : null,
			description,
			originalUrl,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ShortLinkAlreadyExistsError:
					throw new ConflictException(error.message);
				case MalformedURLError:
					throw new BadRequestException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		return {
			data: {
				shortLink: ShortLinkPresenter.toHTTP(result.value.shortLink),
				fullShortLink: result.value.fullShortLink,
			},
		};
	}
}
