import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class EditUserInputDTO {
	@ApiProperty({
		description: 'Username.',
		example: 'John Doe',
		required: true,
	})
	@IsNotEmpty()
	username: string;

	@ApiProperty({
		description: 'User password.',
		example: 'JohnDoe@123',
		minLength: 8,
		required: true,
		writeOnly: true,
	})
	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	passwordToConfirm: string;
}
