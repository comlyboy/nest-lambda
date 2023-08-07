import { APIGatewayProxyCallbackV2, APIGatewayProxyEventV2, APIGatewayProxyHandlerV2, Context } from 'aws-lambda';
import serverlessExpress from '@vendia/serverless-express';

import { bootstrapApplication } from './app';

let serverInstance: APIGatewayProxyHandlerV2;
async function bootstrapLambdaApi(): Promise<APIGatewayProxyHandlerV2<never>> {
	// https://youtu.be/9a74LuU2EoU
	// https://towardsaws.com/5-ways-to-speed-up-your-lambda-function-2163f63ffc49
	// https://lumigo.io/learn/aws-lambda-timeout-best-practices/
	if (!serverInstance) {
		console.log('LOG => Initializing new Lambda API instance');
		const { nestApplication } = await bootstrapApplication();
		await nestApplication.init();
		const expressInstance = nestApplication.getHttpAdapter().getInstance();
		serverInstance = serverlessExpress({
			app: expressInstance,
			eventSourceRoutes: {
				AWS_SQS: '/sqs',
				AWS_SNS: '/sns',
				AWS_DYNAMODB: '/dynamodb',
				AWS_EVENTBRIDGE: 'event-bridge',
				AWS_KINESIS_DATA_STREAM: 'kinesis',
			}
		});
	}
	return serverInstance;
}

// https://www.serverless.com/framework/docs/providers/aws/events/http-api#lambda-request-authorizers
export async function handler(event: APIGatewayProxyEventV2, context: Context, callback: APIGatewayProxyCallbackV2) {
	const server = await bootstrapLambdaApi();
	return server(event, context, callback);
}