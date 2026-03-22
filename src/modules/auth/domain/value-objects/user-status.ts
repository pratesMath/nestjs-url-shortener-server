export enum UserStatusEnum {
	ACTIVE = 'ACTIVE',
	INACTIVE = 'INACTIVE',
}

export class UserStatus {
	public value: UserStatusEnum;

	private constructor(value: string) {
		if (!UserStatus.isValid(value)) {
			throw new Error(`Invalid UserStatus: ${value}`);
		}

		this.value = value as UserStatusEnum;
	}

	static isValid(userStatus: string): boolean {
		const normalized = userStatus.toUpperCase() as keyof typeof UserStatusEnum;

		return normalized in UserStatusEnum;
	}

	static create(userStatus: UserStatusEnum): UserStatus {
		return new UserStatus(userStatus);
	}

	equals(other: UserStatus): boolean {
		return this.value === other.value;
	}

	is(userStatus: UserStatusEnum): boolean {
		return this.value === userStatus;
	}

	toValue(): UserStatusEnum {
		return this.value;
	}

	toString(): string {
		return this.value;
	}
}
