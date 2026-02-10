import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Establecer prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Activamos el Pipe de validación global
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,       // Elimina propiedades del body que no estén en el DTO
      forbidNonWhitelisted: true, // Devuelve error si envían propiedades extra
      transform: true,       // Transforma los tipos automáticamente (ej. string a number)
      transformOptions: { enableImplicitConversion: true }, // Conversión implícita de tipos
    }),
  );

  const port = process.env.APP_PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();