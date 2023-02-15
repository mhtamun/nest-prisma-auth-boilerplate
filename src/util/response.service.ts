import {
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import * as _ from 'lodash';

interface Result {
  success: boolean;
  message?: string;
  data?: any;
  error?: any;
}

@Injectable()
export class ResponseService {
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
      !_.isNull(error.name)
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
    }

    throw new HttpException(
      message,
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  handleResponse(result: Result) {
    if (!result.success) {
      return this.getFailureFrame(
        result.message ??
          'Something went wrong, please have patience!',
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
