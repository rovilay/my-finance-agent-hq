import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { DEFAULT_PORT, envConfig } from './config/env';
import { DEV_CORS_ORIGINS, PROD_CORS_ORIGINS } from './nest/constants';
// import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // // Increase body size limit to 50MB for document uploads
  // app.use(bodyParser.json({ limit: '50mb' }));
  // app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  // Enable CORS
  app.enableCors({
    origin:
      envConfig().NODE_ENV === 'development'
        ? DEV_CORS_ORIGINS
        : PROD_CORS_ORIGINS,
    credentials: true,
  });

  const port = process.env.PORT ?? DEFAULT_PORT;
  await app.listen(port, '0.0.0.0');
  console.log(`🚀 Backend API is running on http://0.0.0.0:${port}`);
}

bootstrap().catch((error) => {
  console.error('🚨 Bootstrap error:', error);
  process.exit(1);
});
