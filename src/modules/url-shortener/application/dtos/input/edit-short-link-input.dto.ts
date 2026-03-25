import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsUUID } from 'class-validator';

export class EditShortLinkInputDTO {
	@ApiProperty({
		description: 'shortLinkId.',
		example: 'baa7e502-cf66-4ef6-9d96-6740b1496b5f',
		format: 'uuid',
		required: true,
	})
	@IsNotEmpty()
	@IsUUID()
	shortLinkId: string;

	@ApiProperty({
		description: 'URL to be hidden by a short URL.',
		example: 'https://github.com/',
		required: true,
	})
	@IsNotEmpty()
	@IsUrl({}, { message: 'Please, input a valid URL.' })
	newOriginalUrl: string;

	@ApiProperty({
		description: 'Give a description to your short link.',
		example: "It's a description to my short link.",
		required: false,
	})
	@IsString()
	newDescription: string | null;
}
