import { Injectable } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class HashService {
  async generateHash(password: string) {
    return await argon.hash(password);
  }

  async matchHash(
    password: string,
    hash: string,
  ) {
    return await argon.verify(hash, password);
  }
}
