import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { GeneralStatus } from '@prisma/client';

export class CreateFolderDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsEnum(GeneralStatus)
	@IsNotEmpty()
	status: GeneralStatus;
}

export class UpdateFolderDto extends PartialType(CreateFolderDto) {}
