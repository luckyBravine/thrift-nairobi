import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell } from "@/components/admin/admin-shell";
import { useStored } from "@/lib/admin-auth";
import { MESSAGES_KEY, seedMessages, type AdminMessage } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/messages")({ ssr: false, component: Messages });

function Messages() {
  const [messages, setMessages] = useStored<AdminMessage[]>(MESSAGES_KEY, seedMessages);
  const [openId, setOpenId] = useState<string | null>(null);
  const unread = messages.filter((m) => !m.read).length;
  const open = messages.find((m) => m.id === openId);

  const read = (id: string) => {
    setOpenId(id);
    setMessages(messages.map((m) => (m.id === id ? { ...m, read: true } : m)));
  };

  return (
    <AdminShell title="Messages" unread={unread}>
      <h1 className="font-display text-4xl sm:text-5xl">Messages</h1>
      <p className="mt-2 text-sm text-muted-foreground">Contact-form enquiries. Reply by email or WhatsApp.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="divide-y divide-border rounded-xl border border-border">
          {messages.map((m) => (
            <button key={m.id} onClick={() => read(m.id)} className={`flex w-full items-start gap-3 p-4 text-left hover:bg-secondary/30 ${openId === m.id ? "bg-secondary/40" : ""}`}>
              <span className={`mt-2 size-2 shrink-0 rounded-full ${m.read ? "bg-transparent" : "bg-accent"}`} />
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-baseline gap-2"><span className={`text-sm ${m.read ? "" : "font-semibold"}`}>{m.name}</span><span className="truncate text-xs text-muted-foreground">{m.email}</span></span>
                <span className="mt-1 block truncate text-sm text-muted-foreground">{m.body}</span>
              </span>
              <span className="shrink-0 font-mono text-[10px] text-muted-foreground">{m.date}</span>
            </button>
          ))}
        </div>

        <aside className="admin-card h-fit">
          {open ? (
            <>
              <h2 className="font-display text-2xl">{open.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{open.email} · {open.date}</p>
              <p className="mt-4 text-sm leading-relaxed">{open.body}</p>
              <a href={`mailto:${open.email}`} className="wa-link mt-5 inline-block">Reply by email</a>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Select a message to read it.</p>
          )}
        </aside>
      </div>
    </AdminShell>
  );
}
