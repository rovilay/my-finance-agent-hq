import { DATABASE_CONNECTION, MASTRA_STORE } from '@hq/database';
import { Global, Module } from '@nestjs/common';
import { db, mastraStore } from 'src/db';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useValue: db,
    },
    {
      provide: MASTRA_STORE,
      useValue: mastraStore,
    },
  ],
  exports: [DATABASE_CONNECTION, MASTRA_STORE],
})
export class DatabaseModule {}
