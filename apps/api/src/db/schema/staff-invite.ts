import {
  pgTable,
  text,
  timestamp,
  uuid,
  pgEnum,
} from 'drizzle-orm/pg-core';

export const staffRoleEnum = pgEnum('staff_role', [
  'superadmin',
  'admin',
  'support',
  'marketing',
]);

export const staffInvites = pgTable('staff_invites', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: text('email').notNull(),
  role: staffRoleEnum('role').notNull(), // admin | support (superadmin rare)
  token: text('token').notNull().unique(),
  invitedByUserId: text('invited_by_user_id').notNull(), // FK → user.id
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});