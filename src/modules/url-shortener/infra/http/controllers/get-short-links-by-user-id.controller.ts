import { CurrentUser } from '@config/auth/jwt/decorators/current-user.decorator';
import type { UserPayload } from '@config/auth/jwt/jwt.strategy';
import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetShortLinksByUserIdUseCase } from '@url-shortener-module/application/use-cases/get-short-links-by-user-id';
import { ShortLinkPresenter } from '../presenters/short-link.presenter';

@ApiBearerAuth('access-token')
@ApiTags('Url Shortener')
@Controller('/url-shortener')
export class GetShortLinksByUserIdController {
	constructor(private getShortLinksByUserId: GetShortLinksByUserIdUseCase) {}

	@ApiOperation({ summary: "Return an array of user's short links." })
	@Get('/v1')
	@HttpCode(HttpStatus.OK)
	async handle(@CurrentUser() user: UserPayload) {
		const result = await this.getShortLinksByUserId.execute({
			currentUserId: user.sub,
		});

		const shortLinks = result.value?.shortLinks ? result.value.shortLinks : [];

		return {
			data: {
				shortLinks: shortLinks.map(ShortLinkPresenter.toHTTP),
			},
		};
	}
}
