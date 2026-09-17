import { Link } from "@tanstack/react-router";
import type { Product } from "@/lib/catalog";
import { formatPrice } from "@/lib/catalog";
export function ProductCard({ product }: { product: Product }) {
  return <Link to="/product/$slug" params={{ slug: product.slug }} className="group block min-w-0">
    <figure className="relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary"><img src={product.image} alt={product.name} width={1024} height={1024} loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"/><span className="absolute left-3 top-3 rounded-full bg-background/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] backdrop-blur">{product.condition}</span></figure>
    <div className="mt-3 flex items-start justify-between gap-3"><div className="min-w-0"><h3 className="font-display text-xl leading-tight group-hover:text-accent">{product.name}</h3><p className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{product.category} · {product.year}</p></div><p className="shrink-0 font-display text-lg font-semibold">{formatPrice(product.price)}</p></div>
  </Link>;
}
