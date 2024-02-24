import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// System imports
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Module({
	controllers: [RoleController, PermissionController, UserController],
	providers: [RoleService, PermissionService, UserService, JwtService],
})
export class UserModule {}
