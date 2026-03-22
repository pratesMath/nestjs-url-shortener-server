export class Left<F, S> {
	readonly value: F;

	constructor(value: F) {
		this.value = value;
	}

	isRight(): this is Right<F, S> {
		return false;
	}

	isLeft(): this is Left<F, S> {
		return true;
	}
}

export class Right<F, S> {
	readonly value: S;

	constructor(value: S) {
		this.value = value;
	}

	isRight(): this is Right<F, S> {
		return true;
	}

	isLeft(): this is Left<F, S> {
		return false;
	}
}

export type Either<F, S> = Left<F, S> | Right<F, S>;

export const left = <F, S>(value: F): Either<F, S> => {
	return new Left(value);
};

export const right = <F, S>(value: S): Either<F, S> => {
	return new Right(value);
};
