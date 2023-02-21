import { Global, Module } from '@nestjs/common';
import { ResponseService } from './response.service';
import { ErrorService } from './error.service';
import { HashService } from './hash.service';
import { ConstantService } from './constant.service';

@Global()
@Module({
  providers: [
    ResponseService,
    ErrorService,
    HashService,
    ConstantService,
  ],
  exports: [
    ResponseService,
    ErrorService,
    HashService,
    ConstantService,
  ],
})
export class UtilityModule {}
