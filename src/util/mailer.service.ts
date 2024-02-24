import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

export interface IMailerPayload extends nodemailer.SendMailOptions {}

export interface IMailerResponse {
	success: boolean;
	message: string;
}

@Injectable()
export class MailerService {
	private transporters: nodemailer.Transporter[];
	private currentTransporter: nodemailer.Transporter;
	private senders: string[];
	private currentSender: string;
	private currentIndex: number;

	constructor(readonly config: ConfigService) {
		this.transporters = [
			nodemailer.createTransport({
				host: config.get('EMAIL_SERVER_1'),
				port: config.get('EMAIL_PORT_1'),
				secure: true,
				auth: {
					user: config.get('EMAIL_USERNAME_1'),
					pass: config.get('EMAIL_PASSWORD_1'),
				},
			}),
			nodemailer.createTransport({
				host: config.get('EMAIL_SERVER_2'),
				port: config.get('EMAIL_PORT_2'),
				secure: true,
				auth: {
					user: config.get('EMAIL_USERNAME_2'),
					pass: config.get('EMAIL_PASSWORD_2'),
				},
			}),
			nodemailer.createTransport({
				host: config.get('EMAIL_SERVER_3'),
				port: config.get('EMAIL_PORT_3'),
				secure: true,
				auth: {
					user: config.get('EMAIL_USERNAME_3'),
					pass: config.get('EMAIL_PASSWORD_3'),
				},
			}),
		];
		this.currentTransporter = null;
		this.senders = [
			this.config.get('EMAIL_SENDER_1'),
			this.config.get('EMAIL_SENDER_2'),
			this.config.get('EMAIL_SENDER_3'),
		];
		this.currentSender = null;
		this.currentIndex = 1;
	}

	setNext() {
		try {
			this.currentTransporter = this.transporters[this.currentIndex];
			this.currentSender = this.senders[this.currentIndex];
			this.currentIndex = (this.currentIndex + 1) % this.senders.length;
		} catch (e) {
			console.error('mailer.service.ts -> setNext -> error', e);
		}
	}

	async sendMail(payload: IMailerPayload): Promise<IMailerResponse> {
		// console.debug({ payload });

		this.setNext();

		try {
			console.debug('mailer.service.ts -> sendMail -> {}', {
				transporter: this.currentTransporter,
			});

			const isConnectionOk = await this.currentTransporter.verify();
			console.debug('mailer.service.ts -> sendMail -> {}', {
				isConnectionOk,
			});

			if (!isConnectionOk) return { message: `No Connection!`, success: false };

			const info: nodemailer.SentMessageInfo = await this.currentTransporter.sendMail({
				from: !payload.from ? { name: 'Example', address: this.currentSender } : payload.from,
				to: payload.to,
				subject: payload.subject ?? '',
				text: payload.text ?? '',
				html: payload.html ?? '',
				attachments: payload.attachments,
			});

			console.info('Email sent success: ', info);

			return { message: `Message sent: ${info.messageId}`, success: true };
		} catch (e) {
			console.error('mailer.service.ts -> setNext -> error', e);

			return { message: 'Failed to send email.', success: false };
		}
	}
}
