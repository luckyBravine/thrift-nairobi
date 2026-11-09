import 'dotenv/config';
import { eq } from 'drizzle-orm';
import { auth } from '../auth/auth';
import * as authSchema from '../db/auth-schema';
import { closeDatabase, db } from '../db/client';

async function main() {
  const email = process.env.SEED_SUPERADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SEED_SUPERADMIN_PASSWORD;
  if (!email || !password || password.length < 14 || password.length > 128) {
    throw new Error(
      'Set SEED_SUPERADMIN_EMAIL and a SEED_SUPERADMIN_PASSWORD between 14 and 128 characters',
    );
  }
  const name = 'Owner';
  const [existingOwner] = await db
    .select({ id: authSchema.user.id })
    .from(authSchema.user)
    .where(eq(authSchema.user.role, 'superadmin'))
    .limit(1);

  if (existingOwner) {
    throw new Error(
      'A superadmin already exists. Refusing to create another bootstrap owner.',
    );
  }

  await auth.api.createUser({
    body: {
      email,
      password,
      name,
      role: 'superadmin',
    },
  });

  console.log('Superadmin created. Enroll TOTP before accessing admin tools.');
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Superadmin bootstrap failed.',
    );
    process.exitCode = 1;
  } finally {
    try {
      await closeDatabase();
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : 'Failed to close the database connection.',
      );
      process.exitCode = 1;
    }
  }
}

void run();
