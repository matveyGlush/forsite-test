import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.enableCors({
    origin: 'https://forsite-test.vercel.app/',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: '*',
    exposedHeaders: '*',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  await app.listen(3000);
}

bootstrap();
