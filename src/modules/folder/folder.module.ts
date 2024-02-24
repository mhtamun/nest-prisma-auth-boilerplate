import { FolderController } from './folder.controller';
import { FolderService } from './folder.service';
import { FileController } from './file/file.controller';
import { FileService } from './file/file.service';
import { DbModule } from 'src/db/db.module';
import { DbService } from 'src/db/db.service';

// System imports
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express/multer';
import { diskStorage } from 'multer';
import { join, extname } from 'path';
import * as fs from 'fs';
import slugify from 'slugify';
import * as _ from 'lodash';

@Module({
	imports: [
		MulterModule.registerAsync({
			imports: [ConfigModule, DbModule],
			useFactory: (configService: ConfigService, dbService: DbService) => ({
				storage: diskStorage({
					destination: async (req, file, callback) => {
						try {
							// console.debug({ file });

							// console.debug({ body: req.body });
							// console.debug({ folderId: req.body.folderId });
							// console.debug({ folderId: parseInt(req.body.folderId) });

							const folder = await dbService.folder.findFirst({
								where: { id: parseInt(req.body.folderId) },
							});
							// console.debug({ folder });

							const dirPath = join(configService.get('ATTACHMENT_DIRECTORY'), folder.slug);
							// console.debug({ dirPath });

							fs.mkdirSync(dirPath, {
								recursive: true,
							});

							return callback(null, dirPath);
						} catch (error) {
							return callback(error, null);
						}
					},
					filename: (req, file, callback) => {
						// console.debug({ req, file });

						// console.debug({ fileName: req.body });

						const extension = extname(file.originalname);
						// console.debug({ extension });

						const originalFileNameWithoutExtension = _.replace(file.originalname, extension, '');

						const newFileNameWithoutExtension =
							slugify(!req.body.name ? originalFileNameWithoutExtension : req.body.name, {}) +
							'_' +
							new Date().getTime();

						return callback(null, `${newFileNameWithoutExtension}${extension}`);
					},
				}),
			}),
			inject: [ConfigService, DbService],
		}),
	],
	controllers: [FolderController, FileController],
	providers: [FolderService, FileService, ConfigService],
})
export class FolderModule {}
