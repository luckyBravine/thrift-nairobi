import { createAuthClient } from 'better-auth/react';
import {
  emailOTPClient,
  multiSessionClient,
  twoFactorClient,
} from 'better-auth/client/plugins';

export const API_BASE_URL =
  import.meta.env['VITE_API_URL'] ?? 'http://localhost:3000';

export const authClient = createAuthClient({
  baseURL: API_BASE_URL,
  basePath: '/api/auth',
  fetchOptions: {
    credentials: 'include',
  },
  plugins: [emailOTPClient(), multiSessionClient(), twoFactorClient()],
});
