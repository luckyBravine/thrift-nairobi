import { createAccessControl } from 'better-auth/plugins/access';
import { defaultStatements, adminAc } from 'better-auth/plugins/admin/access';

export { STAFF_ROLES } from './roles';
export type { AppRole, StaffRole } from './roles';

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
export const customer = ac.newRole({});
export const user = customer;
