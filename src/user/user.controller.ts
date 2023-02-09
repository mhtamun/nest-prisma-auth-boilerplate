import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorator';
import { JwtGuard } from 'src/auth/guard';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(JwtGuard)
  @Get('getUsers')
  getUsers() {
    return this.userService.getUsers();
  }

  @Get('me')
  getMe(@GetUser() user: User) {
    console.log(user);
    return user;
  }
}
