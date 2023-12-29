import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerMiddleware } from './common/config/logger';
import { DATABASES } from './common/constants/database.constants';
import { PathUtil } from './common/utils/path.util';
import { CoreModule } from './core/core.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [PathUtil.getPathEntities()],
      synchronize: false,
    }),
    TypeOrmModule.forRootAsync({
      name: DATABASES.RRHH,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: process.env.RRHH_DATABASE_HOST,
        port: Number(process.env.RRHH_DATABASE_PORT),
        username: process.env.RRHH_DATABASE_USERNAME,
        password: process.env.RRHH_DATABASE_PASSWORD,
        database: process.env.RRHH_DATABASE_NAME,
        synchronize: false,
      }),
    }),
    CoreModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
