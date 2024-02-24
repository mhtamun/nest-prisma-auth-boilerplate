import { Inject } from '@nestjs/common';
import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { IMailerPayload, MailerService } from './mailer.service';
import * as _ from 'lodash';

@Processor('notification-queue')
export class NotificationProcessor {
	@Inject()
	private readonly mailer: MailerService;

	@Process('mail-send')
	async sendMail(job: Job<IMailerPayload>) {
		console.debug('processor: notification-queue -> process: mail-send -> starts', {
			..._.pick(job, ['opts', 'name', 'data', 'id']),
		});

		const result = await this.mailer.sendMail(job.data);

		console.debug('processor: notification-queue -> process: mail-send -> ends', { result });
	}
}
