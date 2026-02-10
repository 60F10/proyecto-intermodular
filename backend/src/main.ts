import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configurar CORS
  app.enableCors({
    origin: process.env.CORS_ORIGIN || ['http://localhost:3001', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    maxAge: 3600,
  });

  // Establecer prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  // Registrar filtro de excepciones global
  app.useGlobalFilters(new AllExceptionsFilter());

  // Configurar Swagger
  const config = new DocumentBuilder()
    .setTitle('Proyecto Intermodular API')
    .setDescription('API backend para gestión de inventario y pedidos')
    .setVersion('1.0.0')
    .addTag('Auth', 'Autenticación y autorización')
    .addTag('Health', 'Estado de la aplicación')
    .addTag('Users', 'Gestión de usuarios')
    .addTag('Products', 'Gestión de productos')
    .addTag('Orders', 'Gestión de pedidos')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Token JWT para autenticación',
      },
      'jwt',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

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
  console.log(`Swagger documentation available at: ${await app.getUrl()}/docs`);
}
bootstrap();