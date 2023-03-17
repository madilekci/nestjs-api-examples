import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // this adds a validation pipeline globally,
  // so that every request will be run through the validation
  // whitelist: true is specifying that pipeline should strip any other unexpected data fields
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }))
  await app.listen(3001);
}
bootstrap();
