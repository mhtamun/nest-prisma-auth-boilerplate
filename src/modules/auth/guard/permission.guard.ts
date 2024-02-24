import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';
import { JwtGuard } from '.';

@Injectable()
export class PermissionGuard extends JwtGuard implements CanActivate {
	constructor(private reflector: Reflector) {
		super();
	}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		await super.canActivate(context);

		const modulePermission = this.reflector.get<string>('ModulePermission', context.getHandler());
		const request = context.switchToHttp().getRequest();
		const { user } = request;
		const { role } = user;

		if (!role) {
			return false;
		}

		// For only super admin role we wil bypass the permission check
		if (role.name === 'Super Admin' && user.name === 'Super Admin') {
			return true;
		}

		const { permissions } = role;
		// console.debug('permissions', permissions);

		if (!permissions || permissions.length === 0) {
			return false;
		}

		if (
			!_.some(permissions, permission => {
				return (
					_.isEqual(permission.moduleName, modulePermission[0]) &&
					_.isEqual(permission.permissionType, modulePermission[1])
				);
			})
		)
			return false;

		return true;
	}
}
