import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import * as _ from 'lodash';
import { ErrorService } from './error.service';

interface Result {
	success: boolean;
	message?: string;
	data?: any;
	error?: any;
}

@Injectable()
export class ResponseService {
	@Inject()
	private readonly errorService: ErrorService;

	getSuccessFrame(message: string, data: any) {
		return {
			statusCode: 200,
			message,
			data,
		};
	}

	getFailureFrame(message: string, error: { name: string; message: string }) {
		// console.debug({ error });

		if (
			!_.isUndefined(error) &&
			!_.isNull(error) &&
			!_.isUndefined(error.name) &&
			!_.isNull(error.name) &&
			!_.isUndefined(error.message) &&
			!_.isNull(error.message)
		) {
			if (error.name === 'badRequest') {
				throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
			}

			if (error.name === 'unauthorized') {
				throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
			}

			if (error.name === 'forbidden') {
				throw new HttpException(error.message, HttpStatus.FORBIDDEN);
			}

			if (error.name === 'notImplemented') {
				throw new HttpException(error.message, HttpStatus.NOT_IMPLEMENTED);
			}

			throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
		}

		throw new HttpException(message, HttpStatus.INTERNAL_SERVER_ERROR);
	}

	handleResponse(result: Result) {
		if (!result.success) {
			// console.error('error', result.error);

			const { name, message } =
				this.errorService.handleDbError(result.error, {
					unique: `Oops! Unique validation error occurred!`,
					foreignKeyConstraint: `Oops! You can't delete, update or create this record because it's linked to other data.`,
					recordNotFound: `We're sorry, but the requested record could not be found.`,
				}) ?? {};

			result.error =
				!_.isUndefined(name) && !_.isNull(name) && !_.isUndefined(message) && !_.isNull(message)
					? { name, message }
					: result.error;

			return this.getFailureFrame(result.message ?? 'Something went wrong!', result.error);
		} else {
			return this.getSuccessFrame(result.message ?? 'Success', result.data);
		}
	}
}
