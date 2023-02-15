import { Global, Module } from '@nestjs/common';
import { ErrorService } from './error.service';
import { ResponseService } from './response.service';
import { HashService } from './hash.service';

@Global()
@Module({
  providers: [
    ResponseService,
    ErrorService,
    HashService,
  ],
  exports: [
    ResponseService,
    ErrorService,
    HashService,
  ],
})
export class UtilityModule {}
