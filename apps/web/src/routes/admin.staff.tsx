import { createFileRoute } from '@tanstack/react-router';
import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { AdminShell } from '@/components/admin/admin-shell';
import { Button } from '@/components/ui/button';
import { useStaff, type Role } from '@/lib/admin-auth';
import { API_BASE_URL } from '@/lib/auth';

type StaffMember = {
  id: string;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  banned: boolean;
  twoFactorEnabled: boolean;
};

type PendingInvite = {
  email: string;
  role: 'admin' | 'support';
  expiresAt: string;
};

type SecurityEvent = {
  id: string;
  action: string;
  actorId: string | null;
  subjectUserId: string | null;
  metadata: Record<string, string | number | boolean> | null;
  ipAddress: string | null;
  createdAt: string;
};

export const Route = createFileRoute('/admin/staff')({
  ssr: false,
  component: StaffPage,
});

async function adminRequest<T>(path: string, init?: RequestInit): Promise<T> {
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
        : 'The staff request could not be completed.';
    throw new Error(message);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}

function StaffPage() {
  const { session } = useStaff();
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [invites, setInvites] = useState<PendingInvite[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [mfaRecoveryTarget, setMfaRecoveryTarget] =
    useState<StaffMember | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  const loadStaff = useCallback(async () => {
    setError('');
    try {
      const [staffResult, inviteResult, eventResult] = await Promise.all([
        adminRequest<{ staff: StaffMember[] }>('/staff'),
        adminRequest<{ invites: PendingInvite[] }>('/invites'),
        session.role === 'superadmin'
          ? adminRequest<{ events: SecurityEvent[] }>('/security-events')
          : Promise.resolve({ events: [] }),
      ]);
      setStaff(staffResult.staff);
      setInvites(inviteResult.invites);
      setSecurityEvents(eventResult.events);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : 'We could not load staff accounts.',
      );
    } finally {
      setLoading(false);
    }
  }, [session.role]);

  useEffect(() => {
    void loadStaff();
  }, [loadStaff]);

  async function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError('');
    setNotice('');
    const form = new FormData(event.currentTarget);
    const formElement = event.currentTarget;

    try {
      await adminRequest('/invites', {
        method: 'POST',
        body: JSON.stringify({
          email: String(form.get('email') ?? ''),
          role: String(form.get('role') ?? ''),
        }),
      });
      setNotice(
        'Invitation sent. It expires after 24 hours and can be used once.',
      );
      setInviteOpen(false);
      formElement.reset();
      await loadStaff();
    } catch (inviteError) {
      setError(
        inviteError instanceof Error
          ? inviteError.message
          : 'We could not send the invitation.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateRole(member: StaffMember) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      const role = member.role === 'admin' ? 'support' : 'admin';
      await adminRequest(`/staff/${encodeURIComponent(member.id)}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role }),
      });
      setNotice(
        `${member.name}'s role was updated. Their active sessions were revoked.`,
      );
      await loadStaff();
    } catch (roleError) {
      setError(
        roleError instanceof Error
          ? roleError.message
          : 'We could not update that staff role.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(member: StaffMember) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await adminRequest(`/staff/${encodeURIComponent(member.id)}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ banned: !member.banned }),
      });
      setNotice(
        member.banned
          ? `${member.name}'s account was re-enabled.`
          : `${member.name}'s account was disabled and their sessions were revoked.`,
      );
      await loadStaff();
    } catch (statusError) {
      setError(
        statusError instanceof Error
          ? statusError.message
          : 'We could not update that staff account.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function recoverMfa(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!mfaRecoveryTarget) return;

    setBusy(true);
    setError('');
    setNotice('');
    const form = new FormData(event.currentTarget);
    try {
      await adminRequest(
        `/staff/${encodeURIComponent(mfaRecoveryTarget.id)}/recover-mfa`,
        {
          method: 'POST',
          body: JSON.stringify({
            confirmationEmail: String(form.get('confirmationEmail') ?? ''),
          }),
        },
      );
      setNotice(
        `${mfaRecoveryTarget.name}'s MFA was reset, all sessions were revoked, and recovery was recorded. They must enroll MFA again at next sign-in.`,
      );
      setMfaRecoveryTarget(null);
      await loadStaff();
    } catch (recoveryError) {
      setError(
        recoveryError instanceof Error
          ? recoveryError.message
          : 'We could not reset this staff member’s MFA.',
      );
    } finally {
      setBusy(false);
    }
  }

  async function revokeInvite(invite: PendingInvite) {
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await adminRequest(`/invites/${encodeURIComponent(invite.email)}`, {
        method: 'DELETE',
      });
      setNotice(`The invitation for ${invite.email} was revoked.`);
      await loadStaff();
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : 'We could not revoke that invitation.',
      );
    } finally {
      setBusy(false);
    }
  }

  const mayInvite = session.role === 'admin' || session.role === 'superadmin';

  return (
    <AdminShell title="Staff">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Staff</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Staff accounts require a unique password and authenticator MFA.
          </p>
        </div>
        {mayInvite && (
          <Button type="button" onClick={() => setInviteOpen(true)}>
            Invite worker
          </Button>
        )}
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-md border border-accent/40 px-3 py-2 text-sm text-accent"
        >
          {error}
        </p>
      )}
      {notice && (
        <p
          role="status"
          className="mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm"
        >
          {notice}
        </p>
      )}

      <section className="mt-6">
        <h2 className="font-display text-2xl">Staff accounts</h2>
        {loading ? (
          <p className="mt-4 text-sm text-muted-foreground">Loading staff…</p>
        ) : (
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr>
                  <th className="p-3">Name</th>
                  <th className="p-3">Email</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">MFA</th>
                  <th className="p-3">State</th>
                  <th className="p-3">Joined</th>
                  <th className="p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((member) => {
                  const canManage =
                    session.role === 'superadmin' ||
                    (session.role === 'admin' && member.role === 'support');
                  return (
                    <tr key={member.id} className="border-t border-border">
                      <td className="p-3">{member.name}</td>
                      <td className="p-3 text-muted-foreground">
                        {member.email}
                      </td>
                      <td className="p-3">
                        <span className="badge badge-role">{member.role}</span>
                      </td>
                      <td className="p-3">
                        {member.twoFactorEnabled ? 'Enabled' : 'Setup required'}
                      </td>
                      <td className="p-3">
                        <span
                          className={`badge ${member.banned ? 'badge-pending' : 'badge-paid'}`}
                        >
                          {member.banned ? 'Disabled' : 'Active'}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-xs text-muted-foreground">
                        {new Date(member.createdAt).toLocaleDateString()}
                      </td>
                      <td className="space-x-3 p-3">
                        {session.role === 'superadmin' &&
                          member.id !== session.id &&
                          member.role !== 'superadmin' && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void updateRole(member)}
                              className="underline underline-offset-4 disabled:opacity-50"
                            >
                              Make{' '}
                              {member.role === 'admin' ? 'support' : 'admin'}
                            </button>
                          )}
                        {canManage && member.id !== session.id && (
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => void updateStatus(member)}
                            className="underline underline-offset-4 disabled:opacity-50"
                          >
                            {member.banned ? 'Re-enable' : 'Disable'}
                          </button>
                        )}
                        {canManage &&
                          member.id !== session.id &&
                          member.role !== 'superadmin' &&
                          member.twoFactorEnabled && (
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => setMfaRecoveryTarget(member)}
                              className="underline underline-offset-4 text-accent disabled:opacity-50"
                            >
                              Recover MFA
                            </button>
                          )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {session.role === 'superadmin' && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Recent security activity</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Owner-only audit history for staff access changes and recovery actions.
          </p>
          <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
            {securityEvents.map((event) => (
              <li
                key={event.id}
                className="flex flex-wrap items-start justify-between gap-3 p-4 text-sm"
              >
                <div>
                  <p className="font-medium">{event.action.replaceAll('.', ' ')}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {event.actorId ? `Actor ${event.actorId}` : 'System or offline operation'}
                    {event.subjectUserId
                      ? ` · Account ${event.subjectUserId}`
                      : ''}
                    {event.metadata?.['role']
                      ? ` · Role ${event.metadata['role']}`
                      : ''}
                    {typeof event.metadata?.['count'] === 'number'
                      ? ` · ${event.metadata['count']} session(s)`
                      : ''}
                  </p>
                  {event.ipAddress && (
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                      IP {event.ipAddress}
                    </p>
                  )}
                </div>
                <time
                  className="text-xs text-muted-foreground"
                  dateTime={event.createdAt}
                >
                  {new Date(event.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
            {!securityEvents.length && (
              <li className="p-4 text-sm text-muted-foreground">
                No security events have been recorded yet.
              </li>
            )}
          </ul>
        </section>
      )}

      {mayInvite && (
        <section className="mt-10">
          <h2 className="font-display text-2xl">Pending invitations</h2>
          {invites.length ? (
            <ul className="mt-4 divide-y divide-border rounded-xl border border-border">
              {invites.map((invite) => (
                <li
                  key={invite.email}
                  className="flex flex-wrap items-center justify-between gap-3 p-4 text-sm"
                >
                  <span>{invite.email}</span>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">
                      {invite.role} · expires{' '}
                      {new Date(invite.expiresAt).toLocaleString()}
                    </span>
                    {(session.role === 'superadmin' ||
                      invite.role === 'support') && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void revokeInvite(invite)}
                        className="underline underline-offset-4 disabled:opacity-50"
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted-foreground">
              There are no pending invitations.
            </p>
          )}
        </section>
      )}

      {inviteOpen && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-foreground/30 p-5"
          onClick={() => setInviteOpen(false)}
        >
          <form
            onSubmit={submitInvite}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-sm rounded-xl border border-border bg-card p-6"
          >
            <h2 className="font-display text-2xl">Invite worker</h2>
            <label className="mt-4 block text-sm">
              Work email
              <input
                required
                type="email"
                name="email"
                autoComplete="email"
                className="field mt-2"
              />
            </label>
            <label className="mt-3 block text-sm">
              Role
              <select name="role" className="field mt-2">
                <option value="support">support</option>
                {session.role === 'superadmin' && (
                  <option value="admin">admin</option>
                )}
              </select>
            </label>
            <div className="mt-5 flex gap-3">
              <Button type="submit" disabled={busy}>
                {busy ? 'Sending…' : 'Send invitation'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setInviteOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
      {mfaRecoveryTarget && (
        <div
          className="fixed inset-0 z-[80] grid place-items-center bg-foreground/30 p-5"
          onClick={() => setMfaRecoveryTarget(null)}
        >
          <form
            onSubmit={recoverMfa}
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-xl"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
              Security recovery
            </p>
            <h2 className="mt-2 font-display text-2xl">Reset authenticator</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Use only after verifying the staff member’s identity out of band.
              This signs them out everywhere and requires fresh MFA enrollment.
              The action is recorded in the security audit log.
            </p>
            <label className="mt-4 block text-sm">
              Confirm their work email
              <input
                required
                type="email"
                name="confirmationEmail"
                autoComplete="off"
                className="field mt-2"
                placeholder={mfaRecoveryTarget.email}
              />
            </label>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button type="submit" variant="destructive" disabled={busy}>
                {busy ? 'Resetting…' : 'Reset MFA and revoke sessions'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                disabled={busy}
                onClick={() => setMfaRecoveryTarget(null)}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}
    </AdminShell>
  );
}
