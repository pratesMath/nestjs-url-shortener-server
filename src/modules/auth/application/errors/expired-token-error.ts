import { UseCaseError } from '@shared/errors/use-case-error';

export class ExpiredTokenError extends Error implements UseCaseError {
	constructor(identifier: number) {
		super(`Token code "${identifier}" already expired.`);
	}
}
