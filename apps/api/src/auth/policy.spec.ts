import {
  AUTH_RATE_LIMITS,
  canRecoverStaffMfa,
  canAcceptInvite,
  getRoles,
  hasStaffRole,
  isStaffMfaSessionValid,
  isStaffSessionFresh,
  STAFF_SESSION_MAX_AGE_MS,
  TOTP_LOCKOUT_POLICY,
} from './policy';

describe('authentication policy', () => {
  it('keeps customer and staff roles distinct', () => {
    expect(hasStaffRole('customer')).toBe(false);
    expect(hasStaffRole('admin')).toBe(true);
    expect(hasStaffRole('customer, support')).toBe(true);
    expect(getRoles(['customer', 'support'])).toEqual(['customer', 'support']);
  });

  it('expires staff sessions at the eight-hour limit and rejects future timestamps', () => {
    const now = Date.now();
    expect(
      isStaffSessionFresh(new Date(now - STAFF_SESSION_MAX_AGE_MS + 1), now),
    ).toBe(true);
    expect(
      isStaffSessionFresh(new Date(now - STAFF_SESSION_MAX_AGE_MS), now),
    ).toBe(false);
    expect(isStaffSessionFresh(new Date(now + 1000), now)).toBe(false);
  });

  it('requires an enrolled MFA factor before the staff session was created', () => {
    const now = Date.now();
    const enabledAt = new Date(now - 2000);
    const sessionCreatedAt = new Date(now - 1000);

    expect(isStaffMfaSessionValid(true, enabledAt, sessionCreatedAt)).toBe(
      true,
    );
    expect(isStaffMfaSessionValid(true, new Date(now), sessionCreatedAt)).toBe(
      false,
    );
    expect(isStaffMfaSessionValid(false, enabledAt, sessionCreatedAt)).toBe(
      false,
    );
  });

  it('only accepts unused invitations before their expiry', () => {
    const now = Date.now();
    expect(canAcceptInvite(null, new Date(now + 1), now)).toBe(true);
    expect(canAcceptInvite(new Date(now - 1), new Date(now + 1), now)).toBe(
      false,
    );
    expect(canAcceptInvite(null, new Date(now), now)).toBe(false);
  });

  it('limits staff MFA recovery to the owner or an admin recovering support', () => {
    expect(canRecoverStaffMfa('superadmin', 'admin')).toBe(true);
    expect(canRecoverStaffMfa('superadmin', 'support')).toBe(true);
    expect(canRecoverStaffMfa('admin', 'support')).toBe(true);
    expect(canRecoverStaffMfa('admin', 'admin')).toBe(false);
    expect(canRecoverStaffMfa('admin', 'admin,support')).toBe(false);
    expect(canRecoverStaffMfa('support', 'support')).toBe(false);
    expect(canRecoverStaffMfa('superadmin', 'superadmin')).toBe(false);
    expect(canRecoverStaffMfa('admin', 'customer')).toBe(false);
  });

  it('configures bounded authentication attempts and a TOTP lockout', () => {
    expect(AUTH_RATE_LIMITS.customRules['/sign-in/email']).toEqual({
      window: 60,
      max: 5,
    });
    expect(
      AUTH_RATE_LIMITS.customRules['/email-otp/send-verification-otp'],
    ).toEqual({ window: 300, max: 3 });
    expect(TOTP_LOCKOUT_POLICY).toEqual({
      enabled: true,
      maxFailedAttempts: 5,
      durationSeconds: 900,
    });
  });
});
