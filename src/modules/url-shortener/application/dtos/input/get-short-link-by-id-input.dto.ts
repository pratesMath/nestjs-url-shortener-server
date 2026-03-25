import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class GetShortLinkByIdInputDTO {
	@ApiProperty({
		description: 'shortLinkId.',
		example: 'baa7e502-cf66-4ef6-9d96-6740b1496b5f',
		format: 'uuid',
		required: true,
	})
	@IsNotEmpty()
	@IsUUID()
	shortLinkId: string;
}
