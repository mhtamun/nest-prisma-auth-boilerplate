import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { DbService } from 'src/db/db.service';
import { CreateRoleDto } from '../dto';

@Injectable()
export class RoleService {
  constructor(private readonly db: DbService) {}

  async create(dto: CreateRoleDto) {
    try {
      const user = await this.db.role.create({
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

  async getAll() {
    try {
      const result = await this.db.role.findMany({
        where: { isDeleted: false },
        include: {
          permissions: true,
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
      const result = await this.db.role.findFirst(
        {
          where: { isDeleted: false, id },
          include: {
            permissions: true,
          },
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

  async editById(id: number, dto: CreateRoleDto) {
    try {
      const result = await this.db.role.update({
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
      const result = await this.db.role.update({
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
