import { Inject, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as _ from 'lodash';
import BaseService from 'src/modules/base.service';
import { ConstantService } from 'src/util/constant.service';
import { CreatePermissionDto, UpdatePermissionDto } from './dto';

@Injectable()
export class PermissionService extends BaseService {
	@Inject()
	private readonly constant: ConstantService;

	constructor() {
		super('permission');
	}

	async save(dto: CreatePermissionDto) {
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

	async getAllModuleNames() {
		try {
			const result = this.constant.getModuleNameList();

			return {
				success: true,
				data: result,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async getAllPermissionTypes() {
		try {
			const result = this.constant.getPermissionTypeList();

			return {
				success: true,
				data: result,
			};
		} catch (error) {
			return {
				success: false,
				error,
			};
		}
	}

	async getAll(roleId: number | null) {
		try {
			let data = null;

			if (!roleId)
				data = await super.transact(async (tx: Prisma.TransactionClient) => {
					return await super.readMany(tx, null, {
						role: true,
					});
				});
			else
				data = await super.transact(async (tx: Prisma.TransactionClient) => {
					return await super.readMany(
						tx,
						{ roleId },
						{
							role: true,
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

	async getById(id: number) {
		try {
			const data = await super.transact(async (tx: Prisma.TransactionClient) => {
				return await super.readFirst(
					tx,
					{ id },
					{
						role: true,
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

	async editById(id: number, dto: UpdatePermissionDto) {
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
