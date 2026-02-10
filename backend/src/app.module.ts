import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthModule } from './features/health/health.module';
import { AuthModule } from './features/auth/auth.module';
import { HttpLoggingMiddleware } from './common/logger/http-logging.middleware';
import { CustomLogger } from './common/logger/custom.logger';

@Module({
  imports: [
      ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '../.env',
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: Number(config.get<string>('DB_PORT')),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false, // NO tocar schema
        logging: false,
      }),
    }),
    HealthModule,
    AuthModule,
  ],
  providers: [CustomLogger],
  exports: [CustomLogger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(HttpLoggingMiddleware).forRoutes('*');
  }
}
