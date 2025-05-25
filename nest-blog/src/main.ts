import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  // https
  const httpsOptions = {
    key: fs.readFileSync('./key.pem'),
    cert: fs.readFileSync('./cert.pem'),
  }

  const app = await NestFactory.create(AppModule, {
    httpsOptions: httpsOptions
  });

  // 입력값 검증
  app.useGlobalPipes(new ValidationPipe());
  
  app.use(cookieParser());

  app.enableCors({
    origin: "https://localhost:3000",
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 8080);
}

bootstrap();
