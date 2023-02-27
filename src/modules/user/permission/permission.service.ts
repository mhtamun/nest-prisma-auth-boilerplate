import {
  Inject,
  Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';
import BaseService from 'src/modules/base.service';
import { ConstantService } from 'src/util/constant.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto';

@Injectable()
export class PermissionService extends BaseService {
  @Inject()
  private readonly constant: ConstantService;

  constructor() {
    super('permission');
  }

  async save(dto: CreatePermissionDto) {
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

  async getAllModuleNames() {
    try {
      const result =
        this.constant.getModuleNameList();

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

  async getAllPermissionTypes() {
    try {
      const result =
        this.constant.getPermissionTypeList();

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

  async getAll(roleId: number | null) {
    try {
      let result = null;

      if (!roleId)
        result = await super.readMany(
          { isDeleted: false },
          {
            role: true,
          },
        );
      else
        result = await super.readMany(
          { isDeleted: false, roleId },
          {
            role: true,
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
          role: true,
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

  async editById(
    id: number,
    dto: UpdatePermissionDto,
  ) {
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
