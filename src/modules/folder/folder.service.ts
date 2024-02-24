import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import BaseService from 'src/modules/base.service';
import { CreateFolderDto, UpdateFolderDto } from './dto';
import slugify from 'slugify';

@Injectable()
export class FolderService extends BaseService {
	constructor() {
		super('folder');
	}

	async save(dto: CreateFolderDto) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.create(tx, {
					...dto,
					slug: slugify(dto.name, {
						lower: true, // convert to lower case, defaults to `false`
						strict: true, // strip special characters except replacement, defaults to `false`
					}),
					name: dto.name,
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

	async getAll() {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.readMany(tx);
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

	async getById(id: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.readFirst(tx, { id });
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

	async editById(id: number, dto: UpdateFolderDto) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.update(
					tx,
					{ id },
					{
						...dto,
						slug: slugify(dto.name, {
							lower: true, // convert to lower case, defaults to `false`
							strict: true, // strip special characters except replacement, defaults to `false`
						}),
						name: dto.name,
					}
				);
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

	async removeById(id: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.delete(tx, { id });
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
}
