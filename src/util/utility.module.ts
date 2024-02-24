import { Global, Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
// services
import { UtilityService } from './utility.service';
import { ResponseService } from './response.service';
import { ErrorService } from './error.service';
import { HashService } from './hash.service';
import { ConstantService } from './constant.service';
import { FileUploadService } from './file-upload.service';
import { NotificationService } from './notification.service';
import { NotificationProcessor } from './notification.processor';
import { MailerService } from './mailer.service';

const modules = [
	UtilityService,
	ResponseService,
	ErrorService,
	HashService,
	ConstantService,
	FileUploadService,
	NotificationService,
	NotificationProcessor,
	MailerService,
];

@Global()
@Module({
	imports: [
		BullModule.registerQueue({
			name: 'notification-queue',
		}),
	],
	providers: [...modules],
	exports: [...modules],
})
export class UtilityModule {}
