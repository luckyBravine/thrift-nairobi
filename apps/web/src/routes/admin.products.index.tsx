import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AdminShell, StatusBadge } from "@/components/admin/admin-shell";
import { Button } from "@/components/ui/button";
import { atLeast, useStaff, useStored } from "@/lib/admin-auth";
import { PRODUCTS_KEY, seedProducts, type AdminProduct } from "@/lib/admin-data";
import { formatPrice } from "@/lib/catalog";

export const Route = createFileRoute("/admin/products/")({ ssr: false, component: ProductsList });

function ProductsList() {
  const { session } = useStaff();
  const navigate = useNavigate();
  const canEdit = atLeast(session.role, "admin");
  const [items] = useStored<AdminProduct[]>(PRODUCTS_KEY, seedProducts);
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [query, setQuery] = useState("");

  const list = useMemo(() => items.filter((p) =>
    (!status || p.status === status) && (!category || p.category === category) &&
    (!query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase()))
  ), [items, status, category, query]);

  const open = (item: AdminProduct) =>
    canEdit ? navigate({ to: "/admin/products/$id", params: { id: item.id } })
            : navigate({ to: "/admin/products/$id/view", params: { id: item.id } });

  return (
    <AdminShell title="Products">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-display text-4xl sm:text-5xl">Products</h1>
        {canEdit && <Button onClick={() => void navigate({ to: "/admin/products/new" })}>Add product</Button>}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <select aria-label="Status" value={status} onChange={(e) => setStatus(e.target.value)} className="field max-w-40 rounded-full">
          <option value="">All</option>{["draft", "active", "sold", "archived"].map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select aria-label="Category" value={category} onChange={(e) => setCategory(e.target.value)} className="field max-w-44 rounded-full">
          <option value="">All categories</option>{["Jackets", "Dresses", "Tops", "Shoes", "Accessories"].map((c) => <option key={c}>{c}</option>)}
        </select>
        <input aria-label="Search products" placeholder="Search pieces…" value={query} onChange={(e) => setQuery(e.target.value)} className="field max-w-64 rounded-full" />
      </div>

      {!list.length ? (
        <div className="mt-8 grid min-h-60 place-items-center rounded-xl border border-border text-center">
          <div><h2 className="font-display text-2xl">No products. Add your first piece.</h2></div>
        </div>
      ) : (
        <>
          <div className="mt-6 hidden overflow-x-auto rounded-xl border border-border md:block">
            <table className="w-full min-w-[860px] text-sm">
              <thead className="bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                <tr><th className="p-3">Piece</th><th className="p-3">Condition</th><th className="p-3">Size</th><th className="p-3">Price</th><th className="p-3">Stock</th><th className="p-3">Status</th><th className="p-3">Updated</th></tr>
              </thead>
              <tbody>
                {list.map((item) => (
                  <tr key={item.id} onClick={() => void open(item)} className="cursor-pointer border-t border-border hover:bg-secondary/30">
                    <td className="flex items-center gap-3 p-3"><img src={item.image} alt="" className="size-12 rounded-md object-cover" />{item.name}</td>
                    <td className="p-3 font-mono text-xs">{item.condition}</td>
                    <td className="p-3">{item.size}</td>
                    <td className="p-3">{formatPrice(item.price)}</td>
                    <td className="p-3">{item.stock}</td>
                    <td className="p-3"><StatusBadge status={item.status} /></td>
                    <td className="p-3 font-mono text-xs text-muted-foreground">{item.updated}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6 grid gap-3 md:hidden">
            {list.map((item) => (
              <Link key={item.id} to={canEdit ? "/admin/products/$id" : "/admin/products/$id/view"} params={{ id: item.id }} className="admin-card flex items-center gap-3">
                <img src={item.image} alt="" className="size-16 rounded-md object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm">{item.name}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{item.condition} · {item.size} · {formatPrice(item.price)}</p>
                  <div className="mt-1.5"><StatusBadge status={item.status} /></div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </AdminShell>
  );
}
