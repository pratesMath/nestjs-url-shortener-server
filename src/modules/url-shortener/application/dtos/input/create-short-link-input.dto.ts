import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateShortLinkInputDTO {
	@ApiProperty({
		description: 'Give a description to your short link.',
		example: "It's a description to my short link.",
		required: false,
	})
	@IsString({})
	description: string | null;

	@ApiProperty({
		description: 'URL to be hidden by a short URL.',
		example: 'https://github.com/',
		required: true,
	})
	@IsNotEmpty()
	@IsUrl({}, { message: 'Please, input a valid URL.' })
	originalUrl: string;
}
