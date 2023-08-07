import { HttpException, Injectable } from '@nestjs/common';

interface IError {
	message: string;
	status: number;
}
@Injectable()
export class ErrorService {

	catchError(error: IError): void {
		throw new HttpException(error?.message, error?.status);
	}

	logError(error: IError): void {
		error.status = error?.status || 500;
		console.log(`ERROR => ${JSON.stringify({ message: error?.message, status: error?.status })}`);
	}

}
