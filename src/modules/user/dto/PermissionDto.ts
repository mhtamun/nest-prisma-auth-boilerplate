import {
  IsNumber,
  IsPositive,
  IsString,
  IsNotEmpty,
} from 'class-validator';

export class CreatePermissionDto {
  @IsNumber()
  @IsPositive()
  roleId: number;

  @IsString()
  @IsNotEmpty()
  moduleName: string;

  @IsString()
  @IsNotEmpty()
  permissionType: string;
}

export class UpdatePermissionDto {
  @IsString()
  @IsNotEmpty()
  moduleName: string;

  @IsString()
  @IsNotEmpty()
  permissionType: string;
}
