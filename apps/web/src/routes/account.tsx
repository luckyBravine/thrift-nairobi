import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { API_BASE_URL, authClient } from '@/lib/auth';

const accountResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string().email(),
  }),
});

const ordersResponseSchema = z.object({
  orders: z.array(
    z.object({
      id: z.string(),
      publicId: z.string(),
      status: z.string(),
      totalKes: z.number(),
      createdAt: z.string(),
      items: z.array(
        z.object({
          title: z.string(),
          size: z.string(),
          quantity: z.number(),
          unitPriceKes: z.number(),
        }),
      ),
    }),
  ),
});

type CustomerOrder = z.infer<typeof ordersResponseSchema>['orders'][number];

export const Route = createFileRoute('/account')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'My Account — Thift Nairobi' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: Account,
});

function Account() {
  const navigate = useNavigate();
  const sessionCheckStarted = useRef(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(
    null,
  );
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const checkSession = useCallback(async () => {
    sessionCheckStarted.current = true;
    setCheckingSession(true);
    setError('');

    try {
      const accountResponse = await fetch(`${API_BASE_URL}/api/account/me`, {
        credentials: 'include',
      });
      if (accountResponse.status === 401) {
        await navigate({ to: '/login', replace: true });
        return;
      }
      if (!accountResponse.ok) {
        throw new Error(
          accountResponse.status === 403
            ? 'This area is for customer accounts. Staff should use staff sign in.'
            : 'We could not verify your customer account.',
        );
      }

      const account = accountResponseSchema.safeParse(
        await accountResponse.json(),
      );
      if (!account.success) {
        throw new Error('The server returned an invalid account response.');
      }
      setUser(account.data.user);

      const ordersResponse = await fetch(`${API_BASE_URL}/api/account/orders`, {
        credentials: 'include',
      });
      if (ordersResponse.status === 401) {
        await navigate({ to: '/login', replace: true });
        return;
      }
      if (!ordersResponse.ok) {
        throw new Error('We could not load your order history.');
      }

      const customerOrders = ordersResponseSchema.safeParse(
        await ordersResponse.json(),
      );
      if (!customerOrders.success) {
        throw new Error('The server returned an invalid order history.');
      }
      setOrders(customerOrders.data.orders);
    } catch {
      setError(
        "We couldn't load your account. Check your connection and try again.",
      );
    } finally {
      setCheckingSession(false);
    }
  }, [navigate]);

  useEffect(() => {
    if (!sessionCheckStarted.current) {
      void checkSession();
    }
  }, [checkSession]);

  async function signOut() {
    setBusy(true);
    setError('');

    try {
      const result = await authClient.signOut();
      if (result.error) {
        throw new Error(result.error.message);
      }

      await navigate({ to: '/login', replace: true });
    } catch (signOutError) {
      setError(
        signOutError instanceof Error
          ? signOutError.message
          : "We couldn't sign you out. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  if (checkingSession || !user) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-20" aria-live="polite">
        {error ? (
          <div className="space-y-4">
            <p role="alert" className="text-sm text-accent">
              {error}
            </p>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                sessionCheckStarted.current = false;
                void checkSession();
              }}
            >
              Try again
            </Button>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Loading your account…</p>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <div className="flex flex-wrap items-start justify-between gap-5">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">
            Your account
          </p>
          <h1 className="mt-3 font-display text-5xl">
            Hello, {user.name || 'there'}.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Signed in as {user.email}
          </p>
        </div>
        <Button
          variant="outline"
          type="button"
          disabled={busy}
          onClick={() => void signOut()}
        >
          {busy ? 'Signing out…' : 'Sign out'}
        </Button>
      </div>

      {error && (
        <p role="alert" className="mt-6 text-sm text-accent">
          {error}
        </p>
      )}

      <section className="mt-12 rounded-xl border border-border bg-card p-6">
        <h2 className="font-display text-2xl">Your orders</h2>
        {orders.length ? (
          <ul className="mt-5 divide-y divide-border">
            {orders.map((order) => (
              <li key={order.id} className="py-4 first:pt-0 last:pb-0">
                <div className="flex flex-wrap justify-between gap-2">
                  <p className="font-medium">{order.publicId}</p>
                  <p className="text-sm capitalize text-muted-foreground">
                    {order.status.replaceAll('_', ' ')}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {new Intl.DateTimeFormat(undefined, {
                    dateStyle: 'medium',
                  }).format(new Date(order.createdAt))}{' '}
                  · KES {order.totalKes.toLocaleString()}
                </p>
                <ul className="mt-2 text-sm text-muted-foreground">
                  {order.items.map((item, index) => (
                    <li key={`${order.id}-${index}`}>
                      {item.title} · {item.size} · Qty {item.quantity}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            No orders are linked to this account yet. Guest orders stay
            available through their confirmation link until linked to your
            account.
          </p>
        )}
        <Link
          to="/shop"
          className="mt-5 inline-block text-sm underline underline-offset-4"
        >
          Continue shopping
        </Link>
      </section>
    </div>
  );
}
