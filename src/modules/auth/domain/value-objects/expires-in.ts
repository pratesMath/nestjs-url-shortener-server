import { dateFns } from '@shared/libs/date-fns';

export type TimeToExpires = 'THIRTY_MINUTES' | 'ONE_HOUR';

export class ExpiresIn {
	public readonly value: Date;

	private constructor(expiresIn: TimeToExpires, creationTime: Date) {
		let durationInMinutes: number;

		switch (expiresIn) {
			case 'THIRTY_MINUTES':
				durationInMinutes = 30;
				break;
			case 'ONE_HOUR':
				durationInMinutes = 60;
				break;
			default:
				durationInMinutes = 30;
				console.warn(`Unknown expiration time "${expiresIn}", defaulting to 30 minutes.`);
		}

		this.value = dateFns.addMinutes(creationTime, durationInMinutes);
	}

	static create(expiresIn: TimeToExpires, creationTime: Date = new Date()): ExpiresIn {
		return new ExpiresIn(expiresIn, creationTime);
	}

	isBefore(time: Date): boolean {
		return dateFns.isBefore(this.value, time);
	}

	isAfter(time: Date): boolean {
		return dateFns.isAfter(this.value, time);
	}

	toValue(): Date {
		return this.value;
	}

	toString(): string {
		return this.value.toString();
	}
}
