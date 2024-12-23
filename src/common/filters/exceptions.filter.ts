import {
    Catch,
    ArgumentsHost,
    HttpException,
    BadRequestException,
    InternalServerErrorException,
  } from '@nestjs/common';
  import { Request, Response } from 'express';
  import { I18nService } from 'nestjs-i18n';
  import { BaseExceptionFilter } from '@nestjs/core';
  import { ValidationErrorItem } from 'joi';
  import { HttpStatus } from '../constants';
  import { randomUUID } from 'crypto';
//   import { removeSensitiveInformation } from '../utils/common';
//   import { createWinstonLogger } from '../services/winston.service';
  
  export const translateErrorValidator = (
    errors: ValidationErrorItem[],
    i18n: I18nService,
  ) => {
    const errorMessages = errors.map((error: ValidationErrorItem) => {
      const { type, context, path } = error;
      const key = ['validation', type].join('.');
      // translate label
      context.label = i18n.translate(context.label);
  
      // translate message
      let message = '';
      if (context.name) {
        message = i18n.translate(context.name, { args: context });
      } else {
        message = i18n.translate(key, { args: context });
      }
      return {
        key: path.join('.'),
        errorCode: HttpStatus.BAD_REQUEST,
        message,
      };
    });
  
    return errorMessages;
  };
  
  const handleBadRequestException = async (
    exception: BadRequestException,
    i18n: I18nService,
    id: string,
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = exception.getResponse() as any;
  
    let errors = [];
  
    if (Array.isArray(response.errors) && response?.errors.length > 0) {
      errors = await translateErrorValidator(response.errors, i18n);
    }
    return {
      code: HttpStatus.BAD_REQUEST,
      message: exception.message,
      errors,
      id,
    };
  };
  
  const handleInternalErrorException = async (
    id: string,
    request: Request,
    i18n: I18nService,
  ) => {
    // return only logId
    return {
      code: HttpStatus.INTERNAL_SERVER_ERROR,
      message: await i18n.translate('errors.500', {
        lang: request?.headers['accept-language'],
        args: { param: id },
      }),
      errors: [],
      id,
    };
  };
  
  @Catch(HttpException)
  export class HttpExceptionFilter extends BaseExceptionFilter {
    // private readonly logger = createWinstonLogger();
    constructor(private readonly i18n: I18nService) {
      super();
    }
    async catch(exception: HttpException, host: ArgumentsHost) {
      const ctx = host.switchToHttp();
      const request = ctx.getRequest<Request>();
      const response = ctx.getResponse<Response>();
  
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const apiResponse = exception.getResponse() as any;
      const status = exception.getStatus();
      let parsedResponse = {
        code: exception.getStatus(),
        message: this.i18n.t(`errors.${status}`, {
          lang: request?.headers['accept-language'],
        }),
        errors: apiResponse?.errors || [],
      };
      const id = randomUUID();
    //   const removedSensitiveInfoRequest = removeSensitiveInformation(
        // request.body,
    //   );
  
    //   this.logger.error(apiResponse.message, {
    //     id: id,
    //     requestUrl: request.url,
    //     request: removedSensitiveInfoRequest,
    //     exception,
    //   });
  
      if (exception instanceof InternalServerErrorException) {
        parsedResponse = await handleInternalErrorException(
          id,
          request,
          this.i18n,
        );
      } else if (exception instanceof BadRequestException) {
        parsedResponse = await handleBadRequestException(
          exception,
          this.i18n,
          id,
        );
      }
      return response.status(status).json(parsedResponse);
    }
  }
  