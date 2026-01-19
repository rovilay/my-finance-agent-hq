import { createEnv } from '@t3-oss/env-core';
import z from 'zod';
import process from 'node:process';

export const nodeEnv = createEnv({
  server: {
    NODE_ENV: z.enum(['test', 'dev', 'prod']).default('dev'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});

export const aiEnv = createEnv({
  server: {
    GOOGLE_GENERATIVE_AI_API_KEY: z
      .string()
      .min(1)
      .describe('API Key for Google Generative AI services'),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
