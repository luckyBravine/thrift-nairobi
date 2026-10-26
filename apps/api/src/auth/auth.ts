import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin, emailOTP, multiSession } from "better-auth/plugins";
import * as schema from '../db/schema/schema'
import { env } from '../config/env';
import { db } from '../db/client';
import { APIError, createAuthMiddleware } from "better-auth/api";
import {sendOtpEmail} from '../lib/email';


export const auth = betterAuth({
  appName: "THRIFT NAIROBI",
  baseURL: env.BETTER_AUTH_URL, // e.g. http://localhost:3333
  secret: env.BETTER_AUTH_SECRET, // min 32 chars

  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),

  emailAndPassword: {
    enabled: true,
    // Staff should come via invite; public sign-up can stay off until customer accounts
    disableSignUp: true, // optional hard lock
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },

  advanced: {
    cookiePrefix: "thift",
    defaultCookieAttributes: {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
    },
  },

  trustedOrigins: [env.WEB_ORIGIN, env.BETTER_AUTH_URL ?? 'hhshshshs'],

  // user: {
  //   additionalFields: {
  //     // Admin plugin also manages `role`; keep aligned
  //     role: {
  //       type: 'string',
  //       required: false,
  //       defaultValue: 'user',
  //       input: false, // clients must not set role on sign-up
  //     },
  //   },
  // },

  plugins: [
    admin({
      defaultRole: "customer",
      adminRoles: ["superadmin", "admin", "support"],
    }),
    emailOTP({
      otpLength: 6,
      expiresIn: 300,
      async sendVerificationOTP({ email, otp, type }) {
        await sendOtpEmail({ email, otp, type });
      },
    }),
    multiSession({
      maximumSessions: 5,
    }),
  ],

  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        throw new APIError("BAD_REQUEST", {
          message: "Password sign-up is disabled. Use email OTP or a staff invite.",
        });
      }
    }),
  },
});

export type Session = typeof auth.$Infer.Session;
export type AuthUser = Session["user"];