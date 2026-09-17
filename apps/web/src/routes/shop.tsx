import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SlidersHorizontal, X } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { products } from "@/lib/catalog";

type Search = { sort?: string; category?: string; size?: string; condition?: string; max?: number };
export const Route = createFileRoute("/shop")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(typeof s["sort"] === "string" ? { sort: s["sort"] } : {}),
    ...(typeof s["category"] === "string" ? { category: s["category"] } : {}),
    ...(typeof s["size"] === "string" ? { size: s["size"] } : {}),
    ...(typeof s["condition"] === "string" ? { condition: s["condition"] } : {}),
    ...(typeof s["max"] === "number" ? { max: s["max"] } : {}),
  }),
  head: () => ({ meta: [{ title: "Shop Vintage Fashion — Thift Nairobi" }, { name: "description", content: "Browse curated secondhand clothing and accessories in Nairobi." }, { property: "og:title", content: "Shop — Thift Nairobi" }, { property: "og:description", content: "One-of-one vintage and secondhand pieces, curated in Nairobi." }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] }), component: Shop,
});
function Shop() {
  const search = Route.useSearch(); const navigate = useNavigate({ from: "/shop" }); const [sheet, setSheet] = useState(false);
  const update = (key: keyof Search, value: string | number) => navigate({ search: (prev) => {
    const next = { ...prev };
    if (value === "") delete next[key]; else Object.assign(next, { [key]: value });
    return next;
  } });
  const list = useMemo(() => products.filter((p) => (!search.category || p.category === search.category) && (!search.size || p.sizes.includes(search.size)) && (!search.condition || p.condition === search.condition) && p.price <= (search.max ?? 5000)).sort((a,b) => search.sort === "price" ? a.price-b.price : search.sort === "name" ? a.name.localeCompare(b.name) : 0), [search]);
  const Filters = () => <div className="space-y-7"><Filter label="Category" values={["Jackets","Dresses","Tops","Shoes","Accessories"]} selected={search.category ?? ""} onChange={(v) => update("category", v)}/><Filter label="Size" values={["S","M","L","38","39","One Size"]} selected={search.size ?? ""} onChange={(v) => update("size", v)}/><Filter label="Condition" values={["Good","Very Good"]} selected={search.condition ?? ""} onChange={(v) => update("condition", v)}/><div><div className="flex justify-between"><p className="font-display text-xl">Maximum price</p><span className="font-mono text-xs">KSh {search.max ?? 5000}</span></div><input aria-label="Maximum price" type="range" min="900" max="5000" step="100" value={search.max ?? 5000} onChange={(e) => update("max", Number(e.target.value))} className="mt-4 w-full accent-[var(--color-accent)]"/></div><button onClick={() => navigate({ search: search.sort ? { sort: search.sort } : {} })} className="text-sm underline underline-offset-4">Clear filters</button></div>;
  return <div className="mx-auto max-w-[1320px] px-6 py-12"><div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5"><div className="min-w-0"><p className="font-mono text-[10px] uppercase tracking-[.18em] text-accent">The current edit</p><h1 className="mt-2 font-display text-5xl sm:text-6xl">Shop all pieces</h1></div><button onClick={() => setSheet(true)} className="flex h-11 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-sm lg:hidden"><SlidersHorizontal className="size-4"/> Filters</button></div><div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]"><aside className="hidden border-r border-border pr-7 lg:block"><Filters/></aside><div><div className="mb-7 flex items-center justify-between"><span className="font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground">{list.length} pieces</span><label className="text-sm">Sort <select value={search.sort} onChange={(e) => update("sort",e.target.value)} className="ml-2 rounded-full border border-border bg-background px-3 py-2"><option value="newest">Newest</option><option value="price">Price</option><option value="name">Name</option></select></label></div>{list.length ? <div className="grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3 xl:gap-6">{list.map((p) => <ProductCard key={p.slug} product={p}/>)}</div> : <div className="grid min-h-80 place-items-center border-y border-border text-center"><div><h2 className="font-display text-3xl">No pieces match.</h2><p className="mt-2 text-sm text-muted-foreground">Try changing or clearing your filters.</p></div></div>}</div></div>{sheet && <div className="fixed inset-0 z-[60] bg-foreground/25 lg:hidden" onClick={() => setSheet(false)}><aside className="absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto bg-background p-6" onClick={(e) => e.stopPropagation()}><div className="mb-8 flex items-center justify-between"><h2 className="font-display text-3xl">Filters</h2><button aria-label="Close filters" onClick={() => setSheet(false)} className="grid size-10 place-items-center"><X/></button></div><Filters/></aside></div>}</div>;
}
function Filter({ label, values, selected, onChange }: { label:string; values:string[]; selected:string; onChange:(value:string)=>void }) { return <fieldset><legend className="mb-3 font-display text-xl">{label}</legend><div className="space-y-2">{values.map((v) => <label key={v} className="flex items-center gap-2 text-sm"><input type="checkbox" checked={selected===v} onChange={() => onChange(selected===v ? "" : v)} className="accent-[var(--color-accent)]"/>{v}</label>)}</div></fieldset>; }
