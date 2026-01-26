import { Inject, Injectable } from '@nestjs/common';
import { DATABASE_CONNECTION, type DatabaseClient } from '@hq/database';
import { eq } from 'drizzle-orm';
import { users } from 'src/db/schema';
import { User, UserInput } from '../models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject(DATABASE_CONNECTION) private readonly db: DatabaseClient,
  ) {}

  async findOrCreateUser(user: UserInput): Promise<User> {
    // Check if user exists by email
    const [existingUser] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, user.email));

    if (existingUser)
      return {
        id: existingUser.id,
        email: existingUser.email,
        firstName: existingUser.firstName,
        lastName: existingUser.lastName,
        avatarUrl: existingUser.avatarUrl ?? undefined,
        bio: existingUser.bio ?? undefined,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      };

    // Create new user in our DB
    const [newUser] = await this.db
      .insert(users)
      .values({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        avatarUrl: user.avatarUrl,
        bio: user.bio,
      })
      .returning();

    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatarUrl: newUser.avatarUrl ?? undefined,
      bio: newUser.bio ?? undefined,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  async syncUser(data: UserInput): Promise<User> {
    // Attempt to update first
    const [updatedUser] = await this.db
      .update(users)
      .set({
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
        bio: data.bio,
        updatedAt: new Date(),
      })
      .where(eq(users.email, data.email))
      .returning();

    if (updatedUser)
      return {
        id: updatedUser.id,
        email: updatedUser.email,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        avatarUrl: updatedUser.avatarUrl ?? undefined,
        bio: updatedUser.bio ?? undefined,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      };

    // If not found, insert new
    const [newUser] = await this.db
      .insert(users)
      .values({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        avatarUrl: data.avatarUrl,
      })
      .returning();

    return {
      id: newUser.id,
      email: newUser.email,
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      avatarUrl: newUser.avatarUrl ?? undefined,
      bio: newUser.bio ?? undefined,
      createdAt: newUser.createdAt,
      updatedAt: newUser.updatedAt,
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const [userRecord] = await this.db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (!userRecord) {
      return null;
    }

    return {
      id: userRecord.id,
      email: userRecord.email,
      firstName: userRecord.firstName,
      lastName: userRecord.lastName,
      avatarUrl: userRecord.avatarUrl ?? undefined,
      bio: userRecord.bio ?? undefined,
      createdAt: userRecord.createdAt,
      updatedAt: userRecord.updatedAt,
    };
  }
}
