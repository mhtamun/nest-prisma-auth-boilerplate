import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
	private logger = new Logger('HTTP');

	use(request: Request, response: Response, next: NextFunction): void {
		const { method, path, ip, headers, body } = request;
		const userAgent = request.get('user-agent') || '';

		response.on('close', () => {
			const { statusCode, statusMessage } = response;
			const contentLength = response.get('content-length');
			const data = response.get('data');

			// this.logger.debug(
			// 	`${method} ${path} ${statusCode}: ${statusMessage} ${contentLength} - ${userAgent} ${ip}`
			// );

			this.logger.debug({
				request: {
					method,
					path,
					headers: headers,
					body: body,
					userAgent,
					ip,
				},
				response: {
					statusCode,
					statusMessage,
					contentLength,
					data,
				},
			});
		});

		if (next) {
			next();
		}
	}
}
