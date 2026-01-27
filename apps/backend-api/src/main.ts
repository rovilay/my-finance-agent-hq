import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_PORT, envConfig } from './config/env';
import { DEV_CORS_ORIGINS } from './nest/constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: envConfig().NODE_ENV === 'development' ? DEV_CORS_ORIGINS : true,
    credentials: true,
  });

  await app.listen(process.env.PORT ?? DEFAULT_PORT);
  console.log(
    `🚀 Backend API is running on http://localhost:${process.env.PORT ?? DEFAULT_PORT}`,
  );
}

bootstrap().catch((error) => {
  console.error('🚨 Bootstrap error:', error);
  process.exit(1);
});
