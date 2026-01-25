import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DEFAULT_PORT } from './config/env';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? DEFAULT_PORT);
  console.log(`🚀 Backend API is running!`);
}

bootstrap().catch((error) => {
  console.error('🚨 Bootstrap error:', error);
  process.exit(1);
});
