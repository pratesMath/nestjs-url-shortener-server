import process from 'node:process';

export const CORSConfig = {
	origin: (origin, callback) => {
		if (!origin) return callback(null, true);

		const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || ['*'];

		if (allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
			callback(null, true);
		} else {
			callback(new Error('Not allowed by CORS'));
		}
	},
	methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
	allowedHeaders: [
		'Content-Type',
		'Authorization',
		'X-Requested-With',
		'Accept',
		'Origin',
		'Access-Control-Request-Method',
		'Access-Control-Request-Headers',
	],
	credentials: true,
	maxAge: 86_400, // 24 hours
};
