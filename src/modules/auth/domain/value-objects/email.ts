export class Email {
	public value: string;

	private constructor(email: string) {
		const trimmedEmail = email.trim();
		if (!Email.isValid(trimmedEmail)) {
			throw new Error(`Invalid e-mail address: ${trimmedEmail}.`);
		}
		this.value = trimmedEmail.toLowerCase();
	}
	static isValid(email: string): boolean {
		if (!email) {
			return false;
		}
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	static create(email: string): Email {
		return new Email(email);
	}

	getDomain(): string {
		const parts = this.value.split('@');
		return parts[1];
	}

	getLocalPart(): string {
		const parts = this.value.split('@');
		return parts[0];
	}

	equals(other: Email): boolean {
		return this.value === other.value;
	}

	is(email: string): boolean {
		return this.value === email;
	}

	toValue(): string {
		return this.value;
	}

	toString(): string {
		return this.value;
	}
}
