import {
	UseGuards,
	Controller,
	Body,
	Post,
	HttpCode,
	HttpStatus,
	Get,
	Param,
	Delete,
	Put,
	Inject,
} from '@nestjs/common';
import { FolderService } from './folder.service';
import { ResponseService } from 'src/util/response.service';
import { ModulePermission } from 'src/modules/auth/decorator';
import { PermissionGuard } from '../auth/guard';
import { CreateFolderDto, UpdateFolderDto } from './dto';

export const moduleName = 'folder';

@Controller('')
export class FolderController {
	@Inject()
	private readonly folderService: FolderService;

	@Inject()
	private readonly responseService: ResponseService;

	@ModulePermission(moduleName, 'create')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Post('api/v1/folders')
	async create(@Body() dto: CreateFolderDto) {
		const result = await this.folderService.save(dto);

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'read')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Get('api/v1/folders')
	async readAll() {
		const result = await this.folderService.getAll();

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'read')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Get('api/v1/folders/:id')
	async readById(@Param('id') id: string) {
		const result = await this.folderService.getById(parseInt(id));

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'update')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Put('api/v1/folders/:id')
	async updateById(@Param('id') id, @Body() dto: UpdateFolderDto) {
		const result = await this.folderService.editById(parseInt(id), dto);

		return this.responseService.handleResponse(result);
	}

	@ModulePermission(moduleName, 'delete')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Delete('api/v1/folders/:id')
	async deleteById(@Param('id') id) {
		const result = await this.folderService.removeById(parseInt(id));

		return this.responseService.handleResponse(result);
	}
}
