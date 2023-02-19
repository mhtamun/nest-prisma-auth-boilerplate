import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
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
      });

      if (!user) {
        return false;
      }

      const role = await this.db.role.findFirst({
        where: {
          isDeleted: false,
          id: user.roleId,
        },
      });

      if (!role) {
        return false;
      }

      const permissions =
        await this.db.permission.findMany({
          where: { roleId: user.roleId },
        });

      if (
        !permissions ||
        permissions.length === 0
      ) {
        return false;
      }

      delete user.password;

      return {
        about: user,
        role,
        permissions,
      };
    } catch (error) {
      console.error('error', error);

      return false;
    }
  }
}
