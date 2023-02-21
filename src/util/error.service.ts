import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface DbErrorMessage {
  unique?: string;
}

@Injectable()
export class ErrorService {
  handleDbError(
    error: any,
    dbErrorMessage: DbErrorMessage,
  ) {
    if (
      error instanceof
      Prisma.PrismaClientKnownRequestError
    ) {
      if (error.code === 'P2002') {
        return {
          name: 'badRequest',
          message: dbErrorMessage.unique,
        };
      }

      // todo: implement more type of DB error
    }

    return null;
  }
}
