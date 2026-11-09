import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { randomUUID } from 'node:crypto';
import { eq, sql } from 'drizzle-orm';
import * as authSchema from '../db/auth-schema';
import { closeDatabase, db } from '../db/client';
import { isProduction } from '../config/env';

async function main() {
  if (!isProduction || !process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      'Owner MFA recovery requires an interactive production or staging terminal.',
    );
  }

  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const email = (await prompt.question('Owner email: ')).trim().toLowerCase();
    const ticket = (
      await prompt.question('Recovery ticket/reference: ')
    ).trim();
    const confirmation = await prompt.question(
      'Type RESET OWNER MFA to continue: ',
    );

    if (!email || !ticket || confirmation !== 'RESET OWNER MFA') {
      throw new Error('Owner MFA recovery was not confirmed.');
    }

    const owners = await db
      .select({
        id: authSchema.user.id,
        twoFactorEnabled: authSchema.user.twoFactorEnabled,
      })
      .from(authSchema.user)
      .where(
        sql`lower(${authSchema.user.email}) = ${email} AND ${authSchema.user.role} = 'superadmin'`,
      )
      .limit(2);

    if (owners.length !== 1 || !owners[0].twoFactorEnabled) {
      throw new Error(
        'Expected exactly one enrolled superadmin for that email.',
      );
    }

    const owner = owners[0];
    await db.transaction(async (tx) => {
      await tx
        .update(authSchema.user)
        .set({ twoFactorEnabled: false, twoFactorEnabledAt: null })
        .where(eq(authSchema.user.id, owner.id));
      await tx
        .delete(authSchema.twoFactor)
        .where(eq(authSchema.twoFactor.userId, owner.id));
      await tx
        .delete(authSchema.session)
        .where(eq(authSchema.session.userId, owner.id));
      await tx.insert(authSchema.staffSecurityEvent).values({
        id: randomUUID(),
        actorId: null,
        subjectUserId: owner.id,
        action: 'staff.owner_mfa.offline_recovery',
        metadata: { ticket },
        createdAt: new Date(),
      });
    });

    console.log(
      'Owner MFA reset completed and recorded. Sign in with the existing password, enroll a new authenticator, and save new recovery codes.',
    );
  } finally {
    prompt.close();
  }
}

async function run() {
  try {
    await main();
  } catch (error) {
    console.error(
      error instanceof Error ? error.message : 'Owner MFA recovery failed.',
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
