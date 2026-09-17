import { Link, createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/admin-shell";
import { useStored } from "@/lib/admin-auth";
import { MESSAGES_KEY, ORDERS_KEY, orderTotal, seedMessages, seedOrders, waLink, type AdminMessage, type AdminOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/orders/")({ ssr: false, component: OrdersList });

function OrdersList() {
  const [orders] = useStored<AdminOrder[]>(ORDERS_KEY, seedOrders);
  const [messages] = useStored<AdminMessage[]>(MESSAGES_KEY, seedMessages);
  const [status, setStatus] = useState("");
  const [method, setMethod] = useState("");
  const [range, setRange] = useState("");
  const [query, setQuery] = useState("");

  const list = useMemo(() => {
    const now = new Date("2026-09-14");
    return [...orders]
      .filter((o) => (!status || o.status === status) && (!method || o.method === method))
      .filter((o) => {
        if (!range) return true;
        const days = (now.getTime() - new Date(o.created).getTime()) / 86400000;
        return range === "today" ? days < 1 : days <= 7;
      })
      .filter((o) => {
        const q = query.trim().toLowerCase();
        return !q || o.customer.toLowerCase().includes(q) || o.phone.includes(q) || o.publicId.toLowerCase().includes(q);
      })
      .sort((a, b) => b.created.localeCompare(a.created) || b.publicId.localeCompare(a.publicId));
  }, [orders, status, method, range, query]);

  return (
    <AdminShell title="Orders" unread={messages.filter((m) => !m.read).length}>
      <h1 className="font-display text-4xl sm:text-5xl">Orders</h1>
      <div className="mt-6 flex flex-wrap gap-3">
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="field max-w-44 rounded-full">
          <option value="">All statuses</option>{["pending", "paid", "processing", "shipped", "delivered", "cancelled"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select aria-label="Method" value={method} onChange={(e) => setMethod(e.target.value)} className="field max-w-44 rounded-full">
          <option value="">All methods</option><option value="WhatsApp">WhatsApp</option><option value="M-Pesa">M-Pesa</option>
        </select>
        <select aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value)} className="field max-w-40 rounded-full">
          <option value="">Any date</option><option value="today">Today</option><option value="7">Last 7 days</option>
        </select>
        <input aria-label="Search orders" placeholder="Search name, phone or TN-…" value={query} onChange={(e) => setQuery(e.target.value)} className="field max-w-64 rounded-full" />
      </div>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[880px] text-sm">
          <thead className="bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Items</th><th className="p-3">Total</th><th className="p-3">Method</th><th className="p-3">Status</th><th className="p-3">Created</th><th className="p-3">WhatsApp</th></tr>
          </thead>
          <tbody>
            {list.map((order) => (
              <tr key={order.publicId} className="border-t border-border hover:bg-secondary/30">
                <td className="p-3 font-mono text-xs"><Link to="/admin/orders/$id" params={{ id: order.publicId }} className="underline underline-offset-4">{order.publicId}</Link></td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3">{order.lines.reduce((s, l) => s + l.qty, 0)}</td>
                <td className="p-3">{formatPrice(orderTotal(order))}</td>
                <td className="p-3 text-muted-foreground">{order.method}</td>
                <td className="p-3"><StatusBadge status={order.status} /></td>
                <td className="p-3 font-mono text-xs text-muted-foreground">{order.created}</td>
                <td className="p-3"><a className="wa-link" target="_blank" rel="noreferrer" href={waLink(order.phone, `Hi ${order.customer}, re order ${order.publicId}…`)}>Chat on WhatsApp</a></td>
              </tr>
            ))}
          </tbody>
        </table>
        {!list.length && <p className="p-8 text-center text-sm text-muted-foreground">No orders match these filters.</p>}
      </div>
    </AdminShell>
  );
}
