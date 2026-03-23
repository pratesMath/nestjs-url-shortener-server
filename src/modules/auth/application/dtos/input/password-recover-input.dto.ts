import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class PasswordRecoverInputDTO {
	@ApiProperty({
		description: 'User e-mail.',
		example: 'john.doe@acme.com',
		format: 'email',
		required: true,
	})
	@IsEmail({}, { message: 'Please, input a valid e-mail.' })
	@IsNotEmpty()
	email: string;
}
