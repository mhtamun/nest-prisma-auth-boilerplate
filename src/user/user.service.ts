import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      const getUsers = await this.prisma.user.findMany({
        select: { email: true, name: true, createdAt: true },
      });

      return getUsers;
    } catch (error) {
      return error;
    }
  }

  updateUser() {}

  deleteUser() {}
}
