import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class AuthenticateInputDTO {
	@ApiProperty({
		description: 'User e-mail.',
		example: 'john.doe@acme.com',
		format: 'email',
		required: true,
	})
	@IsNotEmpty()
	@IsEmail({}, { message: 'Please, input a valid e-mail.' })
	email: string;

	@ApiProperty({
		description: 'User password.',
		example: 'JohnDoe@123',
		minLength: 8,
		required: true,
		writeOnly: true,
	})
	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	password: string;
}
