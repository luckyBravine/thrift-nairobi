import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { useStaff } from '@/lib/admin-auth';
import { API_BASE_URL, authClient } from '@/lib/auth';

const profileSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(['superadmin', 'admin', 'support']),
  emailVerified: z.boolean(),
  createdAt: z.string().or(z.date()),
  twoFactorEnabled: z.boolean(),
});

const sessionsSchema = z.array(
  z.object({
    id: z.string(),
    isCurrent: z.boolean(),
    createdAt: z.string().or(z.date()),
    expiresAt: z.string().or(z.date()),
    ipAddress: z.string().nullable(),
    userAgent: z.string().nullable(),
  }),
);

type StaffProfile = z.infer<typeof profileSchema>;
type StaffSessionInfo = z.infer<typeof sessionsSchema>[number];

export const Route = createFileRoute('/admin/profile')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Profile & Security — Thrift Nairobi Staff' },
      { name: 'robots', content: 'noindex' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: ProfilePage,
});

async function adminRequest<T>(
  path: string,
  schema: z.ZodType<T>,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/api/admin${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      ...(init?.body ? { 'content-type': 'application/json' } : {}),
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      typeof body === 'object' &&
      body !== null &&
      'message' in body &&
      typeof body.message === 'string'
        ? body.message
        : 'The request could not be completed.';
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  const result = schema.safeParse(await response.json());
  if (!result.success) {
    throw new Error('The server returned an invalid response.');
  }
  return result.data;
}

function formatDate(value: string | Date) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function describeSession(session: StaffSessionInfo) {
  const agent = session.userAgent;
  if (!agent) return 'Browser or device not reported';
  if (/mobile|android|iphone|ipad/i.test(agent)) return 'Mobile device';
  if (/edg\//i.test(agent)) return 'Microsoft Edge';
  if (/firefox\//i.test(agent)) return 'Firefox';
  if (/chrome\//i.test(agent)) return 'Chrome';
  if (/safari\//i.test(agent)) return 'Safari';
  return 'Browser session';
}

function ProfilePage() {
  return (
    <AdminShell title="Profile & security">
      <ProfileContent />
    </AdminShell>
  );
}

function ProfileContent() {
  const { session: signedInStaff } = useStaff();
  const [profile, setProfile] = useState<StaffProfile | null>(null);
  const [sessions, setSessions] = useState<StaffSessionInfo[]>([]);
  const [name, setName] = useState(signedInStaff.name);
  const [newEmail, setNewEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [nextPassword, setNextPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadAccount = useCallback(async () => {
    setError('');
    try {
      const [profileResult, sessionResult] = await Promise.all([
        adminRequest('/profile', z.object({ user: profileSchema })),
        adminRequest('/sessions', z.object({ sessions: sessionsSchema })),
      ]);
      setProfile(profileResult.user);
      setName(profileResult.user.name);
      setSessions(sessionResult.sessions);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'We could not load your account details.',
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAccount();
  }, [loadAccount]);

  async function saveName(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await adminRequest(
        '/profile',
        z.object({
          user: z.object({
            id: z.string(),
            name: z.string(),
            email: z.string().email(),
            role: z.string(),
          }),
        }),
        { method: 'PATCH', body: JSON.stringify({ name }) },
      );
      setNotice('Your profile name has been updated.');
      await loadAccount();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : 'We could not update your profile.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function requestEmailChange(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await authClient.changeEmail({
        newEmail,
        callbackURL: `${window.location.origin}/admin/profile`,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      setNotice(
        'Check both your current and new inboxes to confirm the email change.',
      );
      setNewEmail('');
    } catch (changeError) {
      setError(
        changeError instanceof Error
          ? changeError.message
          : 'We could not start the email change.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function resendVerificationEmail() {
    if (!profile) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await authClient.sendVerificationEmail({
        email: profile.email,
        callbackURL: `${window.location.origin}/admin/profile`,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      setNotice(
        'If the address can receive email, a verification link is on its way.',
      );
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : 'We could not send a verification link.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword: nextPassword,
        revokeOtherSessions: true,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      setCurrentPassword('');
      setNextPassword('');
      setNotice('Password changed. Other active sessions were signed out.');
      await loadAccount();
    } catch (passwordError) {
      setError(
        passwordError instanceof Error
          ? passwordError.message
          : 'We could not change your password.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function revokeSession(id: string) {
    if (!window.confirm('Sign out this device?')) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await adminRequest(`/sessions/${encodeURIComponent(id)}`, z.unknown(), {
        method: 'DELETE',
      });
      setNotice('That device session has been signed out.');
      await loadAccount();
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : 'We could not revoke that session.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function revokeOtherSessions() {
    if (!window.confirm('Sign out every other active device?')) return;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await adminRequest(
        '/sessions/revoke-others',
        z.object({ revokedCount: z.number().int().nonnegative() }),
        { method: 'POST' },
      );
      setNotice(
        result.revokedCount === 0
          ? 'There were no other active sessions.'
          : `${result.revokedCount} other session${result.revokedCount === 1 ? '' : 's'} signed out.`,
      );
      await loadAccount();
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : 'We could not revoke other sessions.',
      );
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading profile…</p>;
  }

  if (!profile) {
    return (
      <div className="max-w-3xl">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-accent/30 p-4 text-sm"
          >
            {error}
          </p>
        )}
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => void loadAccount()}
        >
          Try again
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Account
        </p>
        <h1 className="mt-2 font-display text-4xl sm:text-5xl">
          Profile & security
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Keep your staff details current and review where your account is
          signed in.
        </p>
      </div>

      {error && (
        <p
          role="alert"
          className="mb-4 rounded-lg border border-accent/30 p-4 text-sm text-accent"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mb-4 rounded-lg border border-primary/20 bg-secondary/40 p-4 text-sm"
        >
          {notice}
        </p>
      )}

      <section className="admin-card">
        <div className="mb-5">
          <h2 className="font-display text-2xl">Personal details</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Your access role is managed separately by an authorized
            administrator.
          </p>
        </div>
        <form className="grid gap-5 sm:grid-cols-2" onSubmit={saveName}>
          <label className="text-sm">
            Display name
            <input
              required
              minLength={2}
              maxLength={100}
              autoComplete="name"
              className="field mt-2"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <div className="text-sm">
            Staff role
            <p className="mt-2 flex min-h-11 items-center">
              <span className="badge badge-role">{profile.role}</span>
              <span className="ml-2 text-xs text-muted-foreground">
                Managed by an administrator
              </span>
            </p>
          </div>
          <div className="sm:col-span-2">
            <Button disabled={busy || name.trim() === profile.name}>
              {busy ? 'Saving…' : 'Save name'}
            </Button>
          </div>
        </form>
      </section>

      <section className="admin-card mt-5">
        <div className="mb-5">
          <h2 className="font-display text-2xl">Email address</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Current email:{' '}
            <strong className="font-medium text-foreground">
              {profile.email}
            </strong>
            {!profile.emailVerified && ' · Not verified'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Changes take effect only after confirmation through your current and
            new inboxes.
          </p>
        </div>
        <form
          className="flex flex-col gap-3 sm:flex-row"
          onSubmit={requestEmailChange}
        >
          <input
            required
            type="email"
            autoComplete="email"
            aria-label="New email address"
            placeholder="New email address"
            className="field flex-1"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
          />
          <Button
            type="submit"
            variant="outline"
            disabled={busy || !profile.emailVerified}
          >
            {busy ? 'Sending…' : 'Verify new email'}
          </Button>
        </form>
        {!profile.emailVerified && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-accent">
              Verify your current email before requesting a change. If you no
              longer control it, contact the designated account administrator.
            </p>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              disabled={busy}
              onClick={() => void resendVerificationEmail()}
            >
              Resend verification
            </Button>
          </div>
        )}
      </section>

      <section className="admin-card mt-5">
        <div className="mb-5">
          <h2 className="font-display text-2xl">Password</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a unique password with at least 14 characters. Changing it
            signs out other devices.
          </p>
        </div>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={changePassword}>
          <label className="text-sm">
            Current password
            <input
              required
              type="password"
              autoComplete="current-password"
              className="field mt-2"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
            />
          </label>
          <label className="text-sm">
            New password
            <input
              required
              type="password"
              minLength={14}
              maxLength={128}
              autoComplete="new-password"
              className="field mt-2"
              value={nextPassword}
              onChange={(event) => setNextPassword(event.target.value)}
            />
          </label>
          <div className="sm:col-span-2">
            <Button variant="outline" disabled={busy}>
              {busy ? 'Updating…' : 'Change password'}
            </Button>
          </div>
        </form>
      </section>

      <section className="admin-card mt-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Two-factor authentication</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Staff access requires an authenticator app. Lost both your
              authenticator and recovery codes? Contact the owner for a verified
              recovery.
            </p>
          </div>
          <span className="badge badge-paid">Enabled</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Never share your authenticator setup key or recovery codes. Recovery
          resets revoke all active sessions and require fresh enrollment.
        </p>
      </section>

      <section className="admin-card mt-5">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl">Active sessions</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Review signed-in devices. Unknown sessions should be revoked and
              your password changed.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={
              busy || sessions.filter((item) => !item.isCurrent).length === 0
            }
            onClick={() => void revokeOtherSessions()}
          >
            Sign out other devices
          </Button>
        </div>
        <ul className="divide-y divide-border">
          {sessions.map((item) => (
            <li
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div>
                <p className="text-sm font-medium">
                  {describeSession(item)}
                  {item.isCurrent && (
                    <span className="ml-2 badge badge-role">This device</span>
                  )}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Signed in {formatDate(item.createdAt)}
                  {item.ipAddress ? ` · ${item.ipAddress}` : ''}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Expires {formatDate(item.expiresAt)}
                </p>
              </div>
              {!item.isCurrent && (
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  disabled={busy}
                  onClick={() => void revokeSession(item.id)}
                >
                  Sign out
                </Button>
              )}
            </li>
          ))}
          {sessions.length === 0 && (
            <li className="py-4 text-sm text-muted-foreground">
              No active sessions were returned.
            </li>
          )}
        </ul>
      </section>
    </div>
  );
}
