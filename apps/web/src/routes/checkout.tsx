import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { CreditCard, Lock, MessageCircle, Smartphone } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/cart-context";
import { defaultSettings } from "@/lib/admin-data";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [
    { title: "Secure Checkout — Thift Nairobi" },
    { name: "description", content: "Complete your Thift Nairobi order with Pesalink, M-Pesa or WhatsApp." },
    { property: "og:title", content: "Secure Checkout — Thift Nairobi" },
    { property: "og:description", content: "Pay securely and we deliver across Nairobi." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Checkout,
});

type Method = "pesalink" | "mpesa" | "whatsapp";

const METHODS: { id: Method; label: string; caption: string; icon: typeof CreditCard; disabled?: boolean }[] = [
  { id: "pesalink", label: "Pesalink — bank or card", caption: "Secure bank transfer, handled by our payment partner.", icon: CreditCard },
  { id: "mpesa", label: "M-Pesa", caption: "Coming soon — pay by STK push.", icon: Smartphone, disabled: true },
  { id: "whatsapp", label: "Finish on WhatsApp", caption: "Confirm sizing and delivery with our team first.", icon: MessageCircle },
];

function Checkout() {
  const { lines, clear } = useCart();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<Method>("pesalink");

  const subtotal = lines.reduce((sum, line) => sum + line.product.price, 0);
  const shipping = subtotal >= defaultSettings.freeOver || subtotal === 0 ? 0 : defaultSettings.delivery;
  const total = subtotal + shipping;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = new FormData(event.currentTarget);
    const id = `TN-${Date.now().toString().slice(-6)}`;
    const summary = lines.map((l) => `${l.product.name} (${l.size})`).join(", ");

    sessionStorage.setItem(`thift_order_${id}`, JSON.stringify({
      id, lines, subtotal, shipping, total, method,
      customer: { name: form.get("name"), email: form.get("email"), phone: form.get("phone"), area: form.get("area"), notes: form.get("notes") },
    }));

    // TODO: POST this payload to the Express API, then redirect to the Pesalink
    // hosted payment page returned by the backend.
    if (method === "whatsapp") {
      window.open(`https://wa.me/${defaultSettings.whatsapp}?text=${encodeURIComponent(`Hello Thift Nairobi, my order ${id}: ${summary}. Total ${formatPrice(total)}.`)}`, "_blank", "noopener,noreferrer");
    }
    clear();
    void navigate({ to: "/order/$publicId", params: { publicId: id } });
  }

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">Guest checkout — no account needed</p>
      <h1 className="mt-2 font-display text-5xl sm:text-6xl">Checkout</h1>
      <p className="mt-3 max-w-xl text-sm text-muted-foreground">Every piece is one-of-one, so your items stay reserved while you pay. Prefer an account? <Link to="/register" className="text-foreground underline underline-offset-4">Create one</Link>.</p>

      <form onSubmit={submit} className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <h2 className="font-display text-2xl">Delivery details</h2>
          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="text-sm">Full name<input required name="name" autoComplete="name" className="field mt-2" /></label>
            <label className="text-sm">Email<input required type="email" name="email" autoComplete="email" className="field mt-2" /></label>
            <label className="text-sm">Kenya phone<input required type="tel" name="phone" placeholder="07XX XXX XXX" pattern="(?:\+254|0)[17][0-9]{8}" className="field mt-2" /></label>
            <label className="text-sm">Area / town<input required name="area" placeholder="e.g. Kilimani, Nairobi" className="field mt-2" /></label>
            <label className="text-sm sm:col-span-2">Delivery notes<textarea name="notes" rows={3} className="field mt-2 resize-none" /></label>
          </div>

          <h2 className="mt-10 font-display text-2xl">Payment</h2>
          <div className="mt-5 space-y-3">
            {METHODS.map((option) => {
              const Icon = option.icon;
              const active = method === option.id;
              return (
                <label key={option.id} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${option.disabled ? "cursor-not-allowed border-border opacity-55" : active ? "border-accent bg-secondary/40" : "border-border hover:bg-secondary/25"}`}>
                  <input type="radio" name="method" disabled={option.disabled} checked={active} onChange={() => setMethod(option.id)} className="mt-1 accent-[var(--color-accent)]" />
                  <Icon className="mt-0.5 size-4 shrink-0" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium">{option.label}</span>
                    <span className="block text-xs text-muted-foreground">{option.caption}</span>
                  </span>
                </label>
              );
            })}
          </div>

          {method === "pesalink" && (
            <div className="mt-5 rounded-xl border border-border bg-card p-5">
              <p className="font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground">Pesalink</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm sm:col-span-2">Name on account<input name="payerName" autoComplete="cc-name" className="field mt-2" /></label>
                <label className="text-sm sm:col-span-2">Bank<select name="bank" className="field mt-2">{["Equity Bank", "KCB", "Co-operative Bank", "NCBA", "Absa Kenya", "Other"].map((b) => <option key={b}>{b}</option>)}</select></label>
                <label className="text-sm sm:col-span-2">Account or Pesalink number<input name="payerAccount" inputMode="numeric" placeholder="0700 000 000" className="field mt-2 font-mono text-xs" /></label>
              </div>
              <p className="mt-4 flex items-center gap-2 text-xs text-muted-foreground"><Lock className="size-3.5" /> You'll confirm the transfer on your bank's secure page. We never store your bank details.</p>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-display text-2xl">Order summary</h2>
          <div className="mt-5 space-y-3">
            {lines.map((line) => (
              <div key={line.product.slug} className="flex items-center gap-3">
                <img src={line.product.image} alt="" className="size-14 rounded-md object-cover" />
                <div className="min-w-0 flex-1"><p className="truncate text-sm">{line.product.name}</p><p className="font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground">{line.size} · {line.product.condition}</p></div>
                <span className="shrink-0 text-sm">{formatPrice(line.product.price)}</span>
              </div>
            ))}
            {!lines.length && <p className="text-sm text-muted-foreground">Your bag is empty. <Link to="/shop" className="underline underline-offset-4">Find a piece</Link>.</p>}
          </div>
          <dl className="mt-5 space-y-1.5 border-t border-border pt-5 text-sm">
            <div className="flex justify-between"><dt className="text-muted-foreground">Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between"><dt className="text-muted-foreground">Nairobi delivery</dt><dd>{shipping ? formatPrice(shipping) : "Free"}</dd></div>
            <div className="flex justify-between pt-2 font-semibold"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
          </dl>
          <Button disabled={busy || !lines.length} className="mt-6 w-full" type="submit">{busy ? "Processing…" : method === "whatsapp" ? "Place order on WhatsApp" : `Pay ${formatPrice(total)}`}</Button>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"><Lock className="size-3.5" /> Free delivery on orders over {formatPrice(defaultSettings.freeOver)}.</p>
        </aside>
      </form>
    </div>
  );
}
