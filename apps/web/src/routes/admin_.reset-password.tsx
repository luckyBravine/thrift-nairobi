import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth';

export const Route = createFileRoute('/admin_/reset-password')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Reset Staff Password — Thrift Nairobi' },
      { name: 'robots', content: 'noindex' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: ResetStaffPassword,
});

function ResetStaffPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') ?? '');
  }, []);

  async function requestReset(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const result = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/admin/reset-password`,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      setNotice(
        'If this address belongs to a staff account, a password-reset link will arrive shortly. Your authenticator will still be required.',
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'We could not request a reset. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    try {
      if (!token) throw new Error('This reset link is invalid or expired.');
      if (password !== confirmation) {
        throw new Error('The passwords do not match.');
      }
      const result = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      setNotice(
        'Password reset. Sign in with your new password and complete authenticator verification.',
      );
      setTimeout(
        () => void navigate({ to: '/admin/login', replace: true }),
        1500,
      );
    } catch (resetError) {
      setError(
        resetError instanceof Error
          ? resetError.message
          : 'We could not reset the password. Request a new link and try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-background px-5 py-14">
      <section className="w-full max-w-[440px] rounded-xl border border-border bg-card p-8">
        <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
          Thrift Nairobi staff
        </p>
        <h1 className="mt-3 font-display text-3xl">
          {token ? 'Choose a new password' : 'Reset your password'}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Password recovery does not reset or bypass your authenticator.
        </p>

        {token ? (
          <form className="mt-7 space-y-4" onSubmit={resetPassword}>
            <label className="block text-sm">
              New password
              <input
                required
                minLength={14}
                maxLength={128}
                type="password"
                autoComplete="new-password"
                className="field mt-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            <label className="block text-sm">
              Confirm new password
              <input
                required
                minLength={14}
                maxLength={128}
                type="password"
                autoComplete="new-password"
                className="field mt-2"
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
              />
            </label>
            <Button className="w-full" disabled={busy}>
              {busy ? 'Updating…' : 'Reset password'}
            </Button>
          </form>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={requestReset}>
            <label className="block text-sm">
              Staff email
              <input
                required
                type="email"
                autoComplete="email"
                className="field mt-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <Button className="w-full" disabled={busy}>
              {busy ? 'Sending…' : 'Send password-reset link'}
            </Button>
          </form>
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm text-accent">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 text-sm text-muted-foreground">
            {notice}
          </p>
        )}
        <Link
          to="/admin/login"
          className="mt-6 inline-block text-sm underline underline-offset-4"
        >
          Return to staff sign in
        </Link>
      </section>
    </main>
  );
}
