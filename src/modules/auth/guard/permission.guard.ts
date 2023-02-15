import {
  CanActivate,
  ExecutionContext,
  mixin,
  Type,
} from '@nestjs/common';
import { JwtGuard } from './jwt.guard';

export const PermissionGuard = (
  moduleName: string,
  permissionType: string,
): Type<CanActivate> => {
  class PermissionGuardMixin extends JwtGuard {
    async canActivate(context: ExecutionContext) {
      await super.canActivate(context);

      const request = context
        .switchToHttp()
        .getRequest();

      const user = request.user;
      console.debug('user', user);
      console.debug('moduleName', moduleName);
      console.debug(
        'permissionType',
        permissionType,
      );

      // todo: implement check permissions
      return false;
    }
  }

  return mixin(PermissionGuardMixin);
};

export default PermissionGuard;
