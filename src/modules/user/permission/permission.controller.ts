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
} from '@nestjs/common';
import { PermissionGuard } from '../../auth/guard';
import { PermissionService } from './permission.service';
import { ResponseService } from 'src/util/response.service';
import {
  CreatePermissionDto,
  UpdatePermissionDto,
} from '../dto';

const moduleName = 'role-permission';

@Controller('permissions')
export class PermissionController {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly responseService: ResponseService,
  ) {}

  @UseGuards(
    PermissionGuard(moduleName, 'create'),
  )
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(@Body() dto: CreatePermissionDto) {
    const result =
      await this.permissionService.create(dto);

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('')
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
  @Get(':id')
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
  @Put(':id')
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
  @Delete(':id')
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
