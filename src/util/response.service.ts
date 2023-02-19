import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
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
  constructor(
    private readonly errorService: ErrorService,
  ) {}

  getSuccessFrame(message: string, data: any) {
    return {
      statusCode: 200,
      message,
      data,
    };
  }

  getFailureFrame(message: string, error: any) {
    if (
      !_.isUndefined(error) &&
      !_.isNull(error) &&
      !_.isUndefined(error.name) &&
      !_.isNull(error.name) &&
      !_.isUndefined(error.message) &&
      !_.isNull(error.message)
    ) {
      if (error.name === 'badRequest') {
        throw new HttpException(
          error.message,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (error.name === 'unauthorized') {
        throw new HttpException(
          error.message,
          HttpStatus.UNAUTHORIZED,
        );
      }

      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    throw new HttpException(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  handleResponse(result: Result) {
    if (!result.success) {
      console.error('error', result.error);

      const { name, message } =
        this.errorService.handleDbError(
          result.error,
          {
            unique:
              'Unique validation error occurred!',
          },
        ) ?? {};

      result.error =
        !_.isUndefined(name) &&
        !_.isNull(name) &&
        !_.isUndefined(message) &&
        !_.isNull(message)
          ? { name, message }
          : result.error;

      return this.getFailureFrame(
        result.message ?? 'Something went wrong!',
        result.error,
      );
    } else {
      return this.getSuccessFrame(
        result.message ?? 'Success',
        result.data,
      );
    }
  }
}
