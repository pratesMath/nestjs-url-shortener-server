import { DocumentBuilder } from '@nestjs/swagger';

const title = 'NestJS URL Shortener Server';

export const swaggerConfig = new DocumentBuilder()
	.setTitle(title)
	.setDescription(
		`
    NodeJS application developed with NestJS to create and serve an URL Shortener Server.

    Resources available:
    - Auth & Users:
      - Create your account;
      - View and Update your profile with privacy;
      - Recover and Reset your password whenever you want;

    Authentication method:
    - Use JWT Bearer token for protected routes;
    `
	)
	.setVersion('1.0.0')
	.addBearerAuth(
		{
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			name: 'JWT',
			description: 'Input here your JWT Access Token.',
			in: 'header',
		},
		'JWT Auth'
	)
	.addTag('Auth', 'Authentication and User access endpoints.')
	.build();

export function getSwaggerConfig() {
	return {
		swaggerConfig,
		title: title,
	};
}
