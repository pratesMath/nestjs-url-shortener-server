import { BaseEntity } from '@shared/entities/base-entity';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';
import { Optional } from '@shared/types/optional';
import { Email } from '../value-objects/email';
import { UserStatus, UserStatusEnum } from '../value-objects/user-status';

export interface UserProps {
	username: string;
	email: Email;
	password: string;
	status: UserStatus;
	createdAt: Date;
	updatedAt?: Date | null;
	deletedAt?: Date | null;
}

export class User extends BaseEntity<UserProps> {
	get username() {
		return this.props.username;
	}

	get email() {
		return this.props.email;
	}

	get password() {
		return this.props.password;
	}

	get status() {
		return this.props.status;
	}

	get createdAt() {
		return this.props.createdAt;
	}

	get updatedAt() {
		return this.props.updatedAt;
	}

	get deletedAt() {
		return this.props.deletedAt ?? null;
	}

	static create(
		props: Optional<UserProps, 'status' | 'createdAt' | 'updatedAt'>,
		id?: UniqueEntityID
	) {
		const user = new User(
			{
				...props,
				status: props.status ?? UserStatus.create(UserStatusEnum.ACTIVE),
				createdAt: props.createdAt ?? new Date(),
				updatedAt: props.updatedAt ?? new Date(),
				deletedAt: props.deletedAt ?? null,
			},
			id
		);

		return user;
	}

	private touch() {
		this.props.updatedAt = new Date();
	}

	set username(username: string) {
		this.props.username = username;
		this.touch();
	}

	set password(password: string) {
		this.props.password = password;
		this.touch();
	}

	set status(status: UserStatus) {
		this.props.status = status;
		this.touch();
	}

	set deletedAt(deletedAt: Date | null) {
		if (deletedAt !== null) {
			this.props.deletedAt = deletedAt;
			this.props.status = UserStatus.create(UserStatusEnum.INACTIVE);
			this.touch();
		}
	}
}
