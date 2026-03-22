import { IsNotEmpty, MinLength } from 'class-validator';

export class PasswordResetInputDTO {
	@IsNotEmpty({ message: 'Please, input a valid code.' })
	@MinLength(8, { message: 'Minimum 8 characters.' })
	code: number;

	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	password: string;
}
