import {
  UseGuards,
  Controller,
  Body,
  Post,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PermissionGuard } from '../auth/guard';
import { UserService } from './user.service';
import { ResponseService } from 'src/util/response.service';
import {
  CreateUserDto,
  SignInUserDto,
} from './dto';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly responseService: ResponseService,
  ) {}

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
}
