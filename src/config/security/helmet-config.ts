import { HelmetOptions } from 'helmet';

export const helmetConfig: HelmetOptions = {
	contentSecurityPolicy: {
		directives: {
			defaultSrc: ["'self'"],
			scriptSrc: ["'self'"],
			styleSrc: ["'self'", "'unsafe-inline'"],
			imgSrc: ["'self'", 'data:', 'https:'],
		},
	},
	crossOriginEmbedderPolicy: false,
	hsts: {
		maxAge: 31_536_000,
		includeSubDomains: true,
		preload: true,
	},
};
