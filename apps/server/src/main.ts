import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { AppModule } from './app.module';
import helmet from '@fastify/helmet';
import { RedisIoAdapter } from './common/adapters/redis-io.adapter';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  // Security: Enable CORS
  app.enableCors({
    origin: true, // In production, replace with specific origins
    credentials: true,
  });

  // Security: Fastify Helmet
  await app.register(helmet, {
    contentSecurityPolicy: false,
  });

  // WebSockets: Horizontal Scaling
  const redisIoAdapter = new RedisIoAdapter(app);
  await redisIoAdapter.connectToRedis();
  app.useWebSocketAdapter(redisIoAdapter);

  // Validation: Global Pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  const port = process.env.PORT ?? 3000;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 weRide API is running on: http://localhost:${port}`);
}

bootstrap();


