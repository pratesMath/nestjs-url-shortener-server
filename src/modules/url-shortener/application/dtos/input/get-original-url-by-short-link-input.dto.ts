import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';

export class GetOriginalUrlByShortLinkInputDTO {
	@ApiProperty({
		description: 'URL shorted.',
		example: 'D69H6b',
		required: true,
	})
	@IsNotEmpty({ message: 'Please, provide a valid short link.' })
	@Length(6, 6, { message: 'Please, provide a short link with 6 characters.' })
	shortedLink: string;
}
