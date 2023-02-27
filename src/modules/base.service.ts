import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';

export default class BaseService {
  @Inject()
  private readonly db: DbService;

  constructor(private readonly model: string) {
    this.model = model;
  }

  /*
  # callback function definition
  const callback = async (tx) => {
    todo: code running in a transaction appears here
  } 
  */

  async transact(callback: any) {
    try {
      const result = await this.db.$transaction(
        callback,
        {
          maxWait: 5000,
          timeout: 10000, // default: 5000
        },
      );
      console.debug('result', result);

      return result;
    } catch (error) {
      console.error('error', error);

      throw error;
    } finally {
      await this.db.$disconnect();
    }
  }

  async create(
    tx: Prisma.TransactionClient,
    data: any,
  ) {
    if (!tx) return null;

    if (!data) return null;

    return await tx[this.model].create({
      data,
    });
  }

  async readMany(
    tx: Prisma.TransactionClient,
    where?: any,
    include?: any,
  ) {
    if (!tx) return null;

    return await tx[this.model].findMany({
      where: !where ? undefined : { ...where },
      include: !include
        ? undefined
        : { ...include },
    });
  }

  async readFirst(
    tx: Prisma.TransactionClient,
    where: any,
    include?: any,
  ) {
    if (!tx) return null;

    if (!where) return null;

    return await tx[this.model].findFirst({
      where: { ...where },
      include: !include
        ? undefined
        : { ...include },
    });
  }

  async update(
    tx: Prisma.TransactionClient,
    where: any,
    data: any,
  ) {
    if (!tx) return null;

    if (!where) return null;

    if (!data) return null;

    return await tx[this.model].update({
      where,
      data,
    });
  }

  async delete(
    tx: Prisma.TransactionClient,
    where: any,
  ) {
    if (!tx) return null;

    if (!where) return null;

    return await tx[this.model].delete({
      where,
    });
  }
}
