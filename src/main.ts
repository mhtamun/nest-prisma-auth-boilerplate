import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

const config = new ConfigService();
const host = config.get('HOST');
const port = config.get('PORT');

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(
		new ValidationPipe({
			enableDebugMessages: true,
			whitelist: true,
			forbidNonWhitelisted: true,
			forbidUnknownValues: true,
			stopAtFirstError: true,
		})
	);

	app.enableCors({
		origin: '*',
		allowedHeaders: ['Content-type', 'Authorization'],
	});

	await app.listen(port ?? 3456, host ?? '0.0.0.0');
}

bootstrap();
