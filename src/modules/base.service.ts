import { Inject } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

export default class BaseService {
  @Inject()
  private readonly db: DbService;

  constructor(private readonly model: string) {
    this.model = model;
  }

  async create(data: any) {
    if (!data) return null;

    return await this.db[this.model].create({
      data,
    });
  }

  async readMany(where?: any) {
    return await this.db[this.model].findMany({
      where: !where ? undefined : { ...where },
    });
  }

  async readFirst(where: any) {
    if (!where) return null;

    return await this.db[this.model].findFirst({
      where: { ...where },
    });
  }

  async update(where: any, data: any) {
    if (!where) return null;

    if (!data) return null;

    return await this.db[this.model].update({
      where,
      data,
    });
  }

  async delete(where: any) {
    if (!where) return null;

    return await this.db[this.model].delete({
      where,
    });
  }
}