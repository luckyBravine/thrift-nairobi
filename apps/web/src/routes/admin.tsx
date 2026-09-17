import { Outlet, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { StaffProvider, clearSession, readSession, type StaffSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Staff App — Thift Nairobi" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const navigate = useNavigate();
  const [session, setSession] = useState<StaffSession | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const current = readSession();
    setSession(current);
    setChecked(true);
    if (!current) void navigate({ to: "/admin/login", replace: true });
  }, [navigate]);

  const signOut = useCallback(() => {
    clearSession();
    setSession(null);
    void navigate({ to: "/admin/login", replace: true });
  }, [navigate]);

  if (!checked || !session) {
    return <div className="grid min-h-screen place-items-center text-sm text-muted-foreground">Checking staff access…</div>;
  }
  return (
    <StaffProvider session={session} onChange={setSession} onSignOut={signOut}>
      <Outlet />
    </StaffProvider>
  );
}
