# API staff authentication

## API boundaries and session handling

| API area                    | Routes                          | Access policy                                                                                                         | Token/session                    |
| --------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------- | -------------------------------- |
| Public storefront           | `/api/storefront/*`             | Public, endpoint-specific input validation and abuse controls                                                         | No user session required         |
| Customer account            | `/api/account/*`                | Valid session and `customer` role                                                                                     | Better Auth session cookie       |
| Staff administration        | `/api/admin/*`                  | Valid staff session, staff role, enrolled TOTP, and an eight-hour session limit; sensitive operations add role checks | Better Auth session cookie       |
| Staff enrollment status     | `/api/staff-auth/state`         | Valid staff identity; exposes only whether MFA is enrolled so first-time setup can proceed                            | Better Auth session cookie       |
| Staff invitation acceptance | `/api/staff-invitations/accept` | Public, but requires an unexpired, single-use, high-entropy invitation token                                          | Capability token in request body |
| Authentication              | `/api/auth/*`                   | Shared Better Auth endpoints with server-side customer/staff method separation                                        | Better Auth session cookie       |

Only the health endpoint currently exists under `/api/storefront`; catalog,
search, and product APIs have not yet been implemented. Add public read
endpoints there and keep account-specific operations under `/api/account`.
Do not add customer or staff data endpoints to the public storefront router.
Keep the public invitation acceptance and staff enrollment-status exceptions
outside `/api/admin`, so edge rules can protect the entire admin API prefix.

The browser uses Better Auth's opaque, server-validated session cookie; it
does not issue application JWTs or trust a client-supplied role. Cookies are
HttpOnly and SameSite=Lax, and Secure when the configured auth URL uses HTTPS.
Authenticated browser requests include credentials; the API resolves the
session and role on each protected request. Never put session tokens in
localStorage, URL parameters, or application logs. If a future mobile or
third-party client needs bearer tokens, design a separate OAuth/OIDC flow
with explicit audiences/scopes and revocation rather than reusing browser
cookies or inventing long-lived JWTs.

Customer accounts currently authenticate with email OTP. Customer TOTP is
not required and there is no customer MFA enrollment flow. For a general
storefront, mandatory TOTP adds substantial checkout and recovery friction;
keep it optional unless the account is high-risk. Consider adding an opt-in
passkey or authenticator and step-up verification for sensitive account or
payment changes when those APIs are implemented. Staff accounts remain
required to use TOTP.

The customer account API exposes only the authenticated customer's profile at
`GET /api/account/me` and linked order summaries at `GET /api/account/orders`.
Both routes require the server-validated Better Auth session and `customer`
role. Order queries are filtered by that session's user ID and exclude
archived orders; guest orders are not exposed unless explicitly linked to the
customer account. Never accept a user ID from the browser as the data owner.

## Production setup

1. Apply the migrations before starting the API:

   ```sh
   pnpm --dir apps/api exec drizzle-kit migrate
   ```

2. Configure `DATABASE_URL` and a unique `BETTER_AUTH_SECRET` of at least 32
   characters as server-side secrets. Set an HTTPS `BETTER_AUTH_URL`, the
   exact storefront `WEB_ORIGIN`, and any additional allowed browser origins
   in `AUTH_TRUSTED_ORIGINS`. Configure `RESEND_API_KEY` and a verified
   `EMAIL_FROM` sender so staff invitations and customer verification codes
   are delivered by email. Staging and production require HTTPS and fail
   closed when Resend is not configured.
   At web build time, set `VITE_API_URL` to the public API origin. This is a
   browser-visible URL, not a place for secrets.

3. Bootstrap the first owner once, using a unique password of at least 14
   characters. Provide `SEED_SUPERADMIN_EMAIL` and `SEED_SUPERADMIN_PASSWORD`
   only to the API process running the bootstrap command:

   ```sh
   pnpm --dir apps/api exec tsx src/scripts/seed-superadmin.ts
   ```

   Migrations create the schema but do not create an owner account. This
   command refuses to create another superadmin and has no default account or
   password; it should not be part of normal API startup. Do not put these
   credentials in frontend variables, source control, build arguments, or
   logs.

4. Sign in at `/admin/login`. The first successful staff sign-in must enroll an
   authenticator app and save the one-time recovery codes before staff pages
   are enabled. Ask an owner or admin to invite additional staff from the
   staff-management page.

## Staff security behavior

- Staff accounts are created only from single-use, 24-hour invitations. The
  database stores a SHA-256 token hash, not the invitation token.
- `staff_invite_role` is restricted to `admin` and `support`; `superadmin` is
  created only by the bootstrap process. Better Auth's user role remains a
  text field, while server-side role guards recognize only `customer`,
  `support`, `admin`, and `superadmin`.
- Staff sign in with their own password and mandatory authenticator-app TOTP.
  Staff email OTP is not accepted as a sign-in method.
- Admin API access checks the current database role, MFA enrollment, and an
  eight-hour absolute staff-session limit. Customer sessions keep their
  existing session policy.
- Role changes and disabling an account revoke that user's active sessions.
  Only the owner can assign admin roles or change staff roles. Owner accounts
  cannot be disabled from the staff-management page.
- Better Auth's direct account-management mutation endpoints are blocked from
  HTTP clients; use the protected invite and staff-management endpoints.
- Invitation tokens and recovery codes must not be added to logs or analytics.
  Staff invitation email delivery requires Resend in every environment; the
  application never prints invitation links or tokens to a console.

## Profile, recovery, and sessions

- Staff can update their display name, request an email change, change their
  password, review active sessions, revoke an individual session, or revoke
  every other session from `/admin/profile`.
- Staff email changes require recent password-plus-TOTP authentication and
  confirmation links; the new address must be verified before it is trusted.
  Password changes require the current password. A reset link does not remove
  the TOTP requirement.
- A superadmin can reset MFA for an admin or support account. An admin can
  reset MFA only for a support account. The operator must reauthenticate
  recently, confirm the account email, and the affected user must enroll a new
  authenticator. The workflow revokes that user's sessions and records an
  audit event.
- The sole superadmin cannot use the web recovery endpoint. For MFA or email
  recovery, use the corresponding interactive script from a restricted
  production/staging operations terminal, require the documented incident
  ticket and confirmation prompt, and protect the database credentials as
  break-glass secrets:

  ```sh
  pnpm --dir apps/api exec tsx src/scripts/recover-superadmin-mfa.ts
  pnpm --dir apps/api exec tsx src/scripts/recover-superadmin-email.ts
  ```

- Customer and staff entry points have different UX and authentication
  policies: customers use storefront email OTP; staff use the separate
  password-and-TOTP portal. Do not expose the staff portal in customer
  navigation. This is not a security boundary: anyone can manually request a
  known URL. If the staff page itself must be unreachable to the public,
  configure Cloudflare Access, a VPN, or an equivalent edge/network policy.
  API authorization and MFA remain mandatory regardless of page visibility.

## Deployment checks and test coverage

Before calling a deployment production-ready, verify in the deployed
environment that:

- the migration has been applied, and login, invitation, reset, email-change,
  and OTP messages are actually delivered by the verified Resend sender;
- the public web/API URLs use HTTPS, `WEB_ORIGIN` and
  `AUTH_TRUSTED_ORIGINS` are exact browser origins, and any proxy/IP settings
  used for throttling are trustworthy;
- Cloudflare Access or the chosen network boundary protects the staff page
  when page-level privacy is required; and
- password/OTP/TOTP rate limiting, lockout, session revocation, and recovery
  have been exercised in a non-production environment.

The API Jest suite currently covers policy helpers, staff/customer middleware,
API mounting, CORS, and safe error responses. It is not a substitute for
database-backed authentication integration or browser end-to-end testing.
Those tests, production provider checks, edge-policy configuration, and
deployment verification are still required before describing the system as
production-ready.

The admin dashboard's commerce data views are still backed by frontend demo
data; authentication does not make those product, order, or message workflows
production-backed.
