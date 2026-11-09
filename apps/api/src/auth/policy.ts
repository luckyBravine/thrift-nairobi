import { STAFF_ROLES } from './roles';
import type { StaffRole } from './roles';

export const STAFF_SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export const TOTP_LOCKOUT_POLICY = {
  enabled: true,
  maxFailedAttempts: 5,
  durationSeconds: 15 * 60,
} as const;

export const AUTH_RATE_LIMITS = {
  enabled: true,
  window: 60,
  max: 100,
  customRules: {
    '/sign-in/email': { window: 60, max: 5 },
    '/email-otp/send-verification-otp': { window: 300, max: 3 },
    '/sign-in/email-otp': { window: 300, max: 5 },
    '/two-factor/*': { window: 300, max: 5 },
    '/request-password-reset': { window: 300, max: 3 },
    '/change-email': { window: 300, max: 3 },
  },
} as const;

export function getRoles(role: string | string[] | null | undefined) {
  return Array.isArray(role)
    ? role
    : typeof role === 'string'
      ? role.split(',').map((entry) => entry.trim())
      : [];
}

export function hasStaffRole(
  role: string | string[] | null | undefined,
): boolean {
  return getRoles(role).some((entry) =>
    STAFF_ROLES.includes(entry as StaffRole),
  );
}

export function canRecoverStaffMfa(
  actorRole: string | string[] | null | undefined,
  subjectRole: string | string[] | null | undefined,
): boolean {
  const actorRoles = getRoles(actorRole);
  const subjectRoles = getRoles(subjectRole);
  if (
    subjectRoles.includes('superadmin') ||
    (!subjectRoles.includes('admin') && !subjectRoles.includes('support'))
  ) {
    return false;
  }
  if (actorRoles.includes('superadmin')) return true;
  return (
    actorRoles.includes('admin') &&
    subjectRoles.includes('support') &&
    !subjectRoles.includes('admin')
  );
}

export function isStaffSessionFresh(
  createdAt: Date | null | undefined,
  now = Date.now(),
) {
  if (!createdAt) return false;
  const age = now - createdAt.getTime();
  return age >= 0 && age < STAFF_SESSION_MAX_AGE_MS;
}

export function isStaffMfaSessionValid(
  enabled: boolean | null | undefined,
  enabledAt: Date | null | undefined,
  sessionCreatedAt: Date | null | undefined,
) {
  return Boolean(
    enabled &&
      enabledAt &&
      sessionCreatedAt &&
      sessionCreatedAt >= enabledAt &&
      isStaffSessionFresh(sessionCreatedAt),
  );
}

export function canAcceptInvite(
  acceptedAt: Date | null | undefined,
  expiresAt: Date,
  now = Date.now(),
) {
  return !acceptedAt && expiresAt.getTime() > now;
}
