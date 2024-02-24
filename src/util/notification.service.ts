import { Injectable } from '@nestjs/common';
import Bull, { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { IMailerPayload } from './mailer.service';

@Injectable()
export class NotificationService {
	constructor(@InjectQueue('notification-queue') private queue: Queue) {}

	sendEmail(payload: IMailerPayload): Promise<Bull.Job<IMailerPayload>> {
		return this.queue.add('mail-send', payload);
	}
}
