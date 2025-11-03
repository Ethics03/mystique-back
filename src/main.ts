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
    'https://mystique-back-production-85c0.up.railway.app',  // Backend domain
    'https://mystique-back-production.up.railway.app',  // Fallback backend domain
    'https://mystique-fest.vercel.app'  // Vercel deployment
  ];

  // Enable CORS with configuration
  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) {
        console.log('No origin - allowing request');
        return callback(null, true);
      }
      
      // Allow all origins in development
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      
      // Normalize the origin by removing trailing slashes and converting to lowercase
      const normalizedOrigin = origin.replace(/\/$/, '').toLowerCase();
      const isAllowed = allowedOrigins.some(allowed => 
        normalizedOrigin === allowed.toLowerCase() || 
        normalizedOrigin.endsWith('.vercel.app') // Allow all Vercel preview deployments
      );

      if (isAllowed) {
        console.log(`[CORS] Allowed request from: ${origin}`);
        return callback(null, true);
      }
      
      // For debugging
      console.warn(`[CORS] Blocked request from: ${origin}`);
      return callback(new Error(`Not allowed by CORS: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'Cookie',
      'X-Requested-With',
      'Accept',
      'Origin',
      'Access-Control-Allow-Origin'
    ],
    exposedHeaders: [
      'Set-Cookie', 
      'Content-Range', 
      'X-Content-Range',
      'Authorization'
    ],
    maxAge: 600, // 10 minutes
    preflightContinue: false,
    optionsSuccessStatus: 204
  });
  
  // Enable CORS pre-flight for all routes
  app.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
      res.header('Access-Control-Allow-Credentials', 'true');
      return res.status(204).send();
    }
    next();
  });
  
  console.log('CORS Configuration:', {
    allowedOrigins,
    environment: process.env.NODE_ENV || 'development'
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();