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
import { PermissionGuard } from '../../auth/guard';
import { PermissionService } from './permission.service';
import { ResponseService } from 'src/util/response.service';
import { ConstantService } from 'src/util/constant.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto';

const moduleName = 'role-permission';

@Controller()
export class PermissionController {
  @Inject()
  private readonly permissionService: PermissionService;

  @Inject()
  private readonly responseService: ResponseService;

  @Inject()
  private readonly constant: ConstantService;

  @UseGuards(
    PermissionGuard(moduleName, 'create'),
  )
  @HttpCode(HttpStatus.OK)
  @Post('permissions')
  async create(@Body() dto: CreatePermissionDto) {
    const result =
      await this.permissionService.save(dto);

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('permissions/modules/names')
  async readAllModuleNames() {
    const result =
      await this.permissionService.getAllModuleNames();

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('permissions/types/names')
  async readAllPermissionTypes() {
    const result =
      await this.permissionService.getAllPermissionTypes();

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('permissions')
  async readAll() {
    const result =
      await this.permissionService.getAll(null);

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('roles/:roleId/permissions')
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

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('permissions/:id')
  async readById(@Param('id') id) {
    const result =
      await this.permissionService.getById(
        parseInt(id),
      );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(
    PermissionGuard(moduleName, 'update'),
  )
  @HttpCode(HttpStatus.OK)
  @Put('permissions/:id')
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

  @UseGuards(
    PermissionGuard(moduleName, 'delete'),
  )
  @HttpCode(HttpStatus.OK)
  @Delete('permissions/:id')
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
