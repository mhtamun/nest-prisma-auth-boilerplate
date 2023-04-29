import { Inject } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DbService } from 'src/db/db.service';

export default class BaseService {
  @Inject()
  private readonly db: DbService;

  constructor(private readonly model: string) {
    this.model = model;
  }

  async transact(callback: any, data?: any) {
    try {
      const txCallback = (
        tx: Prisma.TransactionClient, // ORM will push this tx
      ) => {
        return callback(tx, this, data ?? null);
      };

      const result = await this.db.$transaction(
        txCallback,
        {
          maxWait: 5000,
          timeout: 5000,
        },
      );
      // console.debug('result', result);

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
