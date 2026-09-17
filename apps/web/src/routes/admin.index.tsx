import { Link, createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, Clock, Coins, ShoppingBag } from "lucide-react";
import { AdminShell, StatusBadge } from "@/components/admin/admin-shell";
import { useStaff, useStored } from "@/lib/admin-auth";
import { MESSAGES_KEY, ORDERS_KEY, orderTotal, seedMessages, seedOrders, waLink, type AdminMessage, type AdminOrder } from "@/lib/admin-data";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/")({ ssr: false, component: Dashboard });

const CARDS = [
  { label: "Total revenue", value: "KSh 286,540", icon: Coins, tone: "text-primary", to: "/admin/orders" as const },
  { label: "Orders today", value: "18", icon: ShoppingBag, tone: "text-foreground", to: "/admin/orders" as const },
  { label: "Pending orders", value: "7", icon: Clock, tone: "text-accent", to: "/admin/orders" as const },
  { label: "Low stock", value: "4", icon: AlertTriangle, tone: "text-accent", to: "/admin/products" as const },
];

function Dashboard() {
  const { session } = useStaff();
  const [orders] = useStored<AdminOrder[]>(ORDERS_KEY, seedOrders);
  const [messages] = useStored<AdminMessage[]>(MESSAGES_KEY, seedMessages);
  const unread = messages.filter((m) => !m.read).length;
  const firstName = session.name.split(" ")[0];

  return (
    <AdminShell title="Dashboard" unread={unread}>
      <h1 className="font-display text-4xl sm:text-5xl">Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">Welcome back, {firstName}. Here's the shop today.</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.label} to={card.to} className="admin-card relative block">
              <Icon className="absolute right-4 top-4 size-4 text-muted-foreground/60" />
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{card.label}</p>
              <p className={`mt-3 font-display text-3xl ${card.tone}`}>{card.value}</p>
            </Link>
          );
        })}
      </div>

      <h2 className="mt-12 font-display text-2xl">Recent orders</h2>
      <div className="mt-4 overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] text-sm">
          <thead className="bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
            <tr><th className="p-3">Order</th><th className="p-3">Customer</th><th className="p-3">Piece</th><th className="p-3">Total</th><th className="p-3">Status</th><th className="p-3">WhatsApp</th></tr>
          </thead>
          <tbody>
            {orders.slice(0, 5).map((order) => (
              <tr key={order.publicId} className="border-t border-border hover:bg-secondary/30">
                <td className="p-3 font-mono text-xs"><Link to="/admin/orders/$id" params={{ id: order.publicId }} className="underline underline-offset-4">{order.publicId}</Link></td>
                <td className="p-3">{order.customer}</td>
                <td className="p-3 text-muted-foreground">{order.lines[0]?.name}{order.lines.length > 1 ? ` +${order.lines.length - 1}` : ""}</td>
                <td className="p-3">{formatPrice(orderTotal(order))}</td>
                <td className="p-3"><StatusBadge status={order.status} /></td>
                <td className="p-3"><a className="wa-link" target="_blank" rel="noreferrer" href={waLink(order.phone, `Hi ${order.customer}, re order ${order.publicId}…`)}>Chat on WhatsApp</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
