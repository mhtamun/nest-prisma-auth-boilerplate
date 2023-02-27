import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { HashService } from 'src/util/hash.service';
import BaseService from '../base.service';
import {
  CreateUserDto,
  SignInUserDto,
  UpdateUserDto,
} from './dto';

@Injectable()
export class UserService extends BaseService {
  @Inject()
  private readonly hash: HashService;

  @Inject()
  private readonly jwt: JwtService;

  @Inject()
  private readonly config: ConfigService;

  constructor() {
    super('user');
  }

  signToken(email: string): Promise<string> {
    const payload = {
      email,
    };

    return this.jwt.signAsync(payload, {
      expiresIn: '10080m',
      secret: this.config.get('JWT_SECRET'),
    });
  }

  async signIn(dto: SignInUserDto) {
    try {
      const user = await super.readFirst({
        isDeleted: false,
        email: dto.email,
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

  async save(dto: CreateUserDto) {
    try {
      const hashedPassword =
        await this.hash.generateHash(
          dto.password,
        );

      const user = await super.create({
        ...dto,
        password: hashedPassword,
        isDeleted: false,
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
      const result = await super.readMany({
        isDeleted: false,
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
      const result = await super.readFirst({
        id,
        isDeleted: false,
      });

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
      const result = await super.update(
        { id },
        {
          ...dto,
        },
      );

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
      const result = await super.update(
        { id },
        { isDeleted: true },
      );

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
