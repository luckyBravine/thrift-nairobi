import { existsSync } from 'node:fs';
import path from 'node:path';
import { z } from 'zod';
import dotenv from 'dotenv';

if (
  !['production', 'staging', 'stagging'].includes(process.env.NODE_ENV ?? '')
) {
  const envPaths = [
    path.resolve(process.cwd(), 'apps/api/.env'),
    path.resolve(process.cwd(), '.env'),
  ];
  const envPath = envPaths.find(existsSync);

  if (envPath) {
    dotenv.config({ path: envPath, quiet: true });
  }
}

const envSchema = z
  .object({
    NODE_ENV: z
      .enum(['development', 'production', 'test', 'staging', 'stagging'])
      .default('development'),
    PORT: z.coerce.number().int().positive().default(3333),
    LOG_LEVEL: z
      .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
      .default('info'),

    DATABASE_URL: z.url(),

    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.preprocess(
      (value) => (value === '' ? undefined : value),
      z.url().default('http://localhost:3333'),
    ),
    BETTER_AUTH_API_KEY: z.string().min(1).optional(),
    AUTH_TRUSTED_ORIGINS: z.string().optional(),

    JWT_SECRET: z.string().min(1).optional(),
    JWT_ACCESS_EXPIRES_IN: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),

    WEB_ORIGIN: z.url().default('http://localhost:8080'),
    RESEND_API_KEY: z.string().optional(),
    EMAIL_FROM: z.string().default('THRIFT NAIROBI <onboarding@resend.dev>'),
  })
  .superRefine((data, context) => {
    const origins = [
      ['WEB_ORIGIN', data.WEB_ORIGIN],
      ...(data.AUTH_TRUSTED_ORIGINS ?? '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean)
        .map((origin) => ['AUTH_TRUSTED_ORIGINS', origin] as const),
    ];

    for (const [key, origin] of origins) {
      try {
        const parsedOrigin = new URL(origin);
        if (
          parsedOrigin.origin !== origin ||
          (['production', 'staging', 'stagging'].includes(
            data.NODE_ENV ?? '',
          ) &&
            parsedOrigin.protocol !== 'https:')
        ) {
          context.addIssue({
            code: 'custom',
            path: [key],
            message:
              'Must be an exact HTTPS origin outside development and test',
          });
        }
      } catch {
        context.addIssue({
          code: 'custom',
          path: [key],
          message: 'Must be a valid browser origin',
        });
      }
    }

    if (
      data.NODE_ENV !== 'production' &&
      data.NODE_ENV !== 'staging' &&
      data.NODE_ENV !== 'stagging'
    ) {
      return;
    }

    for (const [key, value] of [
      ['BETTER_AUTH_URL', data.BETTER_AUTH_URL],
      ['WEB_ORIGIN', data.WEB_ORIGIN],
    ]) {
      if (new URL(value).protocol !== 'https:') {
        context.addIssue({
          code: 'custom',
          path: [key],
          message: 'Must use HTTPS outside development and test',
        });
      }
    }
  })
  .transform((data) => {
    const extra = (data.AUTH_TRUSTED_ORIGINS ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean);
    const trustedOrigins = [...new Set([data.WEB_ORIGIN, ...extra])];
    return { ...data, trustedOrigins };
  });

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;

export const isDevelopment = env.NODE_ENV === 'development';
export const isProduction =
  env.NODE_ENV === 'production' ||
  env.NODE_ENV === 'staging' ||
  env.NODE_ENV === 'stagging';
