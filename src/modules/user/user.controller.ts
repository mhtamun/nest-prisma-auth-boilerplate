import {
	Body,
	Controller,
	Delete,
	Get,
	HttpCode,
	HttpStatus,
	Inject,
	Param,
	Post,
	Put,
	UseGuards,
} from '@nestjs/common';
import { ResponseService } from 'src/util/response.service';
import { GetUser, ModulePermission } from '../auth/decorator';
import { JwtGuard, PermissionGuard } from '../auth/guard';
import { SignInUserDto, UserCreateDto, UserUpdateDto } from './dto';
import { UserService } from './user.service';

const moduleName = 'user';

@Controller()
export class UserController {
	@Inject()
	private readonly userService: UserService;

	@Inject()
	private readonly responseService: ResponseService;

	@HttpCode(HttpStatus.OK)
	@Post('api/v1/auth/sign-in')
	async signIn(@Body() dto: SignInUserDto) {
		const result = await this.userService.signIn(dto);

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'create')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Post('api/v1/users')
	async create(@Body() dto: UserCreateDto) {
		const result = await this.userService.save(dto);

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'read')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Get('api/v1/users')
	async readAll() {
		const result = await this.userService.getAll();

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'read')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Get('api/v1/users/:id')
	async readById(@Param('id') id: string) {
		const result = await this.userService.getById(parseInt(id));

		return this.responseService.handleResponse(result);
	}

	@UseGuards(JwtGuard)
	@HttpCode(HttpStatus.OK)
	@Get('api/v1/user-profile')
	async readProfile(@GetUser() user: any) {
		return this.responseService.handleResponse({
			success: true,
			data: user,
		});
	}

	@ModulePermission(moduleName, 'update')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Put('api/v1/users/:id')
	async updateById(@Param('id') id: string, @Body() dto: UserUpdateDto) {
		const result = await this.userService.editById(parseInt(id), dto);

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'delete')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Delete('api/v1/users/:id')
	async deleteById(@Param('id') id: string) {
		const result = await this.userService.removeById(parseInt(id));

		return this.responseService.handleResponse(result);
	}
}
