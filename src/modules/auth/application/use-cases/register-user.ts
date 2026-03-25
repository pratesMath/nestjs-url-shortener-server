import { User } from '@auth-module/domain/entities/user';
import { UsersRepository } from '@auth-module/domain/repositories/users-repository';
import { HashGenerator } from '@auth-module/domain/services/cryptography/hash-generator';
import { Email } from '@auth-module/domain/value-objects/email';
import { Injectable, Logger } from '@nestjs/common';
import { Either, left, right } from '@shared/either';
import { RegisterUserInputDTO, RegisterUserOutputDTO } from '../dtos';
import { UserAlreadyExistsError } from '../errors/user-already-exists-error';

type RegisterUserUseCaseOutput = Either<UserAlreadyExistsError, RegisterUserOutputDTO>;

@Injectable()
export class RegisterUserUseCase {
	private readonly logger = new Logger(RegisterUserUseCase.name);

	constructor(
		private readonly hashGenerator: HashGenerator,
		private readonly usersRepository: UsersRepository
	) {}

	async execute({
		username,
		email,
		password,
	}: RegisterUserInputDTO): Promise<RegisterUserUseCaseOutput> {
		this.logger.log({
			message: 'Processing new user registration.',
			email,
			username,
		});
		const foundUser = await this.usersRepository.findByEmail(email);

		if (foundUser) {
			this.logger.warn({
				message: 'Registration failed: email already in use.',
				email,
			});
			return left(new UserAlreadyExistsError(email));
		}

		const hashedPassword = await this.hashGenerator.hash(password);

		const user = User.create({
			username,
			email: Email.create(email),
			password: hashedPassword,
		});

		await this.usersRepository.create(user);

		this.logger.log({
			message: 'User registered successfully.',
			userId: user.id.toString(),
			email,
		});

		return right({
			user,
		});
	}
}
