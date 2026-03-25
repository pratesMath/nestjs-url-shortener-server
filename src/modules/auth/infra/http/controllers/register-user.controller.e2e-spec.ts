import * as schema from '@config/database/drizzle/schema';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { drizzle } from '@test/setup-e2e';
import { eq } from 'drizzle-orm';
import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import { AppModule } from '../../../../../app.module';

describe('[E2E] Register User', () => {
	let app: INestApplication;

	beforeAll(async () => {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleRef.createNestApplication();

		await app.init();
	});

	it('[POST] /auth/v1/sign-up', async () => {
		const response = await request(app.getHttpServer()).post('/auth/v1/sign-up').send({
			username: 'John Doe',
			email: 'john.doe@acme.com',
			password: '1234567890',
		});

		expect(response.statusCode).toBe(201);

		const userOnDatabase = await drizzle
			.select()
			.from(schema.users)
			.where(eq(schema.users.email, 'john.doe@acme.com'));
		expect(userOnDatabase).toBeTruthy();
	});
});
