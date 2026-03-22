import { IsNotEmpty, IsUUID, MinLength } from 'class-validator';

export class EditUserInputDTO {
	@IsNotEmpty()
	@IsUUID()
	currentUserId: string;

	@IsNotEmpty()
	username: string;

	@IsNotEmpty()
	@MinLength(8, { message: 'Minimum 8 characters.' })
	passwordToConfirm: string;
}
