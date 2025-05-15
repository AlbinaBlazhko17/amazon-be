import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
	@ApiProperty({
		description: 'The name of the user',
		required: false,
		example: 'John Doe'
	})
	@IsOptional()
	@IsString()
	name: string;

	@ApiProperty({
		description: 'The email address of the user',
		format: 'email',
		required: true,
		example: 'john@example.com'
	})
	@IsEmail()
	email: string;

	@ApiProperty({
		description: "The user's password",
		minLength: 6,
		required: true,
		example: 'password123'
	})
	@MinLength(6, {
		message:
			'Password is too short. Minimal length is $constraint1 characters, but actual is $value'
	})
	@IsString()
	password: string;

	@ApiProperty({
		description: "URL to the user's avatar image",
		required: false,
		nullable: true,
		example: 'https://example.com/avatar.jpg'
	})
	@IsOptional()
	avatarUrl: string | null;

	@ApiProperty({
		description: "The user's phone number",
		required: false,
		nullable: true,
		example: '+1234567890'
	})
	@IsOptional()
	@IsPhoneNumber()
	phoneNumber: string | null;
}
