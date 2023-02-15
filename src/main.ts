import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

const config = new ConfigService();
const port = config.get('PORT');

console.debug({ port });

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true }),
  );

  await app.listen(
    !port
      ? 3456
      : parseInt(config.get('PORT'), 10),
  );
}

bootstrap();
