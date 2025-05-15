import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
	@ApiProperty({ example: 'user@example.com', description: 'The email of the user' })
	@IsEmail()
	email: string;

	@ApiProperty({ example: 'John Doe', description: 'The name of the user', required: false })
	@IsOptional()
	@IsString()
	name?: string;

	@ApiProperty({
		example: 'password123',
		description: 'User password (min 6 characters)',
		minLength: 6
	})
	@MinLength(6, {
		message: 'Password must be at least 6 characters long'
	})
	@IsString()
	password: string;
}
