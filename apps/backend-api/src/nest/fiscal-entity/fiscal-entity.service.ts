import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION, fiscalEntities } from '@hq/database';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  FiscalEntity,
  FiscalEntityInput,
  FiscalEntityType,
} from './models/fiscal-entity.model';

@Injectable()
export class FiscalEntityService {
  constructor(@Inject(DATABASE_CONNECTION) private db: NodePgDatabase<any>) {}

  async create(
    userId: string,
    input: FiscalEntityInput,
  ): Promise<FiscalEntity> {
    const [newEntity] = await this.db
      .insert(fiscalEntities)
      .values({
        userId,
        name: input.name,
        province: 'Ontario', // Default for Phase 1
        country: 'Canada', // Default for Phase 1
        type: FiscalEntityType.individual, // Default for Phase 1
      })
      .returning();

    return {
      id: newEntity.id,
      name: newEntity.name,
      type: newEntity.type as FiscalEntityType,
      country: newEntity.country,
      province: newEntity.province,
      userId: newEntity.userId,
      createdAt: newEntity.createdAt,
      updatedAt: newEntity.updatedAt,
    };
  }

  async findAllForUser(userId: string): Promise<FiscalEntity[]> {
    const entities = await this.db
      .select()
      .from(fiscalEntities)
      .where(eq(fiscalEntities.userId, userId));

    return entities.map((entity) => ({
      id: entity.id,
      name: entity.name,
      type: entity.type as FiscalEntity['type'],
      country: entity.country,
      province: entity.province,
      userId: entity.userId,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    }));
  }
}
