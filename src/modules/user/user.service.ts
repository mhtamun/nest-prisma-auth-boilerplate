import {
  Inject,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
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
      const data = await super.transact(
        async (tx: Prisma.TransactionClient) => {
          const user = await super.readFirst(tx, {
            isDeleted: false,
            email: dto.email,
          });

          const credentialNotCorrectError = {
            name: 'unauthorized',
            message:
              'Unfortunately, you entered credentials are incorrect!',
          };

          if (!user)
            throw credentialNotCorrectError;

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
            access_type: 'Bearer',
            access_token: token,
            user,
          };
        },
      );

      return {
        success: true,
        message: `Hi, you are successfully signed in.`,
        data,
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

      const data = await super.transact(
        async (tx) => {
          const user = await super.create(tx, {
            ...dto,
            password: hashedPassword,
            isDeleted: false,
          });

          delete user.password;

          return user;
        },
      );

      return {
        success: true,
        data,
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
      const data = await super.transact(
        async (tx: Prisma.TransactionClient) => {
          return await super.readMany(tx, {
            isDeleted: false,
          });
        },
      );

      return {
        success: true,
        data,
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
      const data = await super.transact(
        async (tx: Prisma.TransactionClient) => {
          return await super.readFirst(tx, {
            isDeleted: false,
            id,
          });
        },
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }

  async editById(id: number, dto: UpdateUserDto) {
    try {
      const data = await super.transact(
        async (tx: Prisma.TransactionClient) => {
          return await super.update(
            tx,
            { id },
            {
              ...dto,
            },
          );
        },
      );

      return {
        success: true,
        data,
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
      const data = await super.transact(
        async (tx: Prisma.TransactionClient) => {
          return await super.update(
            tx,
            { id },
            { isDeleted: true },
          );
        },
      );

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error,
      };
    }
  }
}
