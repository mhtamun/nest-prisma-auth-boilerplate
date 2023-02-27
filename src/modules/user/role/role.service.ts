import { Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import BaseService from 'src/modules/base.service';
import { CreateRoleDto } from '../dto';

@Injectable()
export class RoleService extends BaseService {
  constructor() {
    super('role');
  }

  async save(dto: CreateRoleDto) {
    try {
      const user = await super.create({
        ...dto,
        isDeleted: false,
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
      const result = await super.readMany(
        { isDeleted: false },
        {
          permissions: true,
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

  async getById(id: number) {
    try {
      const result = await super.readFirst(
        { isDeleted: false, id },
        {
          permissions: true,
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
