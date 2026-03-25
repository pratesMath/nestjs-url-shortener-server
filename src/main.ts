import { getSwaggerConfig } from '@config/docs/swagger-config';
import { EnvService } from '@config/env/env.service';
import { CORSConfig, helmetConfig } from '@config/security';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.use(helmet(helmetConfig));
	app.enableCors(CORSConfig);

	app.useGlobalPipes(
		new ValidationPipe({
			transform: true,
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	);
	// Swagger
	const { swaggerConfig, title } = getSwaggerConfig();
	const document = SwaggerModule.createDocument(app, swaggerConfig);
	SwaggerModule.setup('/docs', app, document, {
		swaggerOptions: {
			persistAuthorization: true,
		},
		customSiteTitle: `${title} Documentation`,
		customCss: /* css */ `
				.swagger-ui .info .title { color: #0062ff; }
			`,
	});

	const env = app.get(EnvService);
	const PORT = env.get('PORT');

	await app.listen(PORT, () => {
		Logger.log(`🚀 Http server is running - http://localhost:${PORT}`);
		Logger.log(`📚 API Docs is available - http://localhost:${PORT}/docs`);
	});
}
bootstrap();
