import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState, type FormEvent } from 'react';
import { z } from 'zod';
import { HangerMark } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { API_BASE_URL, authClient } from '@/lib/auth';

type LoginStep = 'credentials' | 'challenge' | 'setup';

export const Route = createFileRoute('/admin_/login')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Staff Sign In — Thrift Nairobi' },
      { name: 'robots', content: 'noindex' },
      { name: 'referrer', content: 'no-referrer' },
    ],
  }),
  component: StaffLogin,
});

function StaffLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState<LoginStep>('credentials');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [totpUri, setTotpUri] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [backupCodesSaved, setBackupCodesSaved] = useState(false);
  const [useBackupCode, setUseBackupCode] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    void authClient
      .getSession()
      .then(async (result) => {
        if (!active) return;
        const role =
          result.data?.user &&
          'role' in result.data.user &&
          typeof result.data.user.role === 'string'
            ? result.data.user.role
            : undefined;
        const roles =
          typeof role === 'string'
            ? role.split(',').map((entry) => entry.trim())
            : [];
        if (
          roles.some((entry) =>
            ['superadmin', 'admin', 'support'].includes(entry),
          )
        ) {
          await navigate({ to: '/admin', replace: true });
        } else if (role) {
          await navigate({ to: '/account', replace: true });
        }
      })
      .catch(() => {
        if (active) {
          setError(
            'We could not verify an existing session. You can still try signing in.',
          );
        }
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, [navigate]);

  async function completeSignIn() {
    const response = await fetch(`${API_BASE_URL}/api/staff-auth/state`, {
      credentials: 'include',
    });
    if (response.status === 401 || response.status === 403) {
      await authClient.signOut();
      throw new Error('Staff access could not be verified.');
    }
    if (!response.ok) {
      throw new Error('The server could not verify staff access.');
    }

    const result = z
      .object({ twoFactorEnabled: z.boolean() })
      .safeParse(await response.json());
    if (!result.success) {
      throw new Error(
        'The server returned an invalid staff authentication state.',
      );
    }

    if (!result.data.twoFactorEnabled) {
      const setup = await authClient.twoFactor.enable({
        password,
        method: 'totp',
        issuer: 'Thrift Nairobi',
      });
      if (setup.error || setup.data?.method !== 'totp') {
        throw new Error(
          setup.error?.message ?? 'We could not start authenticator setup.',
        );
      }

      setTotpUri(setup.data.totpURI);
      setBackupCodes(setup.data.backupCodes);
      setStep('setup');
      setCode('');
      return;
    }

    await navigate({ to: '/admin', replace: true });
  }

  async function submitCredentials(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const result = await authClient.signIn.email({ email, password });
      if (result.error) {
        throw new Error(
          'Invalid sign-in details, or this account is not staff.',
        );
      }

      if (
        result.data &&
        'twoFactorRedirect' in result.data &&
        result.data.twoFactorRedirect === true
      ) {
        setStep('challenge');
        return;
      }

      await completeSignIn();
    } catch (loginError) {
      setError(
        loginError instanceof Error
          ? loginError.message
          : 'We could not sign you in. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function submitCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      if (step === 'setup' && !backupCodesSaved) {
        throw new Error('Save your one-time recovery codes before continuing.');
      }

      const result =
        step === 'setup' || !useBackupCode
          ? await authClient.twoFactor.verifyTotp({ code })
          : await authClient.twoFactor.verifyBackupCode({ code });
      if (result.error) {
        throw new Error('That verification code was not accepted.');
      }

      if (step === 'setup') {
        await navigate({ to: '/admin', replace: true });
      } else {
        await completeSignIn();
      }
    } catch (verificationError) {
      setError(
        verificationError instanceof Error
          ? verificationError.message
          : 'We could not verify that code. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  const secret = totpUri
    ? new URLSearchParams(new URL(totpUri).search).get('secret')
    : null;

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-14">
      <div className="w-full max-w-[440px] rounded-xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 text-primary">
          <HangerMark />
        </div>
        <h1 className="mt-4 font-display text-3xl">THRIFT NAIROBI Staff</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Staff access only. Customer accounts cannot sign in here.
        </p>

        {checkingSession ? (
          <p className="mt-7 text-sm text-muted-foreground" aria-live="polite">
            Checking your account…
          </p>
        ) : step === 'credentials' ? (
          <form className="mt-7 space-y-4" onSubmit={submitCredentials}>
            <label className="block text-sm">
              Work email
              <input
                required
                type="email"
                name="email"
                autoComplete="username"
                className="field mt-2"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block text-sm">
              Password
              <input
                required
                type="password"
                name="password"
                autoComplete="current-password"
                className="field mt-2"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? 'Checking…' : 'Continue'}
            </Button>
            <div className="flex items-center justify-between gap-4 text-sm">
              <Link
                to="/admin/reset-password"
                className="text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Forgot password?
              </Link>
              <Link
                to="/"
                className="text-muted-foreground underline underline-offset-4 hover:text-primary"
              >
                Back to storefront
              </Link>
            </div>
          </form>
        ) : (
          <form className="mt-7 space-y-4" onSubmit={submitCode}>
            <h2 className="font-display text-2xl">
              {step === 'setup'
                ? 'Set up your authenticator'
                : 'Verify it is you'}
            </h2>
            {step === 'setup' ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Add this account to an authenticator app using the setup key.
                  This secret is shown only during setup.
                </p>
                <label className="block text-sm">
                  Authenticator setup key
                  <textarea
                    readOnly
                    rows={3}
                    className="field mt-2 select-all font-mono text-xs"
                    value={secret ?? totpUri}
                  />
                </label>
                <div className="rounded-lg border border-border bg-secondary/40 p-4">
                  <p className="text-sm font-medium">
                    Save these recovery codes
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Each code can be used once if you lose access to your
                    authenticator.
                  </p>
                  <ul className="mt-3 grid grid-cols-2 gap-2 font-mono text-xs">
                    {backupCodes.map((backupCode) => (
                      <li key={backupCode}>{backupCode}</li>
                    ))}
                  </ul>
                  <label className="mt-4 flex items-start gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={backupCodesSaved}
                      onChange={(event) =>
                        setBackupCodesSaved(event.target.checked)
                      }
                      className="mt-1 accent-[var(--color-accent)]"
                    />
                    <span>
                      I have saved these recovery codes somewhere safe.
                    </span>
                  </label>
                </div>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter the code from your authenticator app.
              </p>
            )}
            <label className="block text-sm">
              {step === 'setup'
                ? 'Authenticator code'
                : useBackupCode
                  ? 'Recovery code'
                  : 'Authenticator code'}
              <input
                required
                name="code"
                autoComplete="one-time-code"
                inputMode={useBackupCode ? 'text' : 'numeric'}
                className="field mt-2 font-mono tracking-[0.2em]"
                value={code}
                onChange={(event) => setCode(event.target.value.trim())}
              />
            </label>
            {error && (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            )}
            <Button type="submit" className="w-full" disabled={busy}>
              {busy
                ? 'Verifying…'
                : step === 'setup'
                  ? 'Verify and finish setup'
                  : 'Verify and sign in'}
            </Button>
            {step === 'challenge' && (
              <button
                type="button"
                className="w-full text-sm underline underline-offset-4"
                onClick={() => {
                  setUseBackupCode((current) => !current);
                  setCode('');
                  setError('');
                }}
              >
                {useBackupCode
                  ? 'Use an authenticator code'
                  : 'Use a recovery code'}
              </button>
            )}
          </form>
        )}
      </div>
    </div>
  );
}
