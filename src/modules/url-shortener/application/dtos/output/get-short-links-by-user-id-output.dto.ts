import { ShortLink } from '@url-shortener-module/domain/entities/short-link';

export type GetShortLinksByUserIdOutputDTO = { shortLinks: ShortLink[] | null };
