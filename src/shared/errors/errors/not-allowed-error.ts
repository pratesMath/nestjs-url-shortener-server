import { UseCaseError } from '../use-case-error';

export class NotAllowedError extends Error implements UseCaseError {
	constructor(message?: string) {
		if (message) {
			super(`It's not allowed to: ${message}`);
		} else {
			super('Not allowed.');
		}
	}
}
