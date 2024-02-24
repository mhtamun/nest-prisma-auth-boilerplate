import { Inject, Injectable, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import BaseService from 'src/modules/base.service';
import { FileDto } from './dto';
import { createReadStream, unlink } from 'fs';
import { join } from 'path';

@Injectable()
export class FileService extends BaseService {
	@Inject()
	private readonly config: ConfigService;

	constructor() {
		super('file');
	}

	async save(dto: FileDto, file: Express.Multer.File) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				const folder = await tx.folder.findUnique({ where: { id: parseInt(dto.folderId) } });

				return await super.create(tx, {
					...dto,
					folderId: parseInt(dto.folderId),
					name: file.filename,
					url: `${this.config.get('ATTACHMENT_PUBLIC_URL')}/folders/${folder.slug}/files/${file.filename}`,
				});
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	getFile(folderName: string, fileName: string) {
		const file = createReadStream(join(this.config.get('ATTACHMENT_DIRECTORY'), folderName, fileName));

		return new StreamableFile(file);
	}

	async getAll(folderId: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.readMany(tx, { folderId }, { folder: true });
			});

			return {
				success: true,
				data,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	// async getById(id: number) {
	// 	try {
	// 		const data = await super.transact(async (tx: Prisma.TransactionClient) => {
	// 			return await super.readFirst(tx, { id });
	// 		});

	// 		return {
	// 			success: true,
	// 			data,
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			success: false,
	// 			error,
	// 		};
	// 	}
	// }

	// async editById(id: number, dto: UpdateFileDto) {
	// 	try {
	// 		const data = await super.transact(async (tx: Prisma.TransactionClient) => {
	// 			return await super.update(
	// 				tx,
	// 				{ id },
	// 				{
	// 					...dto,
	// 				}
	// 			);
	// 		});

	// 		return {
	// 			success: true,
	// 			data,
	// 		};
	// 	} catch (error) {
	// 		return {
	// 			success: false,
	// 			error,
	// 		};
	// 	}
	// }

	async removeById(id: number) {
		try {
			const dao = super.getDao();

			const file = await dao.file.findFirst({ where: { id } });
			const folder = await dao.folder.findFirst({ where: { id: file.folderId } });
			const path = join(this.config.get('ATTACHMENT_DIRECTORY'), folder.slug, file.name);

			// console.debug({ path });

			const success: boolean = await new Promise((resolve, reject) => {
				unlink(path, (error: NodeJS.ErrnoException | null) => {
					if (!error) {
						console.error(error);

						resolve(true);
					}

					reject(error);
				});
			});
			// console.debug({ success });

			if (!success)
				throw {
					name: 'badImplementation',
					message: 'Could not delete the attachment!',
				};

			await dao.file.delete({ where: { id } });

			return {
				success: true,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}
}
