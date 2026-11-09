import type { RequestHandler } from 'express';
import { requireRole, requireSession } from './require-auth';
import {
  getRoles,
  isStaffMfaSessionValid,
  isStaffSessionFresh,
} from '../auth/policy';
import { STAFF_ROLES } from '../auth/roles';
import { AppError } from '../errors/AppError';
import { eq } from 'drizzle-orm';
import * as authSchema from '../db/auth-schema';
import { db } from '../db/client';

export function requireRoles(roles: readonly string[]): RequestHandler[] {
  return [requireSession, requireRole(roles)];
}

const requireStaffMfa: RequestHandler = (req, _res, next) => {
  const user = req.session?.user;
  if (!user) {
    next(new AppError(401, 'Unauthorized'));
    return;
  }

  const role = getRoles(user.role);

  if (
    !role.some((entry) =>
      STAFF_ROLES.includes(entry as (typeof STAFF_ROLES)[number]),
    )
  ) {
    next();
    return;
  }

  void (async () => {
    const sessionCreatedAt = req.session?.session.createdAt;
    if (!isStaffSessionFresh(sessionCreatedAt)) {
      next(new AppError(401, 'Staff session expired. Sign in again.'));
      return;
    }

    const [storedUser] = await db
      .select({
        twoFactorEnabled: authSchema.user.twoFactorEnabled,
        twoFactorEnabledAt: authSchema.user.twoFactorEnabledAt,
      })
      .from(authSchema.user)
      .where(eq(authSchema.user.id, user.id))
      .limit(1);

    if (
      !isStaffMfaSessionValid(
        storedUser?.twoFactorEnabled,
        storedUser?.twoFactorEnabledAt,
        sessionCreatedAt,
      )
    ) {
      next(new AppError(403, 'Staff two-factor authentication is required'));
      return;
    }

    next();
  })().catch(next);
};

export const requireStaff: RequestHandler[] = [
  ...requireRoles(STAFF_ROLES),
  requireStaffMfa,
];
export const requireStaffIdentity: RequestHandler[] = requireRoles(STAFF_ROLES);
export const requireAdmin: RequestHandler[] = [
  ...requireRoles(['superadmin', 'admin']),
  requireStaffMfa,
];
export const requireAdminRole: RequestHandler[] = [
  requireRole(['superadmin', 'admin']),
];
export const requireCustomer: RequestHandler[] = requireRoles(['customer']);
