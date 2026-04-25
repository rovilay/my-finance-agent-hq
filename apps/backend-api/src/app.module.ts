import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { TaxModule } from './nest/tax/tax.module';
import { AuthModule } from './nest/auth/auth.module';
import './types/express';
import { DatabaseModule } from './nest/database/database.module';
import { envConfig } from './config/env';
import { FiscalEntityModule } from './nest/fiscal-entity/fiscal-entity.module';
import { DocumentModule } from './nest/document/document.module';
import { AiModule } from './nest/ai/ai.module';
import { OnboardingModule } from './nest/onboarding/onboarding.module';
import { FeedbackModule } from './nest/feedback/feedback.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/gql/schema.gql'),
      sortSchema: true,
    }),
    DatabaseModule,
    AuthModule,
    FiscalEntityModule,
    AiModule,
    DocumentModule,
    TaxModule,
    OnboardingModule,
    FeedbackModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
