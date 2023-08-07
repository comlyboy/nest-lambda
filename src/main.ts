import { bootstrapApplication } from './app';

async function bootstrap() {
	const { nestApplication } = await bootstrapApplication();
	await nestApplication.listen(3000);
}
bootstrap();
