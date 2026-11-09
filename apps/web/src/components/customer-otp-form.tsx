import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth';

export function CustomerOtpForm() {
  const navigate = useNavigate();
  const [intent, setIntent] = useState<'sign-in' | 'create-account'>('sign-in');
  const isRegistration = intent === 'create-account';
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function sendOtp() {
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const result = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: 'sign-in',
        fetchOptions: isRegistration
          ? { headers: { 'x-customer-account-consent': 'true' } }
          : undefined,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      setStep('otp');
      setMessage(
        isRegistration
          ? 'If the address can receive a code, it should arrive shortly.'
          : 'If an account exists for this address, a sign-in code should arrive shortly. New customers can choose “Create an account” first.',
      );
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "We couldn't send a sign-in code. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function requestOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendOtp();
  }

  async function verifyOtp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setMessage('');

    try {
      const result = await authClient.signIn.emailOtp({
        email,
        otp,
        ...(isRegistration ? { name } : {}),
        fetchOptions: isRegistration
          ? { headers: { 'x-customer-account-consent': 'true' } }
          : undefined,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }

      await navigate({ to: '/account', replace: true });
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'That code could not be verified. Please try again.',
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mt-8">
      {step === 'email' ? (
        <>
          <div
            className="mb-6 grid grid-cols-2 rounded-full border border-border bg-secondary/40 p-1"
            aria-label="Choose account option"
          >
            <button
              type="button"
              aria-pressed={!isRegistration}
              className={`rounded-full px-3 py-2 text-sm transition-colors ${!isRegistration ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              onClick={() => {
                setIntent('sign-in');
                setConsent(false);
                setError('');
                setMessage('');
              }}
            >
              Sign in
            </button>
            <button
              type="button"
              aria-pressed={isRegistration}
              className={`rounded-full px-3 py-2 text-sm transition-colors ${isRegistration ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}
              onClick={() => {
                setIntent('create-account');
                setError('');
                setMessage('');
              }}
            >
              Create account
            </button>
          </div>
          <form className="space-y-5" onSubmit={requestOtp}>
            {isRegistration && (
              <label className="block text-sm">
                Full name
                <input
                  required
                  name="name"
                  autoComplete="name"
                  className="field mt-2"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
            )}
            <label className="block text-sm">
              Email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="field mt-2"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  setConsent(false);
                }}
              />
            </label>
            {isRegistration && (
              <label className="flex items-start gap-2 text-sm text-muted-foreground">
                <input
                  required
                  type="checkbox"
                  checked={consent}
                  onChange={(event) => setConsent(event.target.checked)}
                  className="mt-1 accent-[var(--color-accent)]"
                />
                <span>
                  I choose to create an optional Thrift Nairobi customer
                  account. I understand I can check out as a guest instead.
                </span>
              </label>
            )}
            {error && (
              <p role="alert" className="text-sm text-accent">
                {error}
              </p>
            )}
            <Button className="w-full" type="submit" disabled={busy}>
              {busy
                ? 'Sending code…'
                : isRegistration
                  ? 'Continue with email'
                  : 'Email me a sign-in code'}
            </Button>
          </form>
        </>
      ) : (
        <form className="space-y-5" onSubmit={verifyOtp}>
          <p className="text-sm text-muted-foreground">
            Enter the six-digit code sent to <strong>{email}</strong>.
          </p>
          <label className="block text-sm">
            One-time code
            <input
              required
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6}"
              maxLength={6}
              className="field mt-2 font-mono text-lg tracking-[0.3em]"
              value={otp}
              onChange={(event) =>
                setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))
              }
            />
          </label>
          {error && (
            <p role="alert" className="text-sm text-accent">
              {error}
            </p>
          )}
          {message && (
            <p role="status" className="text-sm text-muted-foreground">
              {message}
            </p>
          )}
          <Button className="w-full" type="submit" disabled={busy}>
            {busy
              ? 'Verifying…'
              : isRegistration
                ? 'Verify and create account'
                : 'Verify and sign in'}
          </Button>
          <div className="flex justify-between gap-4 text-sm">
            <button
              type="button"
              className="underline underline-offset-4"
              onClick={() => {
                setStep('email');
                setOtp('');
                setError('');
                setMessage('');
              }}
            >
              Change email
            </button>
            <button
              type="button"
              disabled={busy}
              className="underline underline-offset-4 disabled:opacity-50"
              onClick={() => void sendOtp()}
            >
              Send a new code
            </button>
          </div>
        </form>
      )}

      <p className="mt-2 text-center text-sm text-muted-foreground">
        You can checkout as a guest.{' '}
        <Link
          to="/checkout"
          className="text-foreground underline underline-offset-4"
        >
          Continue to checkout
        </Link>
      </p>
    </div>
  );
}
