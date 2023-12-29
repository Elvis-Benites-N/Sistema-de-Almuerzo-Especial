import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ErrorInterceptor } from './common/interceptors';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    credentials: true,
    origin: process.env.FRONTEND_URL,
  });

  app.disable('x-powered-by');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  app.useGlobalInterceptors(new ErrorInterceptor());
  app.setGlobalPrefix(process.env.CONTEXT || '');

  const port = process.env.PORT || 2579;

  await app.listen(port);
  const logger = new Logger('BACKEND');
  logger.log(`==== BACKEND ALMUERZO CORRIENDO =====`);
}
bootstrap();
