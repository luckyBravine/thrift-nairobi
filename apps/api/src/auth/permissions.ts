import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

/**
 * Resources for staff RBAC.
 * Keep names singular to match Better Auth conventions.
 */
export const statement = {
  ...defaultStatements,
  product: ['create', 'read', 'update', 'delete'],
  order: ['read', 'update'],
  message: ['read', 'update'],
  invite: ['create', 'read', 'revoke'],
  settings: ['read', 'update'],
  staff: ['read', 'update'],
} as const;

export const ac = createAccessControl(statement);

export const support = ac.newRole({
  product: ['read'],
  order: ['read', 'update'],
  message: ['read', 'update'],
});

export const admin = ac.newRole({
  product: ['create', 'read', 'update', 'delete'],
  order: ['read', 'update'],
  message: ['read', 'update'],
  invite: ['create', 'read', 'revoke'],
  staff: ['read'],
  ...adminAc.statements, // Better Auth admin user/session tools
});

export const superadmin = ac.newRole({
  product: ['create', 'read', 'update', 'delete'],
  order: ['read', 'update'],
  message: ['read', 'update'],
  invite: ['create', 'read', 'revoke'],
  settings: ['read', 'update'],
  staff: ['read', 'update'],
  ...adminAc.statements,
});

/** Customer / non-staff */
export const user = ac.newRole({});

export const STAFF_ROLES = ['superadmin', 'admin', 'support'] as const;
export type StaffRole = (typeof STAFF_ROLES)[number];
export type AppRole = StaffRole | 'user';