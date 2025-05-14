import * as winston from 'winston';

import { Injectable, LoggerService as NestLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LoggerService implements NestLogger {
	private readonly logger: winston.Logger;

	constructor(private readonly configService: ConfigService) {
		const { combine, timestamp, printf, colorize, json } = winston.format;

		const isDevelopment = this.configService.get('environment') === 'development';

		const logFormat = isDevelopment
			? combine(
					colorize(),
					timestamp(),
					printf(
						({
							level,
							message,
							timestamp,
							context,
							meta,
							trace
						}: {
							level: string;
							message: string;
							timestamp: string;
							context?: string;
							meta?: unknown;
							trace?: string;
						}) => {
							return `${timestamp} ${level}: [${context}] ${message} ${
								meta ? JSON.stringify(meta) : ''
							} ${trace ? JSON.stringify(trace) : ''}`;
						}
					)
				)
			: combine(timestamp(), json());

		this.logger = winston.createLogger({
			level: isDevelopment ? 'debug' : 'info',
			format: logFormat,
			transports: [new winston.transports.Console()]
		});
	}

	log(message: unknown, context?: string, meta?: unknown) {
		this.logger.info(String(message), {
			context,
			meta
		});
	}

	error(message: unknown, trace?: string, context?: string, meta?: unknown) {
		this.logger.error(String(message), {
			context,
			trace,
			meta
		});
	}

	warn(message: unknown, context?: string, meta?: unknown) {
		this.logger.warn(String(message), {
			context,
			meta
		});
	}

	debug(message: unknown, context?: string, meta?: unknown) {
		this.logger.debug(String(message), {
			context,
			meta
		});
	}

	verbose(message: unknown, context?: string, meta?: unknown) {
		this.logger.verbose(String(message), {
			context,
			meta
		});
	}
}
