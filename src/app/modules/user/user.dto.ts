import { IsEmail, IsOptional, IsPhoneNumber, IsString, MinLength } from 'class-validator';

export class UserDto {
	@IsOptional()
	@IsString()
	name: string;

	@IsEmail()
	email: string;

	@MinLength(6, {
		message:
			'Password is too short. Minimal length is $constraint1 characters, but actual is $value'
	})
	@IsString()
	password: string;

	@IsOptional()
	avatarUrl: string | null;

	@IsOptional()
	@IsPhoneNumber()
	phoneNumber: string | null;
}
