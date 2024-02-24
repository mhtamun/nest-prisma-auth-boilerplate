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
	Inject,
	UploadedFile,
	UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { FileService } from './file.service';
import { ResponseService } from 'src/util/response.service';
import { ModulePermission } from 'src/modules/auth/decorator';
import { PermissionGuard } from '../../auth/guard';
import { FileDto } from './dto';

export const moduleName = 'folder';

@Controller('')
export class FileController {
	@Inject()
	private readonly fileService: FileService;

	@Inject()
	private readonly responseService: ResponseService;

	@ModulePermission(moduleName, 'create')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Post('api/v1/files')
	@UseInterceptors(FileInterceptor('file'))
	async create(@Body() dto: FileDto, @UploadedFile() file: Express.Multer.File) {
		// console.debug({ file });

		const result = await this.fileService.save(dto, file);

		return this.responseService.handleResponse(result);
	}

	@HttpCode(HttpStatus.OK)
	@Get('folders/:folderName/files/:fileName')
	async getFile(@Param('folderName') folderName: string, @Param('fileName') fileName: string) {
		return this.fileService.getFile(folderName, fileName);
	}

	@ModulePermission(moduleName, 'read')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Get('api/v1/folders/:folderId/files')
	async readAll(@Param('folderId') folderId: string) {
		const result = await this.fileService.getAll(parseInt(folderId));

		return this.responseService.handleResponse(result);
	}

	// @ModulePermission(moduleName, 'read')
	// @UseGuards(PermissionGuard)
	// @HttpCode(HttpStatus.OK)
	// @Get('api/v1/files/:id')
	// async readById(@Param('id') id: string) {
	// 	const result = await this.fileService.getById(parseInt(id));

	// 	return this.responseService.handleResponse(result);
	// }

	// @ModulePermission(moduleName, 'update')
	// @UseGuards(PermissionGuard)
	// @HttpCode(HttpStatus.OK)
	// @Put('api/v1/files/:id')
	// @UseInterceptors(FileInterceptor('url'))
	// async updateById(@Param('id') id, @Body() dto: UpdateFileDto) {
	// 	const result = await this.fileService.editById(parseInt(id), dto);

	// 	return this.responseService.handleResponse(result);
	// }

	@ModulePermission(moduleName, 'delete')
	@UseGuards(PermissionGuard)
	@HttpCode(HttpStatus.OK)
	@Delete('api/v1/files/:id')
	async deleteById(@Param('id') id) {
		const result = await this.fileService.removeById(parseInt(id));

		return this.responseService.handleResponse(result);
	}
}
