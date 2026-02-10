import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

<<<<<<< HEAD
  // Activamos el Pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Elimina propiedades del body que no estén en el DTO
      forbidNonWhitelisted: true, // Devuelve error si envían propiedades extra
      transform: true,       // Transforma los tipos automáticamente (ej. string a number)
    }),
  );

  await app.listen(3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
=======
  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  await app.listen(process.env.APP_PORT || 3000);
>>>>>>> e8128414c4a527596fb18fcf7018900856567e79
}
bootstrap();