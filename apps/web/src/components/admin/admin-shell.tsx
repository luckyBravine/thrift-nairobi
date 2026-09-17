import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Menu, MessageSquare, Package, Receipt, Settings, Users, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { atLeast, useStaff, type Role } from "@/lib/admin-auth";

export function HangerMark({ className = "h-6 w-9" }: { className?: string }) {
  return <svg viewBox="0 0 42 30" className={className} fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M18 7.5a3.5 3.5 0 1 1 4.8 3.2c-1.2.5-1.8 1.3-1.8 2.4v1.3"/><path d="m21 14.4-16 10c-1.5 1-1 2.6.8 2.6h30.4c1.8 0 2.3-1.7.8-2.6Z"/></svg>;
}

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, min: "support" as Role, exact: true },
  { to: "/admin/orders", label: "Orders", icon: Receipt, min: "support" as Role },
  { to: "/admin/products", label: "Products", icon: Package, min: "support" as Role },
  { to: "/admin/messages", label: "Messages", icon: MessageSquare, min: "support" as Role, badge: true },
  { to: "/admin/staff", label: "Staff", icon: Users, min: "admin" as Role },
  { to: "/admin/settings", label: "Settings", icon: Settings, min: "admin" as Role },
];

export function AdminShell({ title, unread = 0, children }: { title: string; unread?: number; children: ReactNode }) {
  const { session, viewAs, signOut } = useStaff();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const initials = session.name.split(" ").map((p) => p[0]).join("").slice(0, 2);

  const Nav = () => (
    <nav className="space-y-0.5">
      {NAV.filter((item) => atLeast(session.role, item.min)).map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link key={item.to} to={item.to} onClick={() => setOpen(false)}
            className={`flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${active ? "font-semibold text-primary" : "text-primary/65 hover:text-primary"}`}>
            <span className={`size-1.5 shrink-0 rounded-full ${active ? "bg-primary" : "bg-transparent"}`} />
            <Icon className="size-4 opacity-70" />
            <span className="truncate">{item.label}</span>
            {item.badge && unread > 0 && <span className="ml-auto rounded-full bg-accent px-1.5 font-mono text-[10px] text-accent-foreground">{unread}</span>}
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
            <p className="truncate font-display text-sm font-semibold tracking-[0.14em]">THIFT NAIROBI</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">Staff</p>
          </div>
        </div>
        <div className="mt-8"><Nav /></div>
      </div>
      <div className="border-t border-border pt-4">
        <p className="truncate text-sm font-medium">{session.name}</p>
        <span className="badge badge-role mt-1.5">{session.role}</span>
        <button onClick={signOut} className="mt-3 block text-sm text-muted-foreground underline underline-offset-4 hover:text-primary">Sign out</button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside className="admin-sidebar hidden border-r border-border lg:block">{SidebarBody}</aside>
      {open && (
        <div className="fixed inset-0 z-[70] bg-foreground/30 lg:hidden" onClick={() => setOpen(false)}>
          <aside className="admin-sidebar absolute inset-y-0 left-0 w-[240px]" onClick={(e) => e.stopPropagation()}>{SidebarBody}</aside>
        </div>
      )}
      <div className="min-w-0">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-border bg-background/90 px-4 backdrop-blur sm:px-6">
          <button aria-label="Open staff menu" onClick={() => setOpen(true)} className="grid size-9 shrink-0 place-items-center rounded-full hover:bg-secondary lg:hidden">{open ? <X className="size-5"/> : <Menu className="size-5"/>}</button>
          <p className="min-w-0 truncate font-display text-xl">{title}</p>
          <input aria-label="Search" placeholder="Search…" className="field ml-auto hidden max-w-56 rounded-full md:block" />
          <label className="hidden items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground xl:flex">
            View as
            <select value={session.role} onChange={(e) => viewAs(e.target.value as Role)} className="rounded-full border border-border bg-background px-2 py-1 font-body text-xs tracking-normal">
              <option value="superadmin">superadmin</option><option value="admin">admin</option><option value="support">support</option>
            </select>
          </label>
          <span className="ml-auto grid size-9 shrink-0 place-items-center rounded-full bg-secondary font-mono text-[11px] md:ml-0">{initials}</span>
        </header>
        <main className="px-4 py-8 sm:px-6">{children}</main>
      </div>
    </div>
  );
}

export function RoleGate({ min, children }: { min: Role; children: ReactNode }) {
  const { session } = useStaff();
  if (atLeast(session.role, min)) return <>{children}</>;
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent">403</p>
      <h2 className="mt-3 font-display text-4xl">You don't have permission.</h2>
      <p className="mt-3 text-sm text-muted-foreground">This area is limited to {min === "admin" ? "admins and the owner" : "the owner"}. Ask an admin if you need access.</p>
      <Link to="/admin" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground">Back to dashboard</Link>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const paid = ["paid", "delivered", "active", "shipped"].includes(status);
  return <span className={`badge ${paid ? "badge-paid" : "badge-pending"}`}>{status}</span>;
}
