import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminShell, RoleGate } from "@/components/admin/admin-shell";
import { ProductForm } from "@/components/admin/product-form";
import { useStored } from "@/lib/admin-auth";
import { PRODUCTS_KEY, seedProducts, type AdminProduct } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/products/$id/")({ ssr: false, component: EditProduct });

function EditProduct() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const [items, setItems] = useStored<AdminProduct[]>(PRODUCTS_KEY, seedProducts);
  const item = items.find((p) => p.id === id);

  return (
    <AdminShell title="Edit product">
      <RoleGate min="admin">
        {!item ? (
          <div className="py-16 text-center"><h1 className="font-display text-3xl">Piece not found.</h1><Link to="/admin/products" className="mt-4 inline-block underline underline-offset-4">Back to products</Link></div>
        ) : (
          <>
            <h1 className="font-display text-4xl sm:text-5xl">{item.name}</h1>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Updated {item.updated}</p>
            <ProductForm
              initial={item}
              onSave={(draft, status) => {
                setItems(items.map((p) => (p.id === id ? { ...draft, id, status, updated: new Date().toISOString().slice(0, 10) } : p)));
                void navigate({ to: "/admin/products" });
              }}
              onArchive={() => {
                setItems(items.map((p) => (p.id === id ? { ...p, status: "archived" } : p)));
                void navigate({ to: "/admin/products" });
              }}
            />
          </>
        )}
      </RoleGate>
    </AdminShell>
  );
}
