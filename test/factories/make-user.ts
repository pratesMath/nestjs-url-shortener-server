import { User, UserProps } from '@auth-module/domain/entities/user';
import { Email } from '@auth-module/domain/value-objects/email';
import { faker } from '@faker-js/faker';
import { UniqueEntityID } from '@shared/entities/unique-entity-id';

export function makeUser(override: Partial<UserProps> = {}, id?: UniqueEntityID) {
	const user = User.create(
		{
			username: faker.person.fullName(),
			email: Email.create(faker.internet.email()),
			password: faker.internet.password(),
			...override,
		},
		id
	);

	return user;
}
