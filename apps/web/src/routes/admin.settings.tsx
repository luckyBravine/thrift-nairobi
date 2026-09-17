import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, RoleGate } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { useStored } from "@/lib/admin-auth";
import { SETTINGS_KEY, defaultSettings, type StoreSettings } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/settings")({ ssr: false, component: SettingsPage });

function SettingsPage() {
  return <AdminShell title="Settings"><RoleGate min="admin"><SettingsForm /></RoleGate></AdminShell>;
}

function SettingsForm() {
  const [settings, setSettings] = useStored<StoreSettings>(SETTINGS_KEY, defaultSettings);
  const [draft, setDraft] = useState<StoreSettings | null>(null);
  const [toast, setToast] = useState("");
  const value = draft ?? settings;
  const set = <K extends keyof StoreSettings>(key: K, v: StoreSettings[K]) => setDraft({ ...value, [key]: v });

  return (
    <>
      <h1 className="font-display text-4xl sm:text-5xl">Settings</h1>
      <p className="mt-2 text-sm text-muted-foreground">Store configuration. No API keys live on this page.</p>
      {toast && <p className="mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm">{toast}</p>}

      <div className="mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">Store name<input value={value.storeName} onChange={(e) => set("storeName", e.target.value)} className="field mt-2" /></label>
        <label className="text-sm sm:col-span-2">WhatsApp number<input value={value.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} placeholder="2547XXXXXXXX" className="field mt-2 font-mono text-xs" /></label>
        <label className="text-sm">Nairobi delivery (KES)<input type="number" min="0" value={value.delivery} onChange={(e) => set("delivery", Number(e.target.value))} className="field mt-2" /></label>
        <label className="text-sm">Free shipping over (KES)<input type="number" min="0" value={value.freeOver} onChange={(e) => set("freeOver", Number(e.target.value))} className="field mt-2" /></label>
        <div className="sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-muted-foreground"><input type="checkbox" disabled checked={false} readOnly /> M-Pesa enabled</label>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Next sprint</p>
        </div>
        <div className="sm:col-span-2">
          <Button onClick={() => { setSettings(value); setDraft(null); setToast("Settings saved."); }}>Save settings</Button>
        </div>
      </div>
    </>
  );
}
