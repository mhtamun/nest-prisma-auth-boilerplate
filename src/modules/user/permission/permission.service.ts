import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { DbService } from 'src/db/db.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto';

@Injectable()
export class PermissionService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreatePermissionDto) {
    try {
      const user =
        await this.db.permission.create({
          data: {
            ...dto,
            isDeleted: false,
          },
        });

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

  async getAll(roleId: number | null) {
    try {
      let result = null;

      if (!roleId)
        result =
          await this.db.permission.findMany({
            where: { isDeleted: false },
            include: {
              role: true,
            },
          });
      else
        result =
          await this.db.permission.findMany({
            where: { isDeleted: false, roleId },
            include: {
              role: true,
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

  async getById(id: number) {
    try {
      const result =
        await this.db.permission.findFirst({
          where: { isDeleted: false, id },
          include: {
            role: true,
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

  async editById(
    id: number,
    dto: UpdatePermissionDto,
  ) {
    try {
      const result =
        await this.db.permission.update({
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
      const result =
        await this.db.permission.update({
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
