import { URL } from 'node:url';

export class ShortUrl {
	public readonly value: string;

	private constructor(originalUrl: string) {
		if (!ShortUrl.isValid(originalUrl)) {
			throw new Error(`Invalid URL: ${originalUrl}`);
		}
		this.value = this.convertToBase62(originalUrl);
	}

	static isValid(url: string): boolean {
		try {
			new URL(url);
			return true;
		} catch {
			return false;
		}
	}

	static create(url: string): ShortUrl {
		return new ShortUrl(url);
	}

	private convertToBase62(url: string): string {
		const base62Chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let hash = 0;

		for (let i = 0; i < url.length; i++) {
			hash = (hash << 5) - hash + url.charCodeAt(i);
			hash |= 0;
		}

		let result = '';
		let absoluteHash = Math.abs(hash);

		for (let i = 0; i < 6; i++) {
			result += base62Chars[absoluteHash % 62];
			absoluteHash = Math.floor(absoluteHash / 62);
		}

		return result;
	}

	equals(other: ShortUrl): boolean {
		return this.value === other.value;
	}

	is(shortCode: string): boolean {
		return this.value === shortCode;
	}

	toValue(): string {
		return this.value;
	}

	toString(): string {
		return this.value;
	}
}
