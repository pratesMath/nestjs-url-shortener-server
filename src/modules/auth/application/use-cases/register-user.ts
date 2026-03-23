import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';
import { Email } from '@auth-module/domain/value-objects/email';
import { Injectable } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { RegisterUserInputDTO, RegisterUserOutputDTO } from '../dtos';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';

type RegisterUserUseCaseOutput = Either<UserAlreadyExistsError, RegisterUserOutputDTO>;

@Injectable()
export class RegisterUserUseCase {
	constructor(
		private readonly hashGenerator: HashGenerator,
		private readonly usersRepository: UsersRepository
	) {}

	async execute({
		username,
		email,
		password,
	}: RegisterUserInputDTO): Promise<RegisterUserUseCaseOutput> {
		const foundUser = await this.usersRepository.findByEmail(email);

		if (foundUser) {
			return left(new UserAlreadyExistsError(email));
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const user = User.create({
			username,
			email: Email.create(email),
			password: hashedPassword,
		});

		await this.usersRepository.create(user);

		return right({
			user,
		});
	}
}
