import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthenticateInputDTO {
	@IsNotEmpty()
	@IsEmail({}, { message: 'Please, input a valid e-mail.' })
	email: string;

	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	password: string;
}
