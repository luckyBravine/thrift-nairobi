import { z } from "zod";
import dotenv from 'dotenv';

dotenv.config()

const envSchema = z.object({
    //CORE
    NODE_ENV: z
        .enum(['development', 'production', 'test', 'stagging'])
        .default('development'),
    PORT: z.coerce.number().int().positive().default(4000),
    LOG_LEVEL: z
        .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent'])
        .default('info'),
    
    //DATABASE
    DATABASE_URL: z.url().optional(),

    //BETTER AUTH
    BETTER_AUTH_SECRET: z.string().min(32).optional(),
    BETTER_AUTH_URL: z.url().optional(),

    //OPTIONAL/ THIRD PARTY
    JWT_SECRET: z.string().min(1).optional(),
    JWT_ACCESS_EXPIRES_IN: z.string().optional(),
    CLOUDINARY_CLOUD_NAME: z.string().optional(),
    CLOUDINARY_API_KEY: z.string().optional(),
    CLOUDINARY_API_SECRET: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if(!parsed.success){
    console.error('Invalid environment Varibles');
    console.error(parsed.error.flatten().fieldErrors)
    process.exit(1);
}

export const env = parsed.data;

// Convenience flags
export const isProduction = env.NODE_ENV === 'production';
export const isDevelopment = env.NODE_ENV === 'development'