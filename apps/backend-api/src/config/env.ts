import { ConfigType, registerAs } from '@nestjs/config';
import dotenv from 'dotenv';
import z from 'zod';

declare const process: {
  env: {
    PORT?: string;
    DATABASE_URL: string;
    GOOGLE_GENERATIVE_AI_API_KEY: string;
    NODE_ENV?: string;
    // JWT_SECRET: string;
    FIREBASE_PROJECT_ID: string;
    JWT_ISSUER: string;
    JWT_AUDIENCE: string;
    GCS_BUCKET_NAME: string;
    GCP_KMS_KEY_ID: string;
    GCP_KMS_PROJECT_ID: string;
    GCP_KMS_LOCATION_ID: string;
    GCP_KMS_KEY_RING_ID: string;
    AI_API_KEY: string;
  };
  cwd: () => string;
};

// Load environment specific .env file first
const nodeEnv = process.env.NODE_ENV || 'development';
const isTestEnv = nodeEnv === 'test';
dotenv.config({
  path: process.cwd() + `/.env.${nodeEnv}`,
  quiet: isTestEnv,
});
// Then load the default .env file to override
dotenv.config({
  path: process.cwd() + `/.env`,
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
  // JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  FIREBASE_PROJECT_ID: z.string().min(1, 'FIREBASE_PROJECT_ID is required'),
  JWT_ISSUER: z.string().min(1, 'JWT_ISSUER is required'),
  JWT_AUDIENCE: z.string().min(1, 'JWT_AUDIENCE is required'),
  GCS_BUCKET_NAME: z.string().min(1, 'GCS_BUCKET_NAME is required'),
  GCP_KMS_KEY_ID: z.string().min(1, 'GCP_KMS_KEY_ID is required'),
  GCP_KMS_PROJECT_ID: z.string().min(1, 'GCP_KMS_PROJECT_ID is required'),
  GCP_KMS_LOCATION_ID: z.string().min(1, 'GCP_KMS_LOCATION_ID is required'),
  GCP_KMS_KEY_RING_ID: z.string().min(1, 'GCP_KMS_KEY_RING_ID is required'),
  AI_API_KEY: z.string().min(1, 'AI_API_KEY is required'),
});
export type EnvSchema = z.infer<typeof envSchema>;

export const envConfig = registerAs('envConfig', (): EnvSchema => {
  try {
    const parsedEnv = envSchema.parse(process.env);

    return {
      PORT: parsedEnv.PORT,
      DATABASE_URL: parsedEnv.DATABASE_URL,
      GOOGLE_GENERATIVE_AI_API_KEY: parsedEnv.GOOGLE_GENERATIVE_AI_API_KEY,
      NODE_ENV: parsedEnv.NODE_ENV,
      // JWT_SECRET: parsedEnv.JWT_SECRET,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      JWT_ISSUER: process.env.JWT_ISSUER,
      JWT_AUDIENCE: process.env.JWT_AUDIENCE,
      GCS_BUCKET_NAME: process.env.GCS_BUCKET_NAME,
      GCP_KMS_KEY_ID: process.env.GCP_KMS_KEY_ID,
      GCP_KMS_PROJECT_ID: process.env.GCP_KMS_PROJECT_ID,
      GCP_KMS_LOCATION_ID: process.env.GCP_KMS_LOCATION_ID,
      GCP_KMS_KEY_RING_ID: process.env.GCP_KMS_KEY_RING_ID,
      AI_API_KEY: process.env.AI_API_KEY,
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

export type EnvConfig = ConfigType<typeof envConfig>;
