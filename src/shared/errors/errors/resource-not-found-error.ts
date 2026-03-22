import { UseCaseError } from '../use-case-error';

export class ResourceNotFoundError extends Error implements UseCaseError {
	constructor(message?: string) {
		if (message) {
			super(`Resource not found: ${message}.`);
		} else {
			super('Resource not found.');
		}
	}
}
