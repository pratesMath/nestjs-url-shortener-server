import { Public } from '@config/auth/public';
import {
	BadRequestException,
	Controller,
	Get,
	HttpCode,
	HttpStatus,
	NotFoundException,
	Param,
	Res,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { ResourceNotFoundError } from '@shared/errors/errors/resource-not-found-error';
import { GetOriginalUrlByShortLinkUseCase } from '@url-shortener-module/application/use-cases/get-original-url-by-short-link';
import type { Response } from 'express';

@ApiTags('Url Shortener')
@Public()
@Controller()
export class GetOriginalUrlByShortLinkController {
	constructor(private getOriginalUrlByShortLink: GetOriginalUrlByShortLinkUseCase) {}

	@ApiOperation({ summary: 'Redirect to original Url from a shorted link.' })
	@ApiParam({
		name: 'shortedLink',
		type: String,
		required: true,
		example: 'D69H6b',
	})
	@Get(':shortedLink')
	@HttpCode(HttpStatus.OK)
	async handle(@Param('shortedLink') shortedLink: string, @Res() res: Response) {
		const result = await this.getOriginalUrlByShortLink.execute({
			shortedLink: shortedLink,
		});

		if (result.isLeft()) {
			const error = result.value;

			switch (error.constructor) {
				case ResourceNotFoundError:
					throw new NotFoundException(error.message);
				default:
					throw new BadRequestException(error.message);
			}
		}

		const originalUrl = result.value.originalUrl;

		return res.redirect(HttpStatus.FOUND, originalUrl);
	}
}
