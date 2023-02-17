import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorService } from 'src/util/error.service';
import { DbService } from 'src/db/db.service';
import { HashService } from 'src/util/hash.service';
import {
  SignInUserDto,
  CreateUserDto,
  UpdateUserDto,
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
      const user = await this.db.user.findFirst({
        where: {
          isDeleted: false,
          email: dto.email,
        },
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
      delete user.isDeleted;
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
          isDeleted: false,
        },
      });

      delete user.password;

      return {
        success: true,
        data: {
          ...user,
        },
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async getAll() {
    try {
      const result = await this.db.user.findMany({
        where: { isDeleted: false },
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async getById(id: number) {
    try {
      const result = await this.db.user.findFirst(
        {
          where: { isDeleted: false, id },
        },
      );

      return {
        success: true,
        message: 'Success',
        data: result,
      };
    } catch (error) {
      console.error('error', error);

      return {
        success: false,
        error,
      };
    }
  }

  async editById(id: number, dto: UpdateUserDto) {
    try {
      const result = await this.db.user.update({
        where: { id },
        data: {
          ...dto,
        },
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async removeById(id: number) {
    try {
      const result = await this.db.user.update({
        where: { id },
        data: { isDeleted: true },
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
