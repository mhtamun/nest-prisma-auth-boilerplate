import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

const config = new ConfigService();
const port = config.get('PORT');
// console.debug({ port });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'Content-type',
      'Authorization',
    ],
  });

  await app.listen(port ?? 3456);
}

bootstrap();
