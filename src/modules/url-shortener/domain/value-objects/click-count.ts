export class ClickCount {
	public value: number = 0;

	private constructor(incrementBy: number) {
		this.value = this.increment(incrementBy);
	}

	private increment(incrementBy: number = 1): number {
		this.value += incrementBy;

		return this.value;
	}

	static create(increment: number): ClickCount {
		return new ClickCount(increment);
	}

	toValue(): number {
		return this.value;
	}

	toString(): number {
		return this.value;
	}
}
