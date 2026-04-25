import { DATABASE_CONNECTION, feedback } from '@hq/database';
import { Inject, Injectable } from '@nestjs/common';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from 'src/db/schema';

export interface CreateFeedbackDto {
  userId: string;
  rating: number;
  category: 'bug' | 'feature_request' | 'general';
  comment: string;
}

@Injectable()
export class FeedbackService {
  constructor(
    @Inject(DATABASE_CONNECTION)
    private readonly db: NodePgDatabase<typeof schema>,
  ) {}

  async create(dto: CreateFeedbackDto): Promise<{ id: string }> {
    const [result] = await this.db
      .insert(feedback)
      .values({
        userId: dto.userId,
        rating: String(dto.rating),
        category: dto.category,
        comment: dto.comment,
      })
      .returning({ id: feedback.id });

    return result;
  }
}
