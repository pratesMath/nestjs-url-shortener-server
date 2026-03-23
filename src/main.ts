import { getSwaggerConfig } from '@config/docs/swagger-config';
import { EnvService } from '@config/env/env.service';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix('/api');

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);

	const env = app.get(EnvService);
	const PORT = env.get('PORT');

	// Swagger
	const { swaggerConfig, title } = getSwaggerConfig();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('/docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
		customSiteTitle: `${title} Documentation`,
		customCss: /* css */ `
				/* .swagger-ui .topbar { display: none } */
				.swagger-ui .info .title { color: #3b82f6; }
			`,
	});

	await app.listen(PORT, () => {
		Logger.log(`🚀 Http server is running - http://localhost:${PORT}/api`);
		Logger.log(`📚 API Docs is available. - http://localhost:${PORT}/docs`);
	});
}
bootstrap();
