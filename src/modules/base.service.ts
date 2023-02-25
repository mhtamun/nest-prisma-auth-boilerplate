import { Inject } from '@nestjs/common';
import { DbService } from 'src/db/db.service';

export default class BaseService {
  @Inject()
  private readonly db: DbService;

  constructor(private readonly model: string) {
    this.model = model;
  }

  async findMany(where?: any) {
    return await this.db[this.model].findMany({
      where: !where ? undefined : { ...where },
    });
  }

  async findFirst(where: any) {
    return await this.db[this.model].findFirst({
      where: { ...where },
    });
  }
}
