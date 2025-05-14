import { Request, Response } from 'express';

import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException,
	Inject,
	Optional
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { LoggerService } from '@/core/logger/logger.service';

@Catch(HttpException)
export class AppExceptionsFilter implements ExceptionFilter {
	constructor(
		@Optional()
		@Inject(HttpAdapterHost)
		private readonly httpAdapterHost?: HttpAdapterHost,
		private readonly logger?: LoggerService
	) {}

	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();
		const request = ctx.getRequest<Request>();

		const status = exception.getStatus();
		const message = exception.message;

		const path = this.getRequestUrlSafe(request);

		if (status === 400 && exception.getResponse()['message']) {
			const validationErrors = exception.getResponse()['message'];
			return response.status(status).json({
				statusCode: status,
				message: 'Validation failed',
				errors: Array.isArray(validationErrors) ? validationErrors : [validationErrors],
				timestamp: new Date().toISOString()
			});
		}

		const errorResponse = {
			statusCode: status,
			message,
			path,
			error: exception.name,
			timestamp: new Date().toISOString()
		};

		this.logger?.error(`${status} ${message}`, exception.stack, 'HTTP');

		response.status(status).json(errorResponse);
	}

	private getRequestUrlSafe(request: Request): string {
		try {
			return this.httpAdapterHost?.httpAdapter?.getRequestUrl(request) ?? request.url;
		} catch {
			return request.url;
		}
	}
}
