import { Injectable } from '@nestjs/common';
import { HttpStatus } from 'src/common/constants';

export const DEFAULT_SUCCESS_MESSAGE = 'success';
@Injectable()
export class ApiResponse<T> {
  public code: number;
  public message: string;
  public data: T;
  public errors: T;
}

export class CommonListResponse<T> {
  items: T[];
  totalItems: number;
}

export interface IErrorResponse {
  key: string;
  errorCode: number;
  message: string;
  data?: any;
}

export class SuccessResponse {
  constructor(data = {}, message = DEFAULT_SUCCESS_MESSAGE) {
    return {
      code: HttpStatus.OK,
      message,
      data,
    };
  }
}

export class SuccessListResponse {
  constructor(
    data = {},
    total = 0,
    additionalInfo: Record<string, any> = {},
    message = DEFAULT_SUCCESS_MESSAGE,
  ) {
    return {
      code: HttpStatus.OK,
      message,
      data: {
        items: data,
        totalItems: total,
        ...additionalInfo,
      },
    };
  }
}

export class ErrorResponse {
  constructor(
    code = HttpStatus.INTERNAL_SERVER_ERROR,
    message = '',
    errors: IErrorResponse[] = [],
  ) {
    return {
      code,
      message,
      errors,
    };
  }
}
