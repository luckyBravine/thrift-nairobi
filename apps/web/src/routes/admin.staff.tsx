import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { AdminShell, RoleGate } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { useStaff, useStored, type Role } from "@/lib/admin-auth";
import { STAFF_KEY, seedStaff, type StaffMember } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/staff")({ ssr: false, component: StaffPage });

function StaffPage() {
  return <AdminShell title="Staff"><RoleGate min="admin"><StaffTable /></RoleGate></AdminShell>;
}

function StaffTable() {
  const { session } = useStaff();
  const [staff, setStaff] = useStored<StaffMember[]>(STAFF_KEY, seedStaff);
  const [invite, setInvite] = useState(false);
  const [toast, setToast] = useState("");

  const superadmins = staff.filter((s) => s.role === "superadmin" && s.active).length;

  function submitInvite(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setStaff([...staff, {
      id: `s${Date.now()}`, name: String(form.get("name")), email: String(form.get("email")),
      role: String(form.get("role")) as Role, active: true, joined: new Date().toISOString().slice(0, 10),
    }]);
    setInvite(false);
    setToast("Invite sent. Production: Better Auth createUser.");
  }

  const changeRole = (member: StaffMember) => {
    if (member.role === "superadmin" && superadmins <= 1) { setToast("You cannot demote the last owner."); return; }
    setStaff(staff.map((s) => (s.id === member.id ? { ...s, role: s.role === "admin" ? "support" : "admin" } : s)));
  };
  const toggleBan = (member: StaffMember) => {
    if (member.email === session.email) { setToast("You cannot ban yourself."); return; }
    setStaff(staff.map((s) => (s.id === member.id ? { ...s, active: !s.active } : s)));
  };

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl sm:text-5xl">Staff</h1>
          <p className="mt-2 text-sm text-muted-foreground">Workers sign in at /admin/login.</p>
        </div>
        <Button onClick={() => setInvite(true)}>Invite worker</Button>
      </div>
      {toast && <p className="mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm">{toast}</p>}

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">State</th><th className="p-3">Joined</th><th className="p-3">Actions</th></tr>
          </thead>
          <tbody>
            {staff.map((member) => (
              <tr key={member.id} className="border-t border-border">
                <td className="p-3">{member.name}</td>
                <td className="p-3 text-muted-foreground">{member.email}</td>
                <td className="p-3"><span className="badge badge-role">{member.role}</span></td>
                <td className="p-3"><span className={`badge ${member.active ? "badge-paid" : "badge-pending"}`}>{member.active ? "Active" : "Banned"}</span></td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{member.joined}</td>
                <td className="space-x-3 p-3">
                  {member.role !== "superadmin" && <button onClick={() => changeRole(member)} className="underline underline-offset-4">Make {member.role === "admin" ? "support" : "admin"}</button>}
                  <button onClick={() => toggleBan(member)} className="underline underline-offset-4">{member.active ? "Ban" : "Unban"}</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {invite && (
        <div className="fixed inset-0 z-[80] grid place-items-center bg-foreground/30 p-5" onClick={() => setInvite(false)}>
          <form onSubmit={submitInvite} onClick={(e) => e.stopPropagation()} className="w-full max-w-sm rounded-xl border border-border bg-card p-6">
            <h2 className="font-display text-2xl">Invite worker</h2>
            <label className="mt-4 block text-sm">Name<input required name="name" className="field mt-2" /></label>
            <label className="mt-3 block text-sm">Email<input required type="email" name="email" className="field mt-2" /></label>
            <label className="mt-3 block text-sm">Role<select name="role" className="field mt-2"><option value="support">support</option><option value="admin">admin</option></select></label>
            <div className="mt-5 flex gap-3"><Button type="submit">Send invite</Button><Button type="button" variant="ghost" onClick={() => setInvite(false)}>Cancel</Button></div>
          </form>
        </div>
      )}
    </>
  );
}
