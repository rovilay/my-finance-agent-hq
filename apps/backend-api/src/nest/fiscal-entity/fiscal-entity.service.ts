import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { DATABASE_CONNECTION, fiscalEntities } from '@hq/database';
import { and, eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  FiscalEntity,
  FiscalEntityInput,
  FiscalEntityType,
  PaginatedFiscalEntity,
  UpdateFiscalEntityInput,
} from './models/fiscal-entity.model';
import { PaginationInput } from '../common/models';

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
        type: input.type, // Default for Phase 1
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

  async findAllForUser(
    userId: string,
    type?: FiscalEntityType,
    { skip = 0, take = 10 }: PaginationInput = {},
  ): Promise<PaginatedFiscalEntity> {
    console.log(
      `[FiscalEntityService] Fetching paginated entities for user: ${userId}, Skip: ${skip}, Take: ${take}`,
    );

    try {
      // Fetch one extra to check if there are more pages
      const entities = await this.db
        .select()
        .from(fiscalEntities)
        .where(
          and(
            eq(fiscalEntities.userId, userId),
            type ? eq(fiscalEntities.type, type) : undefined,
          ),
        )
        .limit(take + 1)
        .offset(skip);

      const hasMore = entities.length > take;
      const items = hasMore ? entities.slice(0, take) : entities;
      const total = skip === 0 && !hasMore ? items.length : null;

      console.log(
        `[FiscalEntityService] Retrieved ${items.length} entities (hasMore: ${hasMore})`,
      );

      return {
        items: items.map((entity) => ({
          id: entity.id,
          name: entity.name,
          type: entity.type as FiscalEntity['type'],
          country: entity.country,
          province: entity.province,
          userId: entity.userId,
          createdAt: entity.createdAt,
          updatedAt: entity.updatedAt,
        })),
        total: total ?? skip + items.length + (hasMore ? 1 : 0),
        skip,
        take,
        hasMore,
      };
    } catch (error) {
      console.error(
        `[FiscalEntityService] Error fetching paginated entities for user: ${userId}`,
        error,
      );
      throw error;
    }
  }

  async findById(entityId: string, userId: string): Promise<FiscalEntity> {
    console.log(
      `[FiscalEntityService] Fetching entity by ID: ${entityId} for user: ${userId}`,
    );

    try {
      const [entity] = await this.db
        .select()
        .from(fiscalEntities)
        .where(
          and(
            eq(fiscalEntities.id, entityId),
            eq(fiscalEntities.userId, userId),
          ),
        )
        .limit(1);

      if (!entity) {
        console.log(
          `[FiscalEntityService] Entity not found with ID: ${entityId} for user: ${userId}`,
        );
        throw new NotFoundException(
          `Fiscal entity with ID ${entityId} not found for user ${userId}`,
        );
      }

      console.log(
        `[FiscalEntityService] Successfully retrieved entity ID: ${entityId} for user: ${userId}`,
      );

      return {
        id: entity.id,
        name: entity.name,
        type: entity.type as FiscalEntity['type'],
        country: entity.country,
        province: entity.province,
        userId: entity.userId,
        createdAt: entity.createdAt,
        updatedAt: entity.updatedAt,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error(
        `[FiscalEntityService] Error fetching entity by ID: ${entityId} for user: ${userId}`,
        error,
      );
      throw error;
    }
  }

  /** Internal service-to-service lookup — returns the stored province for an entity without a user auth check. */
  async findProvinceByEntityId(entityId: string): Promise<string> {
    const [entity] = await this.db
      .select({ province: fiscalEntities.province })
      .from(fiscalEntities)
      .where(eq(fiscalEntities.id, entityId))
      .limit(1);

    return entity?.province ?? 'Ontario';
  }

  async update(
    entityId: string,
    userId: string,
    input: UpdateFiscalEntityInput,
  ): Promise<FiscalEntity> {
    console.log(
      `[FiscalEntityService] Updating entity ID: ${entityId} for user: ${userId}`,
    );

    try {
      // Build update object with only provided fields
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (input.name !== undefined) updateData.name = input.name;
      if (input.type !== undefined) updateData.type = input.type;

      const [updated] = await this.db
        .update(fiscalEntities)
        .set(updateData)
        .where(
          and(
            eq(fiscalEntities.id, entityId),
            eq(fiscalEntities.userId, userId),
          ),
        )
        .returning();

      console.log(
        `[FiscalEntityService] Successfully updated entity ID: ${entityId}`,
      );

      return {
        id: updated.id,
        name: updated.name,
        type: updated.type as FiscalEntity['type'],
        country: updated.country,
        province: updated.province,
        userId: updated.userId,
        createdAt: updated.createdAt,
        updatedAt: updated.updatedAt,
      };
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error(
        `[FiscalEntityService] Error updating entity ID: ${entityId}`,
        error,
      );
      throw error;
    }
  }

  async delete(entityId: string, userId: string): Promise<boolean> {
    console.log(
      `[FiscalEntityService] Soft deleting entity ID: ${entityId} for user: ${userId}`,
    );

    try {
      // For now, we'll do a hard delete since we don't have deletedAt in schema
      // TODO: Add deletedAt column to schema for proper soft delete
      // Soft delete would be: UPDATE fiscal_entities SET deleted_at = NOW() WHERE id = entityId

      const result = await this.db
        .delete(fiscalEntities)
        .where(
          and(
            eq(fiscalEntities.id, entityId),
            eq(fiscalEntities.userId, userId),
          ),
        )
        .returning();

      if (result.length === 0) {
        throw new NotFoundException(
          `Fiscal entity with ID ${entityId} not found`,
        );
      }

      console.log(
        `[FiscalEntityService] Successfully deleted entity ID: ${entityId}`,
      );

      return true;
    } catch (error) {
      if (
        error instanceof NotFoundException ||
        error instanceof ForbiddenException
      ) {
        throw error;
      }
      console.error(
        `[FiscalEntityService] Error deleting entity ID: ${entityId}`,
        error,
      );
      throw error;
    }
  }
}
