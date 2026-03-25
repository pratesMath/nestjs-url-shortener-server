import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { ShortLink, ShortLinkProps } from '@url-shortener-module/domain/entities/short-link';
import { ClickCount } from '@url-shortener-module/domain/value-objects/click-count';
import { ShortUrl } from '@url-shortener-module/domain/value-objects/short-url';

export function makeShortLink(override: Partial<ShortLinkProps> = {}, id?: UniqueEntityID) {
	const originalUrl = override.originalUrl ?? faker.internet.url();

	const shortLink = ShortLink.create(
		{
			userId: override.userId ?? new UniqueEntityID(faker.string.uuid()),
			originalUrl: originalUrl,
			shortUrl: ShortUrl.create(originalUrl),
			clickCount: ClickCount.create(1),
			...override,
		},
		id
	);

	return shortLink;
}
