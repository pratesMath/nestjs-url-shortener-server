import { DrizzleOrmProvider, type DrizzleSchema } from '@config/database/drizzle/drizzle.provider';
import * as schema from '@config/database/drizzle/schema';
import { Inject, Injectable } from '@nestjs/common';
import { ShortLink } from '@url-shortener-module/domain/entities/short-link';
import { ShortLinksRepository } from '@url-shortener-module/domain/repositories/short-links-repository';
import { and, eq, isNull, sql } from 'drizzle-orm';
import { DrizzleShortLinkMapper } from '../mappers/drizzle-short-link.mapper';

@Injectable()
export class DrizzleShortLinksRepository implements ShortLinksRepository {
	constructor(
		@Inject(DrizzleOrmProvider)
		private readonly db: DrizzleSchema
	) {}

	async findByShortLinkAndIncrementClickCount(
		shortLink: string,
		incrementBy: number
	): Promise<ShortLink | null> {
		const [data] = await this.db
			.update(schema.shortLinks)
			.set({
				clickCount: sql`${schema.shortLinks.clickCount} + ${incrementBy}`,
			})
			.where(eq(schema.shortLinks.shortUrl, shortLink))
			.returning();

		if (!data) {
			return null;
		}

		return DrizzleShortLinkMapper.toDomain(data);
	}

	async findById(id: string): Promise<ShortLink | null> {
		const data = await this.db.query.shortLinks.findFirst({
			where: eq(schema.shortLinks.id, id),
		});

		if (!data) {
			return null;
		}

		return DrizzleShortLinkMapper.toDomain(data);
	}

	async findByOriginalUrl(originalUrl: string, userId: string): Promise<ShortLink | null> {
		const filters = [eq(schema.shortLinks.originalUrl, originalUrl)];

		userId
			? filters.push(eq(schema.shortLinks.userId, userId))
			: filters.push(isNull(schema.shortLinks.userId));

		const data = await this.db.query.shortLinks.findFirst({
			where: and(...filters),
		});

		if (!data) {
			return null;
		}

		return DrizzleShortLinkMapper.toDomain(data);
	}

	async findManyByUserId(userId: string): Promise<ShortLink[] | null> {
		const data = await this.db.query.shortLinks.findMany({
			where: eq(schema.shortLinks.userId, userId),
		});

		if (data.length === 0) {
			return null;
		}

		return data.map(DrizzleShortLinkMapper.toDomain);
	}

	async delete(shortLink: ShortLink): Promise<void> {
		const data = DrizzleShortLinkMapper.toPersistence(shortLink);

		const filters = [eq(schema.shortLinks.id, data.id)];

		data.userId
			? filters.push(eq(schema.shortLinks.userId, data.userId))
			: filters.push(isNull(schema.shortLinks.userId));

		await this.db.delete(schema.shortLinks).where(and(...filters));
	}

	async save(shortLink: ShortLink): Promise<void> {
		const data = DrizzleShortLinkMapper.toPersistence(shortLink);

		const filters = [eq(schema.shortLinks.id, data.id)];

		data.userId
			? filters.push(eq(schema.shortLinks.userId, data.userId))
			: filters.push(isNull(schema.shortLinks.userId));

		await this.db
			.update(schema.shortLinks)
			.set({
				originalUrl: data.originalUrl,
				description: data.description ?? null,
				shortUrl: data.shortUrl,
				clickCount: 0, // click count is zero (anyone clicked this link yet).
			})
			.where(and(...filters));
	}

	async create(shortLink: ShortLink): Promise<void> {
		const data = DrizzleShortLinkMapper.toPersistence(shortLink);

		await this.db.insert(schema.shortLinks).values(data);
	}
}
