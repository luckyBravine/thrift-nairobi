import { createFileRoute } from '@tanstack/react-router';
import { CustomerOtpForm } from '@/components/customer-otp-form';

export const Route = createFileRoute('/login')({
  head: () => ({
    meta: [
      { title: 'Customer Account — Thrift Nairobi' },
      {
        name: 'description',
        content:
          'Sign in or optionally create a Thift Nairobi customer account with email OTP.',
      },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Login,
});

function Login() {
  return (
    <div className="mx-auto max-w-md px-6 py-20">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">
        Customer account
      </p>
      <h1 className="mt-3 font-display text-5xl">Your account, your choice.</h1>
      <p className="mt-3 text-sm text-muted-foreground">
        Sign in with email, or choose to create an account. Checkout is always
        available without one.
      </p>
      <CustomerOtpForm />
    </div>
  );
}
