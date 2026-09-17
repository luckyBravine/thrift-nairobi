import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { HangerMark } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { DEMO_PASSWORD, DEMO_STAFF, writeSession } from "@/lib/admin-auth";

export const Route = createFileRoute("/admin_/login")({
  ssr: false,
  head: () => ({ meta: [{ title: "Staff Sign In — Thift Nairobi" }, { name: "robots", content: "noindex" }] }),
  component: StaffLogin,
});

function StaffLogin() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    const match = DEMO_STAFF[email];
    if (!match || password !== DEMO_PASSWORD) {
      setError(match ? "That password is not right." : "Ask an admin to invite you.");
      return;
    }
    writeSession({ email, name: match.name, role: match.role });
    void navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="grid min-h-screen place-items-center bg-background px-5 py-14">
      <div className="w-full max-w-[400px] rounded-xl border border-border bg-card p-8">
        <div className="flex items-center gap-2 text-primary"><HangerMark /></div>
        <h1 className="mt-4 font-display text-3xl">THIFT NAIROBI Staff</h1>
        <p className="mt-2 text-sm text-muted-foreground">Staff access only. Customers should use the shop.</p>
        <form className="mt-7 space-y-4" onSubmit={submit}>
          <label className="block text-sm">Email<input required type="email" name="email" autoComplete="email" className="field mt-2" /></label>
          <label className="block text-sm">Password<input required type="password" name="password" autoComplete="current-password" className="field mt-2" /></label>
          {error && <p className="text-sm text-accent">{error}</p>}
          <Button type="submit" className="w-full">Sign in</Button>
        </form>
        <div className="mt-6 border-t border-border pt-4 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
          <p>Demo · password123</p>
          <p className="mt-1.5 normal-case tracking-normal">owner@thift.ke · manager@thift.ke · support@thift.ke</p>
        </div>
      </div>
    </div>
  );
}
