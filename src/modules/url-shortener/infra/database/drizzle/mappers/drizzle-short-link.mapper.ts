import { shortLinks } from '@config/database/drizzle/schema';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { ShortLink } from '@url-shortener-module/domain/entities/short-link';
import { ClickCount } from '@url-shortener-module/domain/value-objects/click-count';
import { ShortUrl } from '@url-shortener-module/domain/value-objects/short-url';

export class DrizzleShortLinkMapper {
	static toDomain(raw: typeof shortLinks.$inferSelect): ShortLink {
		return ShortLink.create(
			{
				userId: raw.userId ? new UniqueEntityID(raw.userId) : null,
				description: raw.description,
				originalUrl: raw.originalUrl,
				shortUrl: ShortUrl.create(raw.originalUrl),
				clickCount: ClickCount.create(raw.clickCount ?? 0),
				createdAt: new Date(raw.createdAt),
				updatedAt: new Date(raw.updatedAt),
				deletedAt: raw.deletedAt ? new Date(raw.deletedAt) : null,
			},
			new UniqueEntityID(raw.id)
		);
	}

	static toPersistence(shortLink: ShortLink): typeof shortLinks.$inferInsert {
		return {
			id: shortLink.id.toString(),
			userId: shortLink.userId ? shortLink.userId.toString() : null,
			description: shortLink.description,
			originalUrl: shortLink.originalUrl,
			shortUrl: shortLink.shortUrl.toValue(),
			clickCount: shortLink.clickCount.toValue(),
			createdAt: shortLink.createdAt.toUTCString(),
			updatedAt: shortLink.updatedAt?.toUTCString(),
			deletedAt: shortLink.deletedAt?.toUTCString(),
		};
	}
}
