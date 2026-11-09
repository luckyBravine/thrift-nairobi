import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { and, desc, eq, gt, isNull, ne, sql } from 'drizzle-orm';
import { Router } from 'express';
import { z } from 'zod';
import { fromNodeHeaders } from 'better-auth/node';
import { auth } from '../auth/auth';
import { canRecoverStaffMfa, getRoles } from '../auth/policy';
import { db } from '../db/client';
import * as authSchema from '../db/auth-schema';
import { staffInvites } from '../db/schema/schema';
import { AppError } from '../errors/AppError';
import { sendStaffInviteEmail } from '../lib/email';
import { env } from '../config/env';
import { requireAdminRole } from '../middlewares/require-role';

const staffRouter = Router();
const inviteRoleSchema = z.enum(['admin', 'support']);
const inviteBodySchema = z.object({
  email: z
    .string()
    .email()
    .transform((email) => email.trim().toLowerCase()),
  role: inviteRoleSchema,
});
function hashInviteToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

function isSuperadmin(role: string | string[] | null | undefined) {
  return getRoles(role).includes('superadmin');
}

function getUserIdParam(value: string | string[]) {
  return Array.isArray(value) ? value[0] : value;
}

staffRouter.get('/me', (req, res) => {
  res.json({ user: req.session?.user });
});

staffRouter.get('/profile', async (req, res) => {
  const userId = req.session?.user.id;
  if (!userId) throw new AppError(401, 'Unauthorized');

  const [user] = await db
    .select({
      id: authSchema.user.id,
      name: authSchema.user.name,
      email: authSchema.user.email,
      image: authSchema.user.image,
      role: authSchema.user.role,
      emailVerified: authSchema.user.emailVerified,
      createdAt: authSchema.user.createdAt,
      twoFactorEnabled: authSchema.user.twoFactorEnabled,
    })
    .from(authSchema.user)
    .where(eq(authSchema.user.id, userId))
    .limit(1);

  if (!user) throw new AppError(401, 'Unauthorized');
  res.json({ user });
});

staffRouter.patch('/profile', async (req, res) => {
  const parsed = z
    .object({ name: z.string().trim().min(2).max(100) })
    .strict()
    .safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, 'Enter a name between 2 and 100 characters');
  }

  const actor = req.session?.user;
  if (!actor) throw new AppError(401, 'Unauthorized');

  const user = await db.transaction(async (tx) => {
    const [updatedUser] = await tx
      .update(authSchema.user)
      .set({ name: parsed.data.name })
      .where(eq(authSchema.user.id, actor.id))
      .returning({
        id: authSchema.user.id,
        name: authSchema.user.name,
        email: authSchema.user.email,
        image: authSchema.user.image,
        role: authSchema.user.role,
      });
    if (!updatedUser) return undefined;
    await tx.insert(authSchema.staffSecurityEvent).values({
      id: randomUUID(),
      actorId: actor.id,
      subjectUserId: actor.id,
      action: 'staff.profile.name_changed',
      ipAddress: req.ip ?? null,
      createdAt: new Date(),
    });
    return updatedUser;
  });

  if (!user) throw new AppError(401, 'Unauthorized');
  res.json({ user });
});

staffRouter.get('/sessions', async (req, res) => {
  const currentSessionId = req.session?.session.id;
  if (!currentSessionId) throw new AppError(401, 'Unauthorized');

  const sessions = await auth.api.listSessions({
    headers: fromNodeHeaders(req.headers),
  });
  res.json({
    sessions: sessions.map((session) => ({
      id: session.id,
      isCurrent: session.id === currentSessionId,
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
      ipAddress: session.ipAddress ?? null,
      userAgent: session.userAgent ?? null,
    })),
  });
});

staffRouter.delete('/sessions/:sessionId', async (req, res) => {
  const actor = req.session?.user;
  const currentSessionId = req.session?.session.id;
  if (!actor || !currentSessionId) throw new AppError(401, 'Unauthorized');

  const sessionId = getUserIdParam(req.params.sessionId);
  if (sessionId === currentSessionId) {
    throw new AppError(400, 'Use sign out to end your current session');
  }

  const revoked = await db.transaction(async (tx) => {
    const [deleted] = await tx
      .delete(authSchema.session)
      .where(
        and(
          eq(authSchema.session.id, sessionId),
          eq(authSchema.session.userId, actor.id),
        ),
      )
      .returning({ id: authSchema.session.id });
    if (!deleted) return undefined;
    await tx.insert(authSchema.staffSecurityEvent).values({
      id: randomUUID(),
      actorId: actor.id,
      subjectUserId: actor.id,
      action: 'staff.session.revoked',
      ipAddress: req.ip ?? null,
      createdAt: new Date(),
    });
    return deleted;
  });
  if (!revoked) throw new AppError(404, 'Session not found');

  res.status(204).end();
});

staffRouter.post('/sessions/revoke-others', async (req, res) => {
  const actor = req.session?.user;
  const currentSessionId = req.session?.session.id;
  if (!actor || !currentSessionId) throw new AppError(401, 'Unauthorized');

  const revokedCount = await db.transaction(async (tx) => {
    const revoked = await tx
      .delete(authSchema.session)
      .where(
        and(
          eq(authSchema.session.userId, actor.id),
          ne(authSchema.session.id, currentSessionId),
        ),
      )
      .returning({ id: authSchema.session.id });

    if (revoked.length > 0) {
      await tx.insert(authSchema.staffSecurityEvent).values({
        id: randomUUID(),
        actorId: actor.id,
        subjectUserId: actor.id,
        action: 'staff.sessions.revoked_others',
        metadata: { count: revoked.length },
        ipAddress: req.ip ?? null,
        createdAt: new Date(),
      });
    }
    return revoked.length;
  });
  res.json({ revokedCount });
});

staffRouter.get('/staff', ...requireAdminRole, async (_req, res) => {
  const staff = await db
    .select({
      id: authSchema.user.id,
      name: authSchema.user.name,
      email: authSchema.user.email,
      role: authSchema.user.role,
      createdAt: authSchema.user.createdAt,
      banned: authSchema.user.banned,
      twoFactorEnabled: authSchema.user.twoFactorEnabled,
    })
    .from(authSchema.user)
    .where(sql`${authSchema.user.role} IN ('superadmin', 'admin', 'support')`);

  res.json({ staff });
});

staffRouter.get('/invites', ...requireAdminRole, async (_req, res) => {
  const invites = await db
    .select({
      email: staffInvites.email,
      role: staffInvites.role,
      expiresAt: staffInvites.expiresAt,
      createdAt: staffInvites.createdAt,
    })
    .from(staffInvites)
    .where(
      and(
        isNull(staffInvites.acceptedAt),
        gt(staffInvites.expiresAt, new Date()),
      ),
    );

  res.json({ invites });
});

staffRouter.post('/invites', ...requireAdminRole, async (req, res) => {
  const parsed = inviteBodySchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, 'Enter a valid staff email and role');
  }

  const actor = req.session?.user;
  if (!actor) throw new AppError(401, 'Unauthorized');
  if (parsed.data.role === 'admin' && !isSuperadmin(actor.role)) {
    throw new AppError(403, 'Only the owner can invite an admin');
  }

  const [existingUser] = await db
    .select({ id: authSchema.user.id })
    .from(authSchema.user)
    .where(sql`lower(${authSchema.user.email}) = ${parsed.data.email}`)
    .limit(1);
  if (existingUser) {
    throw new AppError(409, 'An account already exists for that email');
  }

  const token = randomBytes(32).toString('base64url');
  const tokenHash = hashInviteToken(token);
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  await db
    .insert(staffInvites)
    .values({
      id: randomUUID(),
      email: parsed.data.email,
      role: parsed.data.role,
      tokenHash,
      invitedById: actor.id,
      expiresAt,
      acceptedAt: null,
      createdAt: now,
    })
    .onConflictDoUpdate({
      target: staffInvites.email,
      set: {
        role: parsed.data.role,
        tokenHash,
        invitedById: actor.id,
        expiresAt,
        acceptedAt: null,
        createdAt: now,
      },
    });

  const inviteUrl = new URL('/admin/invite', env.WEB_ORIGIN);
  inviteUrl.hash = new URLSearchParams({ token }).toString();
  try {
    await sendStaffInviteEmail({
      email: parsed.data.email,
      inviteUrl: inviteUrl.toString(),
    });
  } catch (error) {
    await db
      .delete(staffInvites)
      .where(
        and(
          eq(staffInvites.email, parsed.data.email),
          eq(staffInvites.tokenHash, tokenHash),
        ),
      );
    throw error;
  }

  await db.insert(authSchema.staffSecurityEvent).values({
    id: randomUUID(),
    actorId: actor.id,
    subjectUserId: null,
    action: 'staff.invite.created',
    metadata: { role: parsed.data.role },
    ipAddress: req.ip ?? null,
    createdAt: new Date(),
  });
  res.status(202).json({ success: true });
});

staffRouter.delete('/invites/:email', ...requireAdminRole, async (req, res) => {
  const email = getUserIdParam(req.params.email).toLowerCase();
  const actor = req.session?.user;
  if (!actor) throw new AppError(401, 'Unauthorized');

  const [invite] = await db
    .select({ role: staffInvites.role })
    .from(staffInvites)
    .where(and(eq(staffInvites.email, email), isNull(staffInvites.acceptedAt)))
    .limit(1);
  if (!invite) throw new AppError(404, 'Pending invitation not found');
  if (invite.role === 'admin' && !isSuperadmin(actor.role)) {
    throw new AppError(403, 'Only the owner can revoke an admin invitation');
  }

  await db.transaction(async (tx) => {
    await tx
      .delete(staffInvites)
      .where(
        and(eq(staffInvites.email, email), isNull(staffInvites.acceptedAt)),
      );
    await tx.insert(authSchema.staffSecurityEvent).values({
      id: randomUUID(),
      actorId: actor.id,
      subjectUserId: null,
      action: 'staff.invite.revoked',
      metadata: { role: invite.role },
      ipAddress: req.ip ?? null,
      createdAt: new Date(),
    });
  });

  res.status(204).end();
});

staffRouter.patch(
  '/staff/:userId/role',
  ...requireAdminRole,
  async (req, res) => {
    const parsed = z.object({ role: inviteRoleSchema }).safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'Choose a valid staff role');
    }

    const actor = req.session?.user;
    if (!actor) throw new AppError(401, 'Unauthorized');
    if (!isSuperadmin(actor.role)) {
      throw new AppError(403, 'Only the owner can change staff roles');
    }
    const userId = getUserIdParam(req.params.userId);
    if (userId === actor.id) {
      throw new AppError(400, 'You cannot change your own role');
    }

    const [target] = await db
      .select({ id: authSchema.user.id, role: authSchema.user.role })
      .from(authSchema.user)
      .where(eq(authSchema.user.id, userId))
      .limit(1);
    if (
      !target ||
      !getRoles(target.role).some((role) => ['admin', 'support'].includes(role))
    ) {
      throw new AppError(404, 'Staff member not found');
    }

    await db.transaction(async (tx) => {
      await tx
        .update(authSchema.user)
        .set({ role: parsed.data.role })
        .where(eq(authSchema.user.id, target.id));
      await tx
        .delete(authSchema.session)
        .where(eq(authSchema.session.userId, target.id));
      await tx.insert(authSchema.staffSecurityEvent).values({
        id: randomUUID(),
        actorId: actor.id,
        subjectUserId: target.id,
        action: 'staff.role.changed',
        metadata: { from: String(target.role), to: parsed.data.role },
        ipAddress: req.ip ?? null,
        createdAt: new Date(),
      });
    });

    res.status(204).end();
  },
);

staffRouter.patch(
  '/staff/:userId/status',
  ...requireAdminRole,
  async (req, res) => {
    const parsed = z.object({ banned: z.boolean() }).safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'Choose a valid staff account status');
    }

    const actor = req.session?.user;
    if (!actor) throw new AppError(401, 'Unauthorized');
    const userId = getUserIdParam(req.params.userId);
    if (userId === actor.id) {
      throw new AppError(400, 'You cannot disable your own account');
    }

    const [target] = await db
      .select({ id: authSchema.user.id, role: authSchema.user.role })
      .from(authSchema.user)
      .where(eq(authSchema.user.id, userId))
      .limit(1);
    const targetRoles = getRoles(target?.role);
    if (
      !target ||
      !targetRoles.some((role) =>
        ['superadmin', 'admin', 'support'].includes(role),
      )
    ) {
      throw new AppError(404, 'Staff member not found');
    }
    if (targetRoles.includes('superadmin')) {
      throw new AppError(
        403,
        'Owner accounts cannot be disabled from staff management',
      );
    }
    if (!isSuperadmin(actor.role) && !targetRoles.includes('support')) {
      throw new AppError(403, 'You cannot change this staff account');
    }

    await db.transaction(async (tx) => {
      await tx
        .update(authSchema.user)
        .set({
          banned: parsed.data.banned,
          banReason: parsed.data.banned
            ? 'Disabled by a staff administrator'
            : null,
          banExpires: null,
        })
        .where(eq(authSchema.user.id, target.id));
      if (parsed.data.banned) {
        await tx
          .delete(authSchema.session)
          .where(eq(authSchema.session.userId, target.id));
      }
      await tx.insert(authSchema.staffSecurityEvent).values({
        id: randomUUID(),
        actorId: actor.id,
        subjectUserId: target.id,
        action: parsed.data.banned
          ? 'staff.account.disabled'
          : 'staff.account.enabled',
        ipAddress: req.ip ?? null,
        createdAt: new Date(),
      });
    });

    res.status(204).end();
  },
);

staffRouter.get('/security-events', ...requireAdminRole, async (req, res) => {
  const actor = req.session?.user;
  if (!actor || !isSuperadmin(actor.role)) {
    throw new AppError(403, 'Only the owner can view security events');
  }

  const events = await db
    .select({
      id: authSchema.staffSecurityEvent.id,
      action: authSchema.staffSecurityEvent.action,
      actorId: authSchema.staffSecurityEvent.actorId,
      subjectUserId: authSchema.staffSecurityEvent.subjectUserId,
      metadata: authSchema.staffSecurityEvent.metadata,
      ipAddress: authSchema.staffSecurityEvent.ipAddress,
      createdAt: authSchema.staffSecurityEvent.createdAt,
    })
    .from(authSchema.staffSecurityEvent)
    .orderBy(desc(authSchema.staffSecurityEvent.createdAt))
    .limit(100);

  res.json({ events });
});

staffRouter.post(
  '/staff/:userId/recover-mfa',
  ...requireAdminRole,
  async (req, res) => {
    const parsed = z
      .object({ confirmationEmail: z.string().email() })
      .strict()
      .safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, 'Confirm the staff member email address');
    }

    const actor = req.session?.user;
    const actorSessionCreatedAt = req.session?.session.createdAt;
    if (!actor || !actorSessionCreatedAt) {
      throw new AppError(401, 'Unauthorized');
    }
    if (Date.now() - actorSessionCreatedAt.getTime() > 10 * 60 * 1000) {
      throw new AppError(
        403,
        'Sign in again with your password and authenticator before recovery',
      );
    }

    const userId = getUserIdParam(req.params.userId);
    if (userId === actor.id) {
      throw new AppError(400, 'Use the offline owner recovery procedure');
    }

    const [target] = await db
      .select({
        id: authSchema.user.id,
        email: authSchema.user.email,
        role: authSchema.user.role,
      })
      .from(authSchema.user)
      .where(eq(authSchema.user.id, userId))
      .limit(1);
    const targetRoles = getRoles(target?.role);
    if (
      !target ||
      !targetRoles.some((role) =>
        ['superadmin', 'admin', 'support'].includes(role),
      )
    ) {
      throw new AppError(404, 'Staff member not found');
    }
    if (targetRoles.includes('superadmin')) {
      throw new AppError(
        403,
        'Owner MFA recovery requires the offline procedure',
      );
    }
    if (
      target.email.toLowerCase() !== parsed.data.confirmationEmail.toLowerCase()
    ) {
      throw new AppError(400, 'The confirmation email does not match');
    }
    if (!canRecoverStaffMfa(actor.role, target.role)) {
      throw new AppError(403, 'You cannot recover this staff account');
    }

    await db.transaction(async (tx) => {
      await tx
        .update(authSchema.user)
        .set({ twoFactorEnabled: false, twoFactorEnabledAt: null })
        .where(eq(authSchema.user.id, target.id));
      await tx
        .delete(authSchema.twoFactor)
        .where(eq(authSchema.twoFactor.userId, target.id));
      await tx
        .delete(authSchema.session)
        .where(eq(authSchema.session.userId, target.id));
      await tx.insert(authSchema.staffSecurityEvent).values({
        id: randomUUID(),
        actorId: actor.id,
        subjectUserId: target.id,
        action: 'staff.mfa.recovery_started',
        ipAddress: req.ip ?? null,
        createdAt: new Date(),
      });
    });

    res.status(204).end();
  },
);

export const adminRouter = staffRouter;
