import { OmitType } from '@nestjs/mapped-types';
import { Prisma } from '@prisma/client';
import { IsEmail, IsString, IsNumber, IsPositive, Length, IsNotEmpty, IsEmpty, IsOptional } from 'class-validator';

export class SignInUserDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}

export class UserDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsNumber()
	@IsPositive()
	@IsNotEmpty()
	roleId: number;

	@IsString()
	@IsOptional()
	phone?: string;

	@IsString()
	@Length(10, 17)
	@IsOptional()
	nid?: string;

	@IsString()
	@IsOptional()
	dateOfBirth?: string;

	@IsString()
	@IsOptional()
	gender?: string;

	@IsString()
	@IsOptional()
	address?: string;

	@IsString()
	@IsNotEmpty()
	status: string;
}

export class UserCreateDto extends OmitType(UserDto, ['status']) {}

export class UserUpdateDto extends OmitType(UserDto, ['password']) {}
