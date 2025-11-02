import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Allowed origins - update these in production
  const allowedOrigins = [
    'http://localhost:3000',  // Local development
    'https://www.mystiquehr.com',  // Production frontend
    'https://mystiquehr.com',  // Non-www version
    'https://mystique-back-production.up.railway.app'  // Backend domain
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('No origin - allowing request');
        return callback(null, true);
      }
      
      // Normalize the origin by removing trailing slashes and converting to lowercase
      const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
      const isAllowed = allowedOrigins.some(allowed => 
        normalizedOrigin === allowed.toLowerCase()
      );

      if (!isAllowed) {
        const msg = `CORS Error: ${origin} is not allowed by CORS policy`;
        console.warn(msg);
        return callback(new Error(msg), false);
      }
      
      console.log(`Allowed CORS request from: ${origin}`);
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
    exposedHeaders: ['Set-Cookie'],
  });
  
  console.log('CORS Configuration:', {
    allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
