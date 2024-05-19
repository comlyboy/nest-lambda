import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from '@nestjs/common';

import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

	catch(exception: HttpException, host: ArgumentsHost) {
		const http = host.switchToHttp();
		const response = http.getResponse<Response>();
		const { method, url } = http.getRequest<Request>();
		let status = exception.getStatus();
		let message = exception['response']['message'] as string || exception.message;
		if (Array.isArray(message)) {
			message = JSON.stringify(message);
		}
		const errorResult: { error: any } = {
			error: {
				timestamp: new Date().toISOString(),
				method: method,
				path: url,
				message
			}
		};


		// if (EnvironmentConfig.NODE_ENV !== DefinedAppEnvironmentEnum.DEVELOPMENT) {
		// 	if (status > 499 && status < 600) {
		// 		SendErrorToSlack({ ...errorResult.error });
		// 	}
		// }
		console.log(`ERROR => ${JSON.stringify(errorResult)}`);

		response.status(status)//.json(errorResult);
	}
}