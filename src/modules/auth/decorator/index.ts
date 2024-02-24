import { createParamDecorator, ExecutionContext, SetMetadata } from '@nestjs/common';

export const GetUser = createParamDecorator((data: string | null, ctx: ExecutionContext) => {
	const request: Express.Request = ctx.switchToHttp().getRequest();

	if (data) {
		return request.user[data];
	}

	return request.user;
});

export const ModulePermission = (...args: string[]) => SetMetadata('ModulePermission', args);
