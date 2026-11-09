import { betterAuth } from 'better-auth';
import { drizzleAdapter } from '@better-auth/drizzle-adapter';
import {
  admin as adminPlugin,
  emailOTP,
  multiSession,
  twoFactor as twoFactorPlugin,
} from 'better-auth/plugins';
import { dash } from '@better-auth/infra';
import { APIError, createAuthMiddleware } from 'better-auth/api';
import { desc, eq, sql } from 'drizzle-orm';
import { randomUUID } from 'node:crypto';
import * as authSchema from '../db/auth-schema';
import { env, isProduction } from '../config/env';
import { db } from '../db/client';
import { AppError } from '../errors/AppError';
import { sendOtpEmail } from '../lib/email';
import { sendAuthLinkEmail } from '../lib/email';
import { logger } from '../lib/logger';
import {
  ac,
  admin as adminRole,
  customer,
  superadmin,
  support,
} from './permissions';
import { AUTH_RATE_LIMITS, hasStaffRole, TOTP_LOCKOUT_POLICY } from './policy';

const useSecureCookies = env.BETTER_AUTH_URL.startsWith('https');

async function findUserRoleByEmail(email: string) {
  const [user] = await db
    .select({ role: authSchema.user.role })
    .from(authSchema.user)
    .where(sql`lower(${authSchema.user.email}) = ${email}`)
    .limit(1);
  return user;
}

export const auth = betterAuth({
  appName: 'THRIFT NAIROBI',
  baseURL: env.BETTER_AUTH_URL,
  basePath: '/api/auth',
  secret: env.BETTER_AUTH_SECRET,
  trustedOrigins: env.trustedOrigins,

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema: authSchema,
  }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 14,
    maxPasswordLength: 128,
    async sendResetPassword({ user, url }) {
      await sendAuthLinkEmail({
        email: user.email,
        subject: 'Reset your Thrift Nairobi staff password',
        message:
          'Use this one-time link to choose a new password. Staff two-factor authentication remains required after the reset.',
        url,
      });
    },
  },

  user: {
    changeEmail: {
      enabled: true,
      verifyCurrentEmail: true,
    },
  },

  emailVerification: {
    async sendVerificationEmail({ user, url }) {
      await sendAuthLinkEmail({
        email: user.email,
        subject: 'Confirm your Thrift Nairobi email address',
        message: 'Use this one-time link to verify your new email address.',
        url,
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    cookiePrefix: 'thrift',
    useSecureCookies,
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: 'lax',
      secure: useSecureCookies,
      path: '/',
    },
  },

  rateLimit: {
    ...AUTH_RATE_LIMITS,
    enabled: isProduction,
    storage: 'database',
  },

  onAPIError: {
    onError(error, ctx) {
      const isAuthApiError = error instanceof APIError;
      const statusCode = isAuthApiError ? error.statusCode : 500;
      const authCode =
        isAuthApiError && typeof error.body?.code === 'string'
          ? error.body.code
          : undefined;
      const message =
        isAuthApiError && typeof error.body?.message === 'string'
          ? error.body.message
          : 'Unexpected Better Auth API error';
      const appError = new AppError(
        statusCode,
        message,
        {
          source: 'better-auth',
          code: authCode,
          errorName: error instanceof Error ? error.name : undefined,
        },
        statusCode < 500,
      );
      const logFields = {
        err: appError,
        statusCode,
        authCode,
        authBaseURL: ctx.baseURL,
      };

      if (statusCode >= 500) {
        logger.error(logFields, 'Better Auth API error');
        return;
      }

      logger.warn(logFields, 'Better Auth request rejected');
    },
  },

  plugins: [
    adminPlugin({
      ac,
      roles: {
        superadmin,
        admin: adminRole,
        support,
        customer,
      },
      defaultRole: 'customer',
      adminRoles: ['superadmin'],
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({ email, otp, type });
      },
    }),
    twoFactorPlugin({
      issuer: 'Thrift Nairobi',
      twoFactorCookieMaxAge: 300,
      accountLockout: TOTP_LOCKOUT_POLICY,
    }),
    multiSession({
      maximumSessions: 5,
    }),
    ...(env.BETTER_AUTH_API_KEY
      ? [
          dash({
            apiKey: env.BETTER_AUTH_API_KEY,
          }),
        ]
      : []),
  ],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/sign-up/email') {
        throw new APIError('BAD_REQUEST', {
          message:
            'Password sign-up is disabled. Use email OTP or a staff invite.',
        });
      }

      if (ctx.path === '/two-factor/disable' && ctx.context.session) {
        const [user] = await db
          .select({ role: authSchema.user.role })
          .from(authSchema.user)
          .where(eq(authSchema.user.id, ctx.context.session.user.id))
          .limit(1);
        if (hasStaffRole(user?.role)) {
          throw new APIError('FORBIDDEN', {
            message:
              'Staff MFA is mandatory. Contact the account owner for verified recovery.',
            code: 'STAFF_MFA_REQUIRED',
          });
        }
      }

      if (ctx.path === '/change-email' && ctx.context.session) {
        const [user] = await db
          .select({ role: authSchema.user.role })
          .from(authSchema.user)
          .where(eq(authSchema.user.id, ctx.context.session.user.id))
          .limit(1);
        const createdAt = ctx.context.session.session.createdAt;
        if (
          hasStaffRole(user?.role) &&
          Date.now() - createdAt.getTime() > 10 * 60 * 1000
        ) {
          throw new APIError('FORBIDDEN', {
            message:
              'Sign in again with your password and authenticator before changing your email.',
            code: 'STAFF_REAUTH_REQUIRED',
          });
        }
      }

      if (ctx.path === '/request-password-reset') {
        const body = ctx.body;
        const email =
          body &&
          typeof body === 'object' &&
          'email' in body &&
          typeof body.email === 'string'
            ? body.email.toLowerCase()
            : undefined;
        const existingUser = email ? await findUserRoleByEmail(email) : null;
        if (!hasStaffRole(existingUser?.role)) {
          return ctx.json({ status: true });
        }
      }

      if (ctx.path === '/email-otp/send-verification-otp') {
        const body = ctx.body;
        const email =
          body &&
          typeof body === 'object' &&
          'email' in body &&
          typeof body.email === 'string'
            ? body.email.toLowerCase()
            : undefined;
        const isSignInOtp =
          body &&
          typeof body === 'object' &&
          'type' in body &&
          body.type === 'sign-in';

        if (isSignInOtp && email) {
          const existingUser = await findUserRoleByEmail(email);

          if (hasStaffRole(existingUser?.role)) {
            return ctx.json({ success: true });
          }

          if (
            !existingUser &&
            ctx.getHeader('x-customer-account-consent') !== 'true'
          ) {
            return ctx.json({ success: true });
          }
        }
      }

      if (ctx.path === '/sign-in/email') {
        const body = ctx.body;
        const email =
          body &&
          typeof body === 'object' &&
          'email' in body &&
          typeof body.email === 'string'
            ? body.email.toLowerCase()
            : undefined;
        const existingUser = email ? await findUserRoleByEmail(email) : null;

        if (existingUser && !hasStaffRole(existingUser.role)) {
          throw new APIError('UNAUTHORIZED', {
            message: 'Invalid email or password',
            code: 'INVALID_EMAIL_OR_PASSWORD',
          });
        }
      }

      if (ctx.path === '/sign-in/email-otp') {
        const body = ctx.body;
        const email =
          body &&
          typeof body === 'object' &&
          'email' in body &&
          typeof body.email === 'string'
            ? body.email.toLowerCase()
            : undefined;

        const existingUser = email ? await findUserRoleByEmail(email) : null;

        if (
          hasStaffRole(existingUser?.role) ||
          (email &&
            !existingUser &&
            ctx.getHeader('x-customer-account-consent') !== 'true')
        ) {
          throw new APIError('BAD_REQUEST', {
            message: 'Invalid OTP',
            code: 'INVALID_OTP',
          });
        }
      }

      return undefined;
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path === '/two-factor/verify-totp') {
        const userId =
          ctx.context.session?.user.id ?? ctx.context.newSession?.user.id;
        if (userId) {
          const [user] = await db
            .select({
              twoFactorEnabled: authSchema.user.twoFactorEnabled,
              twoFactorEnabledAt: authSchema.user.twoFactorEnabledAt,
            })
            .from(authSchema.user)
            .where(eq(authSchema.user.id, userId))
            .limit(1);

          if (user?.twoFactorEnabled && !user.twoFactorEnabledAt) {
            const [latestSession] = await db
              .select({ createdAt: authSchema.session.createdAt })
              .from(authSchema.session)
              .where(eq(authSchema.session.userId, userId))
              .orderBy(desc(authSchema.session.createdAt))
              .limit(1);

            if (latestSession) {
              await db
                .update(authSchema.user)
                .set({ twoFactorEnabledAt: latestSession.createdAt })
                .where(eq(authSchema.user.id, userId));
            }
          }
        }
        return;
      }

      if (ctx.path === '/two-factor/disable' && ctx.context.session) {
        const userId = ctx.context.session.user.id;
        const [user] = await db
          .select({ role: authSchema.user.role })
          .from(authSchema.user)
          .where(eq(authSchema.user.id, userId))
          .limit(1);
        if (hasStaffRole(user?.role)) {
          await db.transaction(async (tx) => {
            await tx
              .update(authSchema.user)
              .set({ twoFactorEnabledAt: null })
              .where(eq(authSchema.user.id, userId));
            await tx
              .delete(authSchema.session)
              .where(eq(authSchema.session.userId, userId));
            await tx.insert(authSchema.staffSecurityEvent).values({
              id: randomUUID(),
              actorId: userId,
              subjectUserId: userId,
              action: 'staff.mfa.disabled',
              createdAt: new Date(),
            });
          });
        } else {
          await db
            .update(authSchema.user)
            .set({ twoFactorEnabledAt: null })
            .where(eq(authSchema.user.id, userId));
        }
        return;
      }

      if (
        (ctx.path === '/change-password' || ctx.path === '/change-email') &&
        ctx.context.session
      ) {
        const userId = ctx.context.session.user.id;
        const [user] = await db
          .select({ role: authSchema.user.role })
          .from(authSchema.user)
          .where(eq(authSchema.user.id, userId))
          .limit(1);
        if (hasStaffRole(user?.role)) {
          await db.insert(authSchema.staffSecurityEvent).values({
            id: randomUUID(),
            actorId: userId,
            subjectUserId: userId,
            action:
              ctx.path === '/change-password'
                ? 'staff.password.changed'
                : 'staff.email_change.requested',
            createdAt: new Date(),
          });
        }
      }

      if (ctx.path !== '/sign-in/email-otp' && ctx.path !== '/sign-in/email') {
        return;
      }

      const session = ctx.context.newSession;
      if (!session) {
        return;
      }

      logger.info(
        {
          event: 'auth.sign_in.succeeded',
          method: ctx.path === '/sign-in/email-otp' ? 'email-otp' : 'email',
          userId: session.user.id,
        },
        'User signed in successfully',
      );
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session['user'];
