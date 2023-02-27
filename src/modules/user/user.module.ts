import { Module } from '@nestjs/common';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { PermissionController } from './permission/permission.controller';
import { PermissionService } from './permission/permission.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  controllers: [
    RoleController,
    PermissionController,
    UserController,
  ],
  providers: [
    RoleService,
    PermissionService,
    UserService,
    JwtService,
    ConfigService,
  ],
})
export class UserModule {}
