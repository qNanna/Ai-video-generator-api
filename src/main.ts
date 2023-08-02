import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { Swagger } from './utils/swagger';
import { LoggingInterceptor } from './enchancers/interceptors/logger.interceptor';


async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService: ConfigService = app.get(ConfigService);

  const PORT = configService.get<number>('PORT') || 3051;
  const STAGE = configService.get<string>('NODE_ENV');

  app.enableCors();
  app.setGlobalPrefix(`${STAGE}/api`);
  app.useGlobalInterceptors(new LoggingInterceptor());

  app.get(Swagger).swaggerInit(app);

  await app.listen(PORT, () => {
    console.log('\x1b[36m%s\x1b[0m', `Application started at port: ${PORT}`);
  });
}

bootstrap();
