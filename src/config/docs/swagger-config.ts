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
      - Recover and Reset your password every time you need;
  	- URL Shortener:
      - Shorten your URL whenever you want;
			- Access your list of short links;

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
		'access-token'
	)
	.addTag('Auth', 'Authentication and User endpoints.')
	.addTag('Url Shortener', "Shortened Url's endpoints.")
	.build();

export function getSwaggerConfig() {
	return {
		swaggerConfig,
		title: title,
	};
}
