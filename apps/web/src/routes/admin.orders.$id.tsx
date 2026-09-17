import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { useStored } from "@/lib/admin-auth";
import { ORDERS_KEY, orderSubtotal, orderTotal, seedOrders, waLink, type AdminOrder, type OrderStatus } from "@/lib/admin-data";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/orders/$id")({ ssr: false, component: OrderShow });

const ACTIONS: { label: string; status: OrderStatus }[] = [
  { label: "Mark paid", status: "paid" }, { label: "Processing", status: "processing" },
  { label: "Shipped", status: "shipped" }, { label: "Delivered", status: "delivered" },
];

function OrderShow() {
  const { id } = Route.useParams();
  const [orders, setOrders] = useStored<AdminOrder[]>(ORDERS_KEY, seedOrders);
  const [toast, setToast] = useState("");
  const order = orders.find((o) => o.publicId === id);

  if (!order) {
    return <AdminShell title="Order"><div className="py-16 text-center"><h1 className="font-display text-3xl">Order not found.</h1><Link to="/admin/orders" className="mt-4 inline-block underline underline-offset-4">Back to orders</Link></div></AdminShell>;
  }

  const terminal = order.status === "delivered" || order.status === "cancelled";
  const update = (patch: Partial<AdminOrder>, message: string) => {
    setOrders(orders.map((o) => (o.publicId === id ? { ...o, ...patch } : o)));
    setToast(message);
  };

  return (
    <AdminShell title={order.publicId}>
      <Link to="/admin/orders" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4">Back to orders</Link>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <h1 className="font-display text-4xl">{order.publicId}</h1>
        <StatusBadge status={order.status} />
        <span className="font-mono text-xs text-muted-foreground">{order.created}</span>
      </div>
      {toast && <p className="mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm">{toast}</p>}

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="admin-card">
          <h2 className="font-display text-2xl">Customer</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Name</dt><dd>{order.customer}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Email</dt><dd className="truncate">{order.email}</dd></div>
            <div className="flex items-center justify-between gap-4"><dt className="text-muted-foreground">Phone</dt><dd className="flex items-center gap-2 font-mono text-xs">{order.phone}<button onClick={() => { void navigator.clipboard.writeText(order.phone); setToast("Phone copied."); }} className="underline underline-offset-4">Copy</button></dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Area</dt><dd>{order.area}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-muted-foreground">Method</dt><dd>{order.method}</dd></div>
          </dl>
          <label className="mt-5 block text-sm">Notes
            <textarea defaultValue={order.notes} rows={3} className="field mt-2 resize-none" onBlur={(e) => update({ notes: e.target.value }, "Notes saved.")} />
          </label>
        </section>

        <section className="admin-card">
          <h2 className="font-display text-2xl">Items</h2>
          <div className="mt-4 divide-y divide-border">
            {order.lines.map((l, i) => (
              <div key={`${l.name}-${i}`} className="flex items-center gap-3 py-3">
                <img src={l.image} alt="" className="size-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm">{l.name}</p><p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{l.size} · {l.condition} · x{l.qty}</p></div>
                <span className="text-sm">{formatPrice(l.unit)}</span>
              </div>
            ))}
          </div>
          <dl className="mt-4 space-y-1.5 border-t border-border pt-4 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(orderSubtotal(order))}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Shipping</dt><dd>{order.shipping ? formatPrice(order.shipping) : "Free"}</dd></div>
            <div className="flex justify-between font-semibold"><dt>Total</dt><dd>{formatPrice(orderTotal(order))}</dd></div>
          </dl>
        </section>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        {ACTIONS.map((action) => (
          <Button key={action.status} variant="outline" disabled={terminal} onClick={() => update({ status: action.status }, `Order marked ${action.status}.`)}>{action.label}</Button>
        ))}
        <Button variant="outline" disabled={terminal} onClick={() => { if (window.confirm("Cancel this order? This cannot be undone.")) update({ status: "cancelled" }, "Order cancelled."); }}>Cancel</Button>
        <a className="wa-link self-center" target="_blank" rel="noreferrer" href={waLink(order.phone, `Hi ${order.customer}, re order ${order.publicId}…`)}>Chat on WhatsApp</a>
      </div>
      {terminal && <p className="mt-3 text-xs text-muted-foreground">This order is {order.status} — no further status changes.</p>}
    </AdminShell>
  );
}
