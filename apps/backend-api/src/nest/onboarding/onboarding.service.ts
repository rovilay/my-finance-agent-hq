import { Injectable, Inject } from '@nestjs/common';
import { DATABASE_CONNECTION, userOnboarding } from '@hq/database';
import { eq } from 'drizzle-orm';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import {
  UserOnboarding,
  SaveOnboardingInput,
} from './models/user-onboarding.model';

@Injectable()
export class OnboardingService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: NodePgDatabase<any>,
  ) {}

  async saveOnboarding(
    userId: string,
    input: SaveOnboardingInput,
  ): Promise<UserOnboarding> {
    const existing = await this.db
      .select()
      .from(userOnboarding)
      .where(eq(userOnboarding.userId, userId))
      .limit(1);

    if (existing.length > 0) {
      const [updated] = await this.db
        .update(userOnboarding)
        .set({
          filingPath: input.filingPath,
          arrivedThisYear: input.arrivedThisYear,
          incomeSources: input.incomeSources,
          updatedAt: new Date(),
        })
        .where(eq(userOnboarding.userId, userId))
        .returning();
      return this.toModel(updated);
    }

    const [created] = await this.db
      .insert(userOnboarding)
      .values({
        userId,
        filingPath: input.filingPath,
        arrivedThisYear: input.arrivedThisYear,
        incomeSources: input.incomeSources,
      })
      .returning();
    return this.toModel(created);
  }

  async findByUserId(userId: string): Promise<UserOnboarding | null> {
    const [record] = await this.db
      .select()
      .from(userOnboarding)
      .where(eq(userOnboarding.userId, userId))
      .limit(1);
    return record ? this.toModel(record) : null;
  }

  private toModel(record: typeof userOnboarding.$inferSelect): UserOnboarding {
    return {
      id: record.id,
      userId: record.userId,
      filingPath: record.filingPath,
      arrivedThisYear: record.arrivedThisYear,
      incomeSources: record.incomeSources as string[],
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }
}
