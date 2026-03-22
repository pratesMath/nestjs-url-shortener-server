import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegisterUserInputDTO {
	@IsNotEmpty()
	username: string;

	@IsEmail({}, { message: 'Please, input a valid e-mail.' })
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	password: string;
}
