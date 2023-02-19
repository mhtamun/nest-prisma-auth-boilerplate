import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';
import * as _ from 'lodash';

export const PermissionGuard = (
  moduleName: string,
  permissionType: string,
): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtGuard {
    constructor() {
      super();
    }

    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context
        .switchToHttp()
        .getRequest();

      const { permissions } = request.user;

      if (
        !_.some(permissions, (permission) => {
          return (
            _.isEqual(
              permission.moduleName,
              moduleName,
            ) &&
            _.isEqual(
              permission.permissionType,
              permissionType,
            )
          );
        })
      )
        return false;

      return true;
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
