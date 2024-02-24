import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FileType, GeneralStatus } from '@prisma/client';

export class FileDto {
	@IsString()
	@IsNotEmpty()
	folderId: string;

	@IsEnum(FileType)
	@IsOptional()
	type: FileType;

	@IsString()
	@IsOptional()
	name: string;

	@IsEnum(GeneralStatus)
	@IsNotEmpty()
	status: GeneralStatus;
}
