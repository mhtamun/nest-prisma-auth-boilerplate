import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DbService } from 'src/db/db.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt',
) {
  constructor(
    config: ConfigService,
    private readonly db: DbService,
  ) {
    super({
      jwtFromRequest:
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: {
    email: string;
  }): Promise<any> {
    try {
      const user = await this.db.user.findFirst({
        where: {
          isDeleted: false,
          email: payload.email,
        },
        include: {
          role: {
            include: {
              permissions: true,
            },
          },
        },
      });

      // console.debug('user', user);

      if (!user) {
        return false;
      }

      const role = user.role;

      // console.debug('role', role);

      if (!role) {
        return false;
      }

      const permissions = user.role.permissions;

      // console.debug('permissions', permissions);

      if (!permissions) {
        return false;
      }

      if (permissions.length === 0) {
        return false;
      }

      delete user.password;

      return {
        ...user,
      };
    } catch (error) {
      console.error('error', error);

      return false;
    }
  }
}
