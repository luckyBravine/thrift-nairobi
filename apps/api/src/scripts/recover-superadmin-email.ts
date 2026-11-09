import 'dotenv/config';
import { createInterface } from 'node:readline/promises';
import { randomUUID } from 'node:crypto';
import { z } from 'zod';
import { eq, sql } from 'drizzle-orm';
import * as authSchema from '../db/auth-schema';
import { closeDatabase, db } from '../db/client';
import { isProduction } from '../config/env';

async function main() {
  if (!isProduction || !process.stdin.isTTY || !process.stdout.isTTY) {
    throw new Error(
      'Owner email recovery requires an interactive production or staging terminal.',
    );
  }

  const prompt = createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  try {
    const currentEmail = (await prompt.question('Current owner email: '))
      .trim()
      .toLowerCase();
    const newEmail = z.email().safeParse(
      (await prompt.question('New owner email: ')).trim().toLowerCase(),
    );
    const ticket = (await prompt.question('Recovery ticket/reference: ')).trim();
    const confirmation = await prompt.question(
      'Type CHANGE OWNER EMAIL to continue: ',
    );

    if (!currentEmail || !newEmail.success || !ticket || confirmation !== 'CHANGE OWNER EMAIL') {
      throw new Error('Owner email recovery was not confirmed.');
    }

    const changed = await db.transaction(async (tx) => {
      const owners = await tx
        .select({ id: authSchema.user.id })
        .from(authSchema.user)
        .where(
          sql`lower(${authSchema.user.email}) = ${currentEmail} AND ${authSchema.user.role} = 'superadmin'`,
        )
        .limit(2);
      if (owners.length !== 1) {
        throw new Error('Expected exactly one owner for that email.');
      }

      const [existingAccount] = await tx
        .select({ id: authSchema.user.id })
        .from(authSchema.user)
        .where(sql`lower(${authSchema.user.email}) = ${newEmail.data}`)
        .limit(1);
      if (existingAccount) {
        throw new Error('The new email is already used by an account.');
      }

      const owner = owners[0];
      await tx
        .update(authSchema.user)
        .set({ email: newEmail.data, emailVerified: false })
        .where(eq(authSchema.user.id, owner.id));
      await tx
        .delete(authSchema.session)
        .where(eq(authSchema.session.userId, owner.id));
      await tx.insert(authSchema.staffSecurityEvent).values({
        id: randomUUID(),
        actorId: null,
        subjectUserId: owner.id,
        action: 'staff.owner_email.offline_recovery',
        metadata: { ticket },
        createdAt: new Date(),
      });
      return owner.id;
    });

    console.log(
      `Owner email recovery recorded for account ${changed}. The owner must verify the new address before changing it again.`,
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
      error instanceof Error ? error.message : 'Owner email recovery failed.',
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
