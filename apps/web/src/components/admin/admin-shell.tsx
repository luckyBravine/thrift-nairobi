import { Link, useRouterState } from '@tanstack/react-router';
import {
  LayoutDashboard,
  ChevronDown,
  Check,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Package,
  Receipt,
  Settings,
  ShieldCheck,
  Users,
  X,
} from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { atLeast, useStaff, type Role } from '@/lib/admin-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export function HangerMark({ className = 'h-6 w-9' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 42 30"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      aria-hidden="true"
    >
      <path d="M18 7.5a3.5 3.5 0 1 1 4.8 3.2c-1.2.5-1.8 1.3-1.8 2.4v1.3" />
      <path d="m21 14.4-16 10c-1.5 1-1 2.6.8 2.6h30.4c1.8 0 2.3-1.7.8-2.6Z" />
    </svg>
  );
}

const NAV = [
  {
    to: '/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    min: 'support' as Role,
    exact: true,
  },
  {
    to: '/admin/orders',
    label: 'Orders',
    icon: Receipt,
    min: 'support' as Role,
  },
  {
    to: '/admin/products',
    label: 'Products',
    icon: Package,
    min: 'support' as Role,
  },
  {
    to: '/admin/messages',
    label: 'Messages',
    icon: MessageSquare,
    min: 'support' as Role,
    badge: true,
  },
  { to: '/admin/staff', label: 'Staff', icon: Users, min: 'admin' as Role },
  {
    to: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    min: 'admin' as Role,
  },
];

export function AdminShell({
  title,
  unread = 0,
  children,
}: {
  title: string;
  unread?: number;
  children: ReactNode;
}) {
  const { session, signOut } = useStaff();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const [signOutError, setSignOutError] = useState('');
  const initials = session.name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2);
  const roleLabel = session.role === 'superadmin' ? 'Superadmin' : session.role;

  async function handleSignOut() {
    setSignOutError('');
    try {
      await signOut();
    } catch (error) {
      setSignOutError(
        error instanceof Error ? error.message : "We couldn't sign you out.",
      );
    }
  }

  const Nav = () => (
    <nav className="space-y-0.5">
      {NAV.filter((item) => atLeast(session.role, item.min)).map((item) => {
        const active = item.exact
          ? pathname === item.to
          : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={() => setOpen(false)}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${active ? 'font-semibold text-primary' : 'text-primary/65 hover:text-primary'}`}
          >
            <span
              className={`size-1.5 shrink-0 rounded-full ${active ? 'bg-primary' : 'bg-transparent'}`}
            />
            <Icon className="size-4 opacity-70" />
            <span className="truncate">{item.label}</span>
            {item.badge && unread > 0 && (
              <span className="ml-auto rounded-full bg-accent px-1.5 font-mono text-[10px] text-accent-foreground">
                {unread}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );

  const SidebarBody = (
    <div className="flex h-full flex-col justify-between p-5">
      <div>
        <div className="flex items-center gap-2 text-primary">
          <HangerMark />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold tracking-[0.14em]">
              THIFT NAIROBI
            </p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
              Staff
            </p>
          </div>
        </div>
        <div className="mt-8">
          <Nav />
        </div>
      </div>
      <div className="border-t border-border pt-4">
        <DialogTrigger asChild>
          <button
            type="button"
            aria-label={`Open profile for ${session.name}`}
            className="group flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-background/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <Avatar className="size-10 border border-border">
              <AvatarImage src={session.image ?? undefined} alt="" />
              <AvatarFallback className="bg-primary text-xs font-medium text-primary-foreground">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-primary">
                {session.name}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {session.email}
              </span>
            </span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary" />
          </button>
        </DialogTrigger>
        <span className="badge badge-role mt-1.5">{roleLabel}</span>
        {signOutError && (
          <p role="alert" className="mt-2 text-xs text-accent">
            {signOutError}
          </p>
        )}
        <button
          onClick={() => void handleSignOut()}
          className="mt-3 block text-sm text-muted-foreground underline underline-offset-4 hover:text-primary"
        >
          Sign out
        </button>
      </div>
    </div>
  );

  return (
    <Dialog>
      <div className="min-h-screen bg-background lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="admin-sidebar hidden border-r border-border lg:block">
          {SidebarBody}
        </aside>
        {open && (
          <div
            className="fixed inset-0 z-[70] bg-foreground/30 lg:hidden"
            onClick={() => setOpen(false)}
          >
            <aside
              className="admin-sidebar absolute inset-y-0 left-0 w-[240px]"
              onClick={(e) => e.stopPropagation()}
            >
              {SidebarBody}
            </aside>
          </div>
        )}
        <div className="min-w-0">
          <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
            <button
              aria-label="Open staff menu"
              onClick={() => setOpen(true)}
              className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-secondary lg:hidden"
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
            <p className="min-w-0 truncate font-display text-xl">{title}</p>
            <input
              aria-label="Search"
              placeholder="Search…"
              className="field ml-auto hidden max-w-56 rounded-full md:block"
            />
            <DialogTrigger asChild>
              <button
                type="button"
                aria-label={`Open profile for ${session.name}`}
                className="ml-auto rounded-full ring-offset-background transition-shadow hover:ring-2 hover:ring-ring hover:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 md:ml-0"
              >
                <Avatar className="size-9 border border-border">
                  <AvatarImage src={session.image ?? undefined} alt="" />
                  <AvatarFallback className="bg-secondary font-mono text-[11px]">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DialogTrigger>
          </header>
          <main className="px-4 py-8 sm:px-6">{children}</main>
        </div>
      </div>
      <DialogContent className="max-w-md gap-0 overflow-hidden p-0">
        <div className="h-24 bg-secondary" />
        <DialogHeader className="relative px-6 pb-5 pt-0 text-left">
          <Avatar className="-mt-10 size-20 border-4 border-background shadow-sm">
            <AvatarImage src={session.image ?? undefined} alt="" />
            <AvatarFallback className="bg-primary text-xl font-medium text-primary-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <DialogTitle className="font-display text-2xl font-normal">
              {session.name}
            </DialogTitle>
            <span className="badge badge-role">{roleLabel}</span>
          </div>
          <DialogDescription>
            Your staff account and access information.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 pb-4">
          <DialogClose asChild>
            <Link
              to="/admin/profile"
              className="inline-flex min-h-10 items-center rounded-full border border-border px-4 text-sm font-medium transition-colors hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
            >
              Manage profile & security
            </Link>
          </DialogClose>
        </div>
        <div className="space-y-3 border-t border-border px-6 py-5">
          <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3.5">
            <Mail className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Work email</p>
              <p className="mt-1 break-all text-sm font-medium">
                {session.email}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-lg bg-secondary/50 p-3.5">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0 flex-1">
              <p className="text-xs text-muted-foreground">Account security</p>
              <p className="mt-1 text-sm font-medium">
                Two-factor authentication
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-primary">
              <Check className="size-3.5" />
              Enabled
            </span>
          </div>
        </div>
        <div className="flex justify-end border-t border-border px-6 py-4">
          {signOutError && (
            <p role="alert" className="mr-auto self-center text-xs text-accent">
              {signOutError}
            </p>
          )}
          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
          >
            <LogOut className="size-4" />
            Sign out
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function RoleGate({
  min,
  children,
}: {
  min: Role;
  children: ReactNode;
}) {
  const { session } = useStaff();
  if (atLeast(session.role, min)) return <>{children}</>;
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">
        403
      </p>
      <h2 className="mt-3 font-display text-4xl">You don't have permission.</h2>
      <p className="mt-3 text-sm text-muted-foreground">
        This area is limited to{' '}
        {min === 'admin' ? 'admins and the owner' : 'the owner'}. Ask an admin
        if you need access.
      </p>
      <Link
        to="/admin"
        className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
      >
        Back to dashboard
      </Link>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const paid = ['paid', 'delivered', 'active', 'shipped'].includes(status);
  return (
    <span className={`badge ${paid ? 'badge-paid' : 'badge-pending'}`}>
      {status}
    </span>
  );
}
