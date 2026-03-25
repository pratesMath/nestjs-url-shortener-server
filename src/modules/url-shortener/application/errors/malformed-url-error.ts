import { UseCaseError } from '@shared/errors/use-case-error';

export class MalformedURLError extends Error implements UseCaseError {
	constructor(url: string) {
		super(`Invalid URL: ${url}`);
	}
}
