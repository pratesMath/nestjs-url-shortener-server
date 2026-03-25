import { BaseEntity } from '@shared/entities/base-entity';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { Optional } from '@shared/types/optional';
import { ClickCount } from '../value-objects/click-count';
import { ShortUrl } from '../value-objects/short-url';

export interface ShortLinkProps {
	userId: UniqueEntityID | null;
	description?: string | null;
	originalUrl: string;
	shortUrl: ShortUrl;
	clickCount: ClickCount;
	createdAt: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
}

export class ShortLink extends BaseEntity<ShortLinkProps> {
	get userId() {
		return this.props.userId;
	}

	get description() {
		return this.props.description ?? null;
	}

	get originalUrl() {
		return this.props.originalUrl;
	}

	get shortUrl() {
		return this.props.shortUrl;
	}

	get clickCount() {
		return this.props.clickCount;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get deletedAt() {
		return this.props.deletedAt ?? null;
	}

	static create(
		props: Optional<ShortLinkProps, 'shortUrl' | 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID
	) {
		const shortLink = new ShortLink(
			{
				...props,
				shortUrl: props.shortUrl ?? ShortUrl.create(props.originalUrl),
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
				deletedAt: props.deletedAt ?? null,
			},
			id
		);

		return shortLink;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set description(description: string | null) {
		this.props.description = description;
		this.touch();
	}

	set originalUrl(originalUrl: string) {
		this.props.originalUrl = originalUrl;
		this.touch();
	}

	set shortUrl(shortUrl: ShortUrl) {
		this.props.shortUrl = shortUrl;
		this.touch();
	}

	set clickCount(clickCount: ClickCount) {
		this.props.clickCount = clickCount;
		this.touch();
	}

	set deletedAt(deletedAt: Date | null) {
		if (deletedAt !== null) {
			this.props.deletedAt = deletedAt;
			this.touch();
		}
	}
}
