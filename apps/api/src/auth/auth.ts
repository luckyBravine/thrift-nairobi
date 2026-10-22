import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin as adminPlugin } from 'better-auth/plugins';
import * as schema from '../db/schema/schema'
import { env } from '../config/env';
import { ac, admin, superadmin, support, user } from './permissions';
import { db } from '../db/client';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
    schema,
  }),
  baseURL: env.BETTER_AUTH_URL, // e.g. http://localhost:3333
  secret: env.BETTER_AUTH_SECRET, // min 32 chars
  emailAndPassword: {
    enabled: true,
    // Staff should come via invite; public sign-up can stay off until customer accounts
    disableSignUp: true, // optional hard lock
  },
  user: {
    additionalFields: {
      // Admin plugin also manages `role`; keep aligned
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
        input: false, // clients must not set role on sign-up
      },
    },
  },
  plugins: [
    adminPlugin({
      ac,
      roles: {
        superadmin,
        admin,
        support,
        user,
      },
      defaultRole: 'user',
      adminRoles: ['superadmin', 'admin'], // who can use admin plugin APIs
    }),
  ],
  trustedOrigins: [
    'http://localhost:8080', // Vite
    'http://localhost:5173',
    // production storefront origin later
  ],
});

export type Session = typeof auth.$Infer.Session;