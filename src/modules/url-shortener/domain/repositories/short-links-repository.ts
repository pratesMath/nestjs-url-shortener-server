import { ShortLink } from '../entities/short-link';

export abstract class ShortLinksRepository {
	abstract findByShortLinkAndIncrementClickCount(
		shortLink: string,
		incrementBy: number
	): Promise<ShortLink | null>;
	abstract findById(id: string): Promise<ShortLink | null>;
	abstract findByOriginalUrl(originalUrl: string, userId: string | null): Promise<ShortLink | null>;
	abstract findManyByUserId(userId: string): Promise<ShortLink[] | null>;
	abstract delete(shortLink: ShortLink): Promise<void>;
	abstract save(shortLink: ShortLink): Promise<void>;
	abstract create(shortLink: ShortLink): Promise<void>;
}
