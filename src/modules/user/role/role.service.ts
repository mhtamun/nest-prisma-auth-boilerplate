import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import BaseService from 'src/modules/base.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RoleService extends BaseService {
	constructor() {
		super('role');
	}

	async save(dto: CreateRoleDto) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.create(tx, {
					...dto,
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
				return await super.readMany(tx, null, {
					permissions: true,
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

	async getById(id: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.readFirst(
					tx,
					{ id },
					{
						permissions: true,
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

	async editById(id: number, dto: UpdateRoleDto) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.update(
					tx,
					{ id },
					{
						...dto,
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
