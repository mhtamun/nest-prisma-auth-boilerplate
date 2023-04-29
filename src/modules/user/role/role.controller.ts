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
import { RoleService } from './role.service';
import { ResponseService } from 'src/util/response.service';
import { ModulePermission } from 'src/modules/auth/decorator';
import { PermissionGuard } from '../../auth/guard';
import { CreateRoleDto } from './dto';

export const moduleName = 'role-permission';

@Controller('roles')
export class RoleController {
  @Inject()
  private readonly roleService: RoleService;

  @Inject()
  private readonly responseService: ResponseService;

  @ModulePermission(moduleName, 'create')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(@Body() dto: CreateRoleDto) {
    const result = await this.roleService.save(
      dto,
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get('')
  async readAll() {
    const result =
      await this.roleService.getAll();

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'read')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async readById(@Param('id') id) {
    const result = await this.roleService.getById(
      parseInt(id),
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @ModulePermission(moduleName, 'update')
  @UseGuards(PermissionGuard)
  @HttpCode(HttpStatus.OK)
  @Put(':id')
  async updateById(
    @Param('id') id,
    @Body() dto: CreateRoleDto,
  ) {
    const result =
      await this.roleService.editById(
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
  @Delete(':id')
  async deleteById(@Param('id') id) {
    const result =
      await this.roleService.removeById(
        parseInt(id),
      );

    return this.responseService.handleResponse(
      result,
    );
  }
}
