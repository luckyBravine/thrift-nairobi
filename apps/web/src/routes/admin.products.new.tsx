import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AdminShell, RoleGate } from "@/components/admin/admin-shell";
import { ProductForm, emptyProduct } from "@/components/admin/product-form";
import { useStored } from "@/lib/admin-auth";
import { PRODUCTS_KEY, seedProducts, slugify, type AdminProduct } from "@/lib/admin-data";

export const Route = createFileRoute("/admin/products/new")({ ssr: false, component: NewProduct });

function NewProduct() {
  const navigate = useNavigate();
  const [items, setItems] = useStored<AdminProduct[]>(PRODUCTS_KEY, seedProducts);

  return (
    <AdminShell title="Add product">
      <RoleGate min="admin">
        <h1 className="font-display text-4xl sm:text-5xl">Add product</h1>
        <p className="mt-2 text-sm text-muted-foreground">Publish a new piece to the shop.</p>
        <ProductForm
          initial={emptyProduct}
          onSave={(draft, status) => {
            const id = draft.slug || slugify(draft.name) || `piece-${Date.now()}`;
            setItems([{ ...draft, id, slug: id, status, updated: new Date().toISOString().slice(0, 10) }, ...items]);
            void navigate({ to: "/admin/products" });
          }}
        />
      </RoleGate>
    </AdminShell>
  );
}
