import {
  UseGuards,
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
  Get,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { PermissionGuard } from '../auth/guard';
import { UserService } from './user.service';
import { ResponseService } from 'src/util/response.service';
import {
  SignInUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('sign-in')
  async signIn(@Body() dto: SignInUserDto) {
    const result = await this.userService.signIn(
      dto,
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard('user', 'create'))
  @HttpCode(HttpStatus.OK)
  @Post('/')
  async create(@Body() dto: CreateUserDto) {
    const result = await this.userService.create(
      dto,
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard('user', 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('/')
  async readAll() {
    const result =
      await this.userService.getAll();

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard('user', 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('/:id')
  async readById(@Param('id') id) {
    const result = await this.userService.getById(
      parseInt(id),
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard('user', 'update'))
  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async updateById(
    @Param('id') id,
    @Body() dto: UpdateUserDto,
  ) {
    const result =
      await this.userService.editById(
        parseInt(id),
        dto,
      );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard('user', 'delete'))
  @HttpCode(HttpStatus.OK)
  @Delete('/:id')
  async deleteById(@Param('id') id) {
    const result =
      await this.userService.removeById(
        parseInt(id),
      );

    return this.responseService.handleResponse(
      result,
    );
  }
}
