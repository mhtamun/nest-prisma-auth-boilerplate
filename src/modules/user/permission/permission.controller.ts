import {
  UseGuards,
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Delete,
  Put,
  Inject,
} from '@nestjs/common';

import { PermissionService } from './permission.service';
import { ResponseService } from 'src/util/response.service';
import { moduleName } from '../role/role.controller';
import { ModulePermission } from 'src/modules/auth/decorator';
import { PermissionGuard } from '../../auth/guard';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from './dto';

@Controller()
export class PermissionController {
  @Inject()
  private readonly permissionService: PermissionService;

  @Inject()
  private readonly responseService: ResponseService;

  @ModulePermission(moduleName, 'create')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('api/v1/permissions')
  async create(@Body() dto: CreatePermissionDto) {
    const result =
      await this.permissionService.save(dto);

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/permission-modules')
  async readAllModuleNames() {
    const result =
      await this.permissionService.getAllModuleNames();

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/permission-types')
  async readAllPermissionTypes() {
    const result =
      await this.permissionService.getAllPermissionTypes();

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/permissions')
  async readAll() {
    const result =
      await this.permissionService.getAll(null);

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/roles/:roleId/permissions')
  async readAllByRole(
    @Param('roleId') roleId: string,
  ) {
    const result =
      await this.permissionService.getAll(
        parseInt(roleId),
      );

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('api/v1/permissions/:id')
  async readById(@Param('id') id) {
    const result =
      await this.permissionService.getById(
        parseInt(id),
      );

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'update')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Put('api/v1/permissions/:id')
  async updateById(
    @Param('id') id,
    @Body() dto: UpdatePermissionDto,
  ) {
    const result =
      await this.permissionService.editById(
        parseInt(id),
        dto,
      );

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'delete')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('api/v1/permissions/:id')
  async deleteById(@Param('id') id) {
    const result =
      await this.permissionService.removeById(
        parseInt(id),
      );

    return this.responseService.handleResponse(
      result,
    );
  }
}
