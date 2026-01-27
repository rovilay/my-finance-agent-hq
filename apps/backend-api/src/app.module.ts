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

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envConfig],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
    }),
    DatabaseModule,
    AuthModule,
    FiscalEntityModule,
    TaxModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
