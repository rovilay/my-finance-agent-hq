import { registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
import z from 'zod';

declare const process: {
  env: {
    PORT?: string;
    DATABASE_URL: string;
    GOOGLE_GENERATIVE_AI_API_KEY: string;
    NODE_ENV?: string;
  };
  cwd: () => string;
};

// Load environment specific .env file first
const nodeEnv = process.env.NODE_ENV || 'development';
const isTestEnv = nodeEnv === 'test';
dotenv.config({
  path: process.cwd() + `.env.${nodeEnv}`,
  quiet: isTestEnv,
});
// Then load the default .env file to override
dotenv.config({
  path: process.cwd() + `.env`,
  quiet: isTestEnv,
});

export const DEFAULT_PORT = 3333;

const envSchema = z.object({
  PORT: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : DEFAULT_PORT)),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  GOOGLE_GENERATIVE_AI_API_KEY: z
    .string()
    .min(1, 'GOOGLE_GENERATIVE_AI_API_KEY is required'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
});
export type EnvSchema = z.infer<typeof envSchema>;

export const envConfig = registerAs('envConfig', () => {
  try {
    const parsedEnv = envSchema.parse(process.env);

    return {
      PORT: parsedEnv.PORT,
      DATABASE_URL: parsedEnv.DATABASE_URL,
      GOOGLE_GENERATIVE_AI_API_KEY: parsedEnv.GOOGLE_GENERATIVE_AI_API_KEY,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(
        `❌ Environment variable validation error:\n${error.issues
          .map((e) => `- ${e.message}`)
          .join('\n')}`,
        {
          cause: error,
        },
      );
    }
    throw error;
  }
});
