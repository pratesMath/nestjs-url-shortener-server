import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class PasswordResetInputDTO {
	@ApiProperty({
		description: 'Reset password code (numerical token).',
		example: '87654321',
		format: 'int32',
		required: true,
	})
	@IsNotEmpty({ message: 'Please, input a valid code.' })
	code: number;

	@ApiProperty({
		description: 'User password.',
		example: 'JohnDoe@123',
		minLength: 8,
		required: true,
		writeOnly: true,
	})
	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	newPassword: string;
}
