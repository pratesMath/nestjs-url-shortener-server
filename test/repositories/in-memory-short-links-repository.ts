import { ShortLink } from '@url-shortener-module/domain/entities/short-link';
import { ShortLinksRepository } from '@url-shortener-module/domain/repositories/short-links-repository';

export class InMemoryShortLinksRepository implements ShortLinksRepository {
	public items: ShortLink[] = [];

	async findByShortLinkAndIncrementClickCount(
		shortLink: string,
		incrementBy: number
	): Promise<ShortLink | null> {
		const itemIndex = this.items.findIndex(item => item.shortUrl.toValue() === shortLink);

		if (itemIndex < 0) {
			return null;
		}

		const item = this.items[itemIndex];

		item.clickCount.value += incrementBy;

		this.items[itemIndex] = item;

		return item;
	}

	async findById(id: string): Promise<ShortLink | null> {
		const item = this.items.find(item => item.id.toString() === id);

		return item ?? null;
	}

	async findByOriginalUrl(originalUrl: string, userId: string): Promise<ShortLink | null> {
		const item = this.items.find(
			item => item.originalUrl === originalUrl && item.userId.toString() === userId
		);

		return item ?? null;
	}

	async findManyByUserId(userId: string): Promise<ShortLink[] | null> {
		const links = this.items.filter(item => item.userId.toString() === userId);

		return links.length > 0 ? links : null;
	}

	async delete(shortLink: ShortLink): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id.equals(shortLink.id));

		if (itemIndex >= 0) {
			this.items.splice(itemIndex, 1);
		}
	}

	async save(shortLink: ShortLink): Promise<void> {
		const itemIndex = this.items.findIndex(item => item.id.equals(shortLink.id));

		if (itemIndex >= 0) {
			this.items[itemIndex] = shortLink;
		} else {
			this.items.push(shortLink);
		}
	}

	async create(shortLink: ShortLink): Promise<void> {
		this.items.push(shortLink);
	}
}
