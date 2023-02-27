import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ResponseService } from 'src/util/response.service';
import { GetUser } from '../auth/decorator';
import { PermissionGuard } from '../auth/guard';
import {
  SignInUserDto,
  CreateUserDto,
  UpdateUserDto,
} from './dto';
import { UserService } from './user.service';

const moduleName = 'user';

@Controller('users')
export class UserController {
  @Inject()
  private readonly userService: UserService;

  @Inject()
  private readonly responseService: ResponseService;

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

  @UseGuards(
    PermissionGuard(moduleName, 'create'),
  )
  @HttpCode(HttpStatus.OK)
  @Post('')
  async create(@Body() dto: CreateUserDto) {
    const result = await this.userService.save(
      dto,
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('')
  async readAll() {
    const result =
      await this.userService.getAll();

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async readById(@Param('id') id) {
    const result = await this.userService.getById(
      parseInt(id),
    );

    return this.responseService.handleResponse(
      result,
    );
  }

  @UseGuards(PermissionGuard(moduleName, 'read'))
  @HttpCode(HttpStatus.OK)
  @Get('profile/get')
  async readProfile(@GetUser() user: any) {
    return this.responseService.handleResponse({
      success: true,
      data: user,
    });
  }

  @UseGuards(
    PermissionGuard(moduleName, 'update'),
  )
  @HttpCode(HttpStatus.OK)
  @Put(':id')
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

  @UseGuards(
    PermissionGuard(moduleName, 'delete'),
  )
  @HttpCode(HttpStatus.OK)
  @Delete(':id')
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
