import { DATABASE_CONNECTION } from '@hq/database';
import { Global, Module } from '@nestjs/common';
import { db } from 'src/db';

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useValue: db,
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule {}
