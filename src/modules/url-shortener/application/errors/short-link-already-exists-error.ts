import { UseCaseError } from '@shared/errors/use-case-error';

export class ShortLinkAlreadyExistsError extends Error implements UseCaseError {
	constructor(identifier: string) {
		super(`Short link "${identifier}" already exists.`);
	}
}
