import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
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

      // console.debug(
      //   'request -> user',
      //   request.user,
      // );

      const { permissions } = request.user.role;

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
