import { createAuthClient } from 'better-auth/react';
import {
  emailOTPClient,
  adminClient,
  multiSessionClient,
} from 'better-auth/client/plugins';

export const authClient = createAuthClient({
  // Prefer same-origin via Vite proxy so cookies work cleanly:
  // baseURL: ""  and call /api/auth/...
  // Or absolute API URL with credentials:
  baseURL:
    import.meta.env.VITE_API_URL ?? 'http://localhost:3333',
  plugins: [emailOTPClient(), adminClient(), multiSessionClient()],
});