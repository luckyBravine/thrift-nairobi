import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useState, type ReactNode } from "react";
import { useCart } from "@/components/cart-context";

function SiteLinks({ onNavigate }: { onNavigate?: () => void }) {
  const className = onNavigate ? "block border-b border-border py-3 font-display text-2xl" : "nav-link text-[13px] font-medium";
  return <><Link to="/shop" onClick={onNavigate} className={className}>Shop</Link><Link to="/shop" search={{ sort: "newest" }} onClick={onNavigate} className={className}>New In</Link><Link to="/about" onClick={onNavigate} className={className}>About</Link><Link to="/about" hash="journal" onClick={onNavigate} className={className}>Journal</Link><Link to="/contact" onClick={onNavigate} className={className}>Contact</Link></>;
}
function HangerMark() { return <svg viewBox="0 0 42 30" className="h-7 w-10" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true"><path d="M18 7.5a3.5 3.5 0 1 1 4.8 3.2c-1.2.5-1.8 1.3-1.8 2.4v1.3"/><path d="m21 14.4-16 10c-1.5 1-1 2.6.8 2.6h30.4c1.8 0 2.3-1.7.8-2.6Z"/></svg>; }
export function SiteShell({ children }: { children: ReactNode }) {
  const { count } = useCart(); const [open, setOpen] = useState(false);
  return <div className="min-h-screen bg-background text-foreground">
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-[1320px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 sm:flex sm:px-6">
        <Link to="/" className="flex min-w-0 items-center gap-2.5"><span className="shrink-0"><HangerMark /></span><span className="truncate font-display text-lg font-semibold tracking-[0.14em] sm:text-xl">THIFT NAIROBI</span></Link>
        <nav className="ml-auto hidden items-center gap-7 md:flex"><SiteLinks /></nav>
        <div className="flex shrink-0 items-center gap-1 sm:ml-auto">
          <Link to="/cart" aria-label={`Cart with ${count} items`} className="relative inline-flex h-10 items-center gap-2 rounded-full px-2 hover:bg-secondary sm:px-3"><ShoppingBag className="size-5"/><span className="hidden text-sm sm:inline">Cart ({count})</span>{count > 0 && <span className="absolute right-0 top-0 grid size-4 place-items-center rounded-full bg-accent font-mono text-[9px] text-accent-foreground sm:hidden">{count}</span>}</Link>
          <button aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen(!open)} className="grid size-10 place-items-center rounded-full hover:bg-secondary md:hidden">{open ? <X className="size-5"/> : <Menu className="size-5"/>}</button>
        </div>
      </div>
      {open && <nav className="border-t border-border bg-background px-5 py-5 md:hidden"><SiteLinks onNavigate={() => setOpen(false)} /></nav>}
    </header>
    <main>{children}</main>
    <footer className="mt-20 border-t border-border"><div className="mx-auto flex max-w-[1320px] flex-col gap-7 px-6 py-10 md:flex-row md:items-center md:justify-between"><div><p className="font-display text-xl tracking-[0.12em]">THIFT NAIROBI</p><p className="mt-1 text-sm text-muted-foreground">Curated secondhand style, thoughtfully rehomed.</p></div><nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm"><Link to="/shop">Shop</Link><Link to="/about">About</Link><Link to="/contact">Contact</Link><a href="https://wa.me/?text=Hello%20Thift%20Nairobi" target="_blank" rel="noreferrer">WhatsApp</a></nav><p className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Nairobi, Kenya</p></div></footer>
  </div>;
}
