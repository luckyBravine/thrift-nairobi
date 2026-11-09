import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router';
import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  STAFF_ROLES,
  StaffProvider,
  type StaffSession,
} from '@/lib/admin-auth';
import { API_BASE_URL, authClient } from '@/lib/auth';

const staffUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(STAFF_ROLES),
  image: z.string().nullable().optional(),
});

export const Route = createFileRoute('/admin')({
  ssr: false,
  head: () => ({
    meta: [
      { title: 'Staff App — Thrift Nairobi' },
      { name: 'robots', content: 'noindex' },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState('');

  const checkSession = useCallback(async () => {
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/me`, {
        credentials: 'include',
      });
      if (response.status === 401) {
        setSession(null);
        setChecked(true);
        await navigate({ to: '/admin/login', replace: true });
        return;
      }
      if (response.status === 403) {
        const authResult = await authClient.getSession();
        const role =
          authResult.data?.user &&
          'role' in authResult.data.user &&
          typeof authResult.data.user.role === 'string'
            ? authResult.data.user.role
            : undefined;
        const roles =
          typeof role === 'string'
            ? role.split(',').map((entry) => entry.trim())
            : [];
        setSession(null);
        setChecked(true);
        if (roles.includes('customer')) {
          await navigate({ to: '/account', replace: true });
        } else {
          await navigate({ to: '/admin/login', replace: true });
        }
        return;
      }
      if (!response.ok) {
        throw new Error('The server could not verify staff access.');
      }

      const body: unknown = await response.json();
      const user =
        typeof body === 'object' && body !== null && 'user' in body
          ? staffUserSchema.safeParse(body.user)
          : null;
      if (!user || !user.success) {
        throw new Error('The server returned an invalid staff session.');
      }

      setSession(user.data);
      setChecked(true);
    } catch (sessionError) {
      setError(
        sessionError instanceof Error
          ? sessionError.message
          : 'We could not verify staff access.',
      );
      setChecked(true);
    }
  }, [navigate]);

  useEffect(() => {
    void checkSession();
  }, [checkSession]);

  const signOut = useCallback(async () => {
    const result = await authClient.signOut();
    if (result.error) {
      throw new Error(result.error.message);
    }
    setSession(null);
    await navigate({ to: '/admin/login', replace: true });
  }, [navigate]);

  if (!checked) {
    return (
      <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">
        Verifying staff access…
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto grid min-h-screen max-w-md place-content-center gap-4 px-6">
        <p role="alert" className="text-sm text-accent">
          {error}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={() => void checkSession()}
        >
          Try again
        </Button>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <StaffProvider session={session} onSignOut={signOut}>
      <Outlet />
    </StaffProvider>
  );
}
