import { createFileRoute, Link } from '@tanstack/react-router';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { HangerMark } from '@/components/admin/admin-shell';
import { API_BASE_URL } from '@/lib/auth';

const inviteStatusSchema = z.enum([
  'valid',
  'invalid',
  'expired',
  'used',
  'missing',
]);
type InviteStatus = 'checking' | 'error' | z.infer<typeof inviteStatusSchema>;

export const Route = createFileRoute('/admin_/invite')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Accept Staff Invitation — Thrift Nairobi' },
      { name: 'robots', content: 'noindex, nofollow' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: AcceptStaffInvite,
});

function AcceptStaffInvite() {
  const initialized = useRef(false);
  const [token, setToken] = useState('');
  const [inviteStatus, setInviteStatus] = useState<InviteStatus>('checking');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const fragmentToken = new URLSearchParams(
      window.location.hash.slice(1),
    ).get('token');
    const queryToken = new URLSearchParams(window.location.search).get('token');
    const inviteToken = fragmentToken ?? queryToken ?? '';
    setToken(inviteToken);

    if (fragmentToken || queryToken) {
      window.history.replaceState(
        window.history.state,
        '',
        window.location.pathname,
      );
    }

    void fetch(`${API_BASE_URL}/api/staff-invitations/open`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(inviteToken ? { token: inviteToken } : {}),
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('We could not verify this invitation.');
        }
        const result = z
          .object({ status: inviteStatusSchema })
          .safeParse(await response.json());
        if (!result.success) {
          throw new Error('The server returned an invalid invitation status.');
        }
        setInviteStatus(result.data.status);
      })
      .catch(() => setInviteStatus('error'));
  }, []);

  async function accept(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    const form = new FormData(event.currentTarget);
    const name = String(form.get('name') ?? '');
    const password = String(form.get('password') ?? '');
    const confirmation = String(form.get('confirmation') ?? '');
    if (password !== confirmation) {
      setError('The passwords do not match.');
      setBusy(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/staff-invitations/accept`,
        {
          method: 'POST',
          credentials: 'include',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ token, name, password }),
        },
      );
      if (!response.ok) {
        throw new Error(
          'This invitation is invalid, expired, or could not be accepted.',
        );
      }
      setSuccess(true);
    } catch (acceptError) {
      setError(
        acceptError instanceof Error
          ? acceptError.message
          : 'We could not accept this invitation. Ask an administrator to send a new one.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-14">
      <div className="w-full max-w-[440px] rounded-xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 text-primary">
          <HangerMark />
        </div>
        <h1 className="mt-4 font-display text-3xl">Staff invitation</h1>
        {success ? (
          <div className="mt-5 space-y-4">
            <p role="status" className="text-sm text-muted-foreground">
              Your staff account is ready. Sign in with your work email and
              password, then complete authenticator setup before accessing the
              admin area.
            </p>
            <Button asChild className="w-full">
              <Link to="/admin/login">Continue to staff sign in</Link>
            </Button>
          </div>
        ) : inviteStatus === 'checking' ? (
          <p role="status" className="mt-5 text-sm text-muted-foreground">
            Checking your invitation…
          </p>
        ) : inviteStatus === 'valid' && token ? (
          <form className="mt-6 space-y-4" onSubmit={accept}>
            <p className="text-sm text-muted-foreground">
              Create your staff account. Your password must be at least 14
              characters.
            </p>
            <label className="block text-sm">
              Full name
              <input
                required
                name="name"
                autoComplete="name"
                minLength={2}
                maxLength={100}
                className="field mt-2"
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                required
                type="password"
                name="password"
                autoComplete="new-password"
                minLength={14}
                maxLength={128}
                className="field mt-2"
              />
            </label>
            <label className="block text-sm">
              Confirm password
              <input
                required
                type="password"
                name="confirmation"
                autoComplete="new-password"
                minLength={14}
                maxLength={128}
                className="field mt-2"
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Creating account…' : 'Accept invitation'}
            </Button>
          </form>
        ) : inviteStatus === 'error' ? (
          <p role="alert" className="mt-5 text-sm text-accent">
            We could not verify this invitation. Check your connection and
            refresh the page.
          </p>
        ) : (
          <p role="alert" className="mt-5 text-sm text-accent">
            {inviteStatus === 'missing'
              ? 'This link did not include an invitation token. Open the full link from the latest invitation email or ask an administrator to resend it.'
              : inviteStatus === 'expired'
                ? 'This invitation has expired. Ask an administrator to send a new invitation.'
                : inviteStatus === 'used'
                  ? 'This invitation has already been accepted. Continue to staff sign in.'
                  : 'This invitation link is invalid. Ask an administrator to send a new invitation.'}
          </p>
        )}
      </div>
    </div>
  );
}
