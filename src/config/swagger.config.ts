import { DocumentBuilder } from '@nestjs/swagger';

export const config = new DocumentBuilder()
	.setTitle('E-commerce API (Amazon clone)')
	.setDescription('API documentation for the E-commerce application, inspired by Amazon.')
	.setVersion('1.0')
	.addBearerAuth(
		{
			type: 'http',
			scheme: 'bearer',
			bearerFormat: 'JWT',
			name: 'JWT',
			description: 'Enter JWT token',
			in: 'header'
		},
		'JWT-auth'
	)
	.build();
