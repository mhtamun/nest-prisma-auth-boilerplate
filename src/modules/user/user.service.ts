import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorService } from 'src/util/error.service';
import { DbService } from 'src/db/db.service';
import { HashService } from 'src/util/hash.service';
import {
  CreateUserDto,
  SignInUserDto,
} from './dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly error: ErrorService,
    private readonly db: DbService,
    private readonly hash: HashService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async create(dto: CreateUserDto) {
    try {
      const hashedPassword =
        await this.hash.generateHash(
          dto.password,
        );

      const user = await this.db.user.create({
        data: {
          ...dto,
          password: hashedPassword,
        },
      });

      delete user.password;

      return {
        success: true,
        message: 'Success',
        data: {
          ...user,
        },
      };
    } catch (error) {
      const { name, message } =
        this.error.handleDbError(error, {
          unique:
            'There is an account already registered with this email! Kindly please try another email.',
        }) ?? {};

      // console.debug({ name, message });

      return {
        success: false,
        error:
          !_.isUndefined(name) &&
          !_.isNull(name) &&
          !_.isUndefined(message) &&
          !_.isNull(message)
            ? { name, message }
            : error,
      };
    }
  }

  signToken(email: string): Promise<string> {
    const payload = {
      email,
    };

    const secret = this.config.get('JWT_SECRET');

    return this.jwt.signAsync(payload, {
      expiresIn: '10080m',
      secret,
    });
  }

  async signIn(dto: SignInUserDto) {
    try {
      const user = await this.db.user.findUnique({
        where: { email: dto.email },
      });

      const credentialNotCorrectError = {
        name: 'unauthorized',
        message:
          'Unfortunately, you entered credentials are incorrect!',
      };

      if (!user) throw credentialNotCorrectError;

      const isPasswordMatched =
        await this.hash.matchHash(
          dto.password,
          user.password,
        );

      if (!isPasswordMatched)
        throw credentialNotCorrectError;

      const token = await this.signToken(
        user.email,
      );

      delete user.password;
      delete user.roleId;
      delete user.createdAt;
      delete user.updatedAt;

      return {
        success: true,
        message: `Hi ${user.name}, you are successfully signed in.`,
        data: {
          access_type: 'Bearer',
          access_token: token,
          user,
        },
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
