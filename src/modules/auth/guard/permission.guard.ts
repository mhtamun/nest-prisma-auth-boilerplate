import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as _ from 'lodash';
import { JwtGuard } from '.';

@Injectable()
export class PermissionGuard
  extends JwtGuard
  implements CanActivate
{
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    await super.canActivate(context);

    const modulePermission =
      this.reflector.get<string>(
        'ModulePermission',
        context.getHandler(),
      );

    const request = context
      .switchToHttp()
      .getRequest();

    const { role } = request.user;
    const { permissions } = role;

    if (
      !_.some(permissions, (permission) => {
        return (
          _.isEqual(
            permission.moduleName,
            modulePermission[0],
          ) &&
          _.isEqual(
            permission.permissionType,
            modulePermission[1],
          )
        );
      })
    )
      return false;

    return true;
  }
}
