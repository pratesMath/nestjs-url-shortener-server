import { setDateToBrazilianFormat } from '@shared/libs/date-fns';
import { ShortLink } from '@url-shortener-module/domain/entities/short-link';

export class ShortLinkPresenter {
	static toHTTP(shortLink: ShortLink) {
		return {
			id: shortLink.id.toString(),
			userId: shortLink.userId ? shortLink.userId?.toString() : null,
			description: shortLink.description,
			originalUrl: shortLink.originalUrl,
			shortUrl: shortLink.shortUrl.toValue(),
			clickCount: shortLink.clickCount.toValue(),
			createdAt: setDateToBrazilianFormat(shortLink.createdAt),
			updatedAt: shortLink.updatedAt ? setDateToBrazilianFormat(shortLink.updatedAt) : null,
			deletedAt: shortLink.deletedAt ? setDateToBrazilianFormat(shortLink.deletedAt) : null,
		};
	}
}
