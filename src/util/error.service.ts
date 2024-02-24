import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';

interface DbErrorMessage {
	unique?: string;
	foreignKeyConstraint?: string;
	recordNotFound?: string;
}

@Injectable()
export class ErrorService {
	handleDbError(error: any, dbErrorMessage: DbErrorMessage) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			if (error.code === 'P2002') {
				return {
					name: 'badRequest',
					message: dbErrorMessage.unique,
				};
			}

			if (error.code === 'P2003') {
				return {
					name: 'badRequest',
					message: dbErrorMessage.foreignKeyConstraint,
				};
			}

			if (error.code === 'P2025') {
				return {
					name: 'badRequest',
					message: dbErrorMessage.recordNotFound,
				};
			}

			// todo: implement more type of DB error
		} else if (error instanceof Prisma.PrismaClientValidationError) {
			return {
				name: 'badImplementation',
				message: 'Something went wrong!',
			};
		}

		return null;
	}
}
