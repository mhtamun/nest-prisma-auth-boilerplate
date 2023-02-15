import {
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const GetUser = createParamDecorator(
  (
    data: string | undefined,
    ctx: ExecutionContext,
  ) => {
    const request: Express.Request = ctx
      .switchToHttp()
      .getRequest();

    // console.debug('data', data);
    // console.debug('request', request.user);

    if (data) {
      return request.user[data];
    }

    return request.user;
  },
);
