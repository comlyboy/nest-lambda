import { NestFactory } from '@nestjs/core';
import { HttpStatus, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common';

import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

// https://stackoverflow.com/questions/68932747/adding-nestjs-as-express-module-results-in-nest-being-restarted
// https://stackoverflow.com/questions/54349998/use-nestjs-package-in-nodejs-express-project/67719723#67719723
export async function bootstrapApplication() {
	const nestApplication = await NestFactory.create(AppModule);
	nestApplication.setGlobalPrefix('api');
	nestApplication.enableCors();
	nestApplication.use(helmet());
	nestApplication.useGlobalFilters(new HttpExceptionFilter());
	nestApplication.useGlobalPipes(new ValidationPipe({ whitelist: true, }));
	// nestApplication.use((req: Request, res: Response, next: NextFunction) => {
	// 	res.setHeader('Access-Control-Allow-Headers', '*');
	// 	res.setHeader('Access-Control-Allow-Methods', '*');
	// 	next();
	// });
	nestApplication.use(
		rateLimit({
			windowMs: 15 * 60 * 1000, // 15 minutes
			max: 100, // limit each IP to 100 requests per windowMs
			handler: (req: Request, res: Response) => {
				res.status(HttpStatus.TOO_MANY_REQUESTS)
					.send({ message: 'Too many network requests!' });
			}
		})
	);
	return { nestApplication };
}