import { PrismaClient } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DbService extends PrismaClient {
	constructor(readonly config: ConfigService) {
		super({
			datasources: {
				db: {
					url: config.get('DATABASE_URL'),
				},
			},
			log: ['query', 'info', 'warn', 'error'],
			errorFormat: 'pretty',
		});
	}
}
