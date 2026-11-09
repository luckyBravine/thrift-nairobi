import { createHash, randomUUID } from 'node:crypto';
import { and, eq, gt, isNull, sql } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';
import { auth } from '../auth/auth';
import { canAcceptInvite } from '../auth/policy';
import { db } from '../db/client';
import * as authSchema from '../db/auth-schema';
import { staffInvites } from '../db/schema/schema';
import { AppError } from '../errors/AppError';
import { logger } from '../lib/logger';

const staffInvitationsRouter = Router();
const inspectInviteSchema = z.object({
  token: z.string().min(32).max(128).optional(),
});
const acceptInviteSchema = z.object({
  token: z.string().min(32).max(128),
  name: z.string().trim().min(2).max(100),
  password: z.string().min(14).max(128),
});

function hashInviteToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

staffInvitationsRouter.post('/open', async (req, res) => {
  const parsed = inspectInviteSchema.safeParse(req.body);
  const token =
    typeof req.body?.token === 'string' && req.body.token.length > 0
      ? req.body.token
      : undefined;
  const now = new Date();
  let status: 'valid' | 'invalid' | 'expired' | 'used' | 'missing' = 'missing';

  if (token) {
    if (!parsed.success) {
      status = 'invalid';
    } else {
      const [candidate] = await db
        .select({
          acceptedAt: staffInvites.acceptedAt,
          expiresAt: staffInvites.expiresAt,
        })
        .from(staffInvites)
        .where(eq(staffInvites.tokenHash, hashInviteToken(token)))
        .limit(1);

      if (!candidate) {
        status = 'invalid';
      } else if (candidate.acceptedAt) {
        status = 'used';
      } else if (candidate.expiresAt <= now) {
        status = 'expired';
      } else {
        status = 'valid';
      }
    }
  }

  logger.info(
    {
      event: 'staff.invite.opened',
      requestId: req.requestId,
      tokenPresent: Boolean(token),
      status,
    },
    'Staff invitation link opened',
  );
  res.json({ status });
});

staffInvitationsRouter.post('/accept', async (req, res) => {
  const parsed = acceptInviteSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(
      400,
      'Use a valid invitation, your name, and a password of at least 14 characters',
    );
  }

  const tokenHash = hashInviteToken(parsed.data.token);
  const now = new Date();
  const [candidate] = await db
    .select({
      id: staffInvites.id,
      email: staffInvites.email,
      role: staffInvites.role,
      acceptedAt: staffInvites.acceptedAt,
      expiresAt: staffInvites.expiresAt,
    })
    .from(staffInvites)
    .where(eq(staffInvites.tokenHash, tokenHash))
    .limit(1);

  if (
    !candidate ||
    !canAcceptInvite(candidate.acceptedAt, candidate.expiresAt, now.getTime())
  ) {
    throw new AppError(
      400,
      'This invitation is invalid, expired, or already used',
    );
  }

  const [invite] = await db
    .update(staffInvites)
    .set({ acceptedAt: now })
    .where(
      and(
        eq(staffInvites.id, candidate.id),
        isNull(staffInvites.acceptedAt),
        gt(staffInvites.expiresAt, now),
      ),
    )
    .returning({
      email: staffInvites.email,
      role: staffInvites.role,
    });

  if (!invite) {
    throw new AppError(
      400,
      'This invitation is invalid, expired, or already used',
    );
  }

  let created: Awaited<ReturnType<typeof auth.api.createUser>>;
  try {
    created = await auth.api.createUser({
      body: {
        email: invite.email,
        name: parsed.data.name,
        password: parsed.data.password,
        role: invite.role,
      },
    });
  } catch (error) {
    const [existingUser] = await db
      .select({ id: authSchema.user.id })
      .from(authSchema.user)
      .where(sql`lower(${authSchema.user.email}) = ${invite.email}`)
      .limit(1);
    if (!existingUser) {
      await db
        .update(staffInvites)
        .set({ acceptedAt: null })
        .where(
          and(
            eq(staffInvites.id, candidate.id),
            eq(staffInvites.acceptedAt, now),
            gt(staffInvites.expiresAt, new Date()),
          ),
        );
    }
    throw error;
  }

  await db.transaction(async (tx) => {
    await tx
      .update(authSchema.user)
      .set({ emailVerified: true })
      .where(eq(authSchema.user.id, created.user.id));
    await tx.insert(authSchema.staffSecurityEvent).values({
      id: randomUUID(),
      actorId: null,
      subjectUserId: created.user.id,
      action: 'staff.invite.accepted',
      metadata: { role: invite.role },
      ipAddress: req.ip ?? null,
      createdAt: new Date(),
    });
  });

  res.status(201).json({ success: true });
});

export { staffInvitationsRouter };
