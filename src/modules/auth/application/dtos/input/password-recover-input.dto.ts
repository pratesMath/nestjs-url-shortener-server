import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRecoverInputDTO {
	@IsEmail({}, { message: 'Please, input a valid e-mail.' })
	@IsNotEmpty()
	email: string;
}
