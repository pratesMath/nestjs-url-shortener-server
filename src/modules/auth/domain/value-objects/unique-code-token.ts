export class UniqueCodeToken {
	public value: number;

	private constructor() {
		this.value = this.generateUniqueNumericalCode();
	}

	static create(): UniqueCodeToken {
		return new UniqueCodeToken();
	}

	private shuffleArray<T>(array: T[]): T[] {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));

			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}
	private generateUniqueNumericalCode(): number {
		const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

		this.shuffleArray(digits);

		if (digits[0] === 0) {
			const randomIndex = Math.floor(Math.random() * 9) + 1;

			[digits[0], digits[randomIndex]] = [digits[randomIndex], digits[0]];
		}

		const codeDigits = digits.slice(0, 8);

		return Number.parseInt(codeDigits.join(''), 10);
	}

	toValue(): number {
		return this.value;
	}

	toString(): string {
		return this.value.toString();
	}
}
