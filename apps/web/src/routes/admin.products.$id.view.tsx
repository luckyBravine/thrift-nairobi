import { Link, createFileRoute } from "@tanstack/react-router";
import { AdminShell, StatusBadge } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { useStored } from "@/lib/admin-auth";
import { PRODUCTS_KEY, seedProducts, type AdminProduct } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/products/$id/view")({ ssr: false, component: ViewProduct });

function ViewProduct() {
  const { id } = Route.useParams();
  const [items] = useStored<AdminProduct[]>(PRODUCTS_KEY, seedProducts);
  const item = items.find((p) => p.id === id);

  return (
    <AdminShell title="Product">
      {!item ? (
        <div className="py-16 text-center"><h1 className="font-display text-3xl">Piece not found.</h1><Link to="/admin/products" className="mt-4 inline-block underline underline-offset-4">Back to products</Link></div>
      ) : (
        <>
          <Link to="/admin/products" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4">Back to products</Link>
          <div className="mt-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl sm:text-5xl">{item.name}</h1>
            <StatusBadge status={item.status} />
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Read-only view.</p>
          <ProductForm initial={item} readOnly />
        </>
      )}
    </AdminShell>
  );
}
