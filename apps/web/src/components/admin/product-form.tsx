import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { slugify, type AdminProduct, type ProductStatus } from "@/lib/admin-data";
import denim from "@/assets/product-denim.jpg";
import dress from "@/assets/product-dress.jpg";
import bag from "@/assets/product-bag.jpg";
import tee from "@/assets/product-tee.jpg";

export const IMAGE_PRESETS = [denim, dress, bag, tee];

export type ProductDraft = Omit<AdminProduct, "updated">;

export const emptyProduct: ProductDraft = {
  id: "", name: "", slug: "", category: "Jackets", description: "", condition: "Good",
  brand: "", era: "", material: "", colour: "", gender: "", price: 0, unique: true,
  size: "", stock: 1, status: "draft", image: denim,
};

export function ProductForm({ initial, readOnly = false, onSave, onArchive }: {
  initial: ProductDraft;
  readOnly?: boolean;
  onSave?: (draft: ProductDraft, status: ProductStatus) => void;
  onArchive?: () => void;
}) {
  const navigate = useNavigate();
  const [draft, setDraft] = useState<ProductDraft>(initial);
  const set = <K extends keyof ProductDraft>(key: K, value: ProductDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const field = "field mt-2";
  const disabled = readOnly;

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
      <div>
        <div className="grid aspect-[4/5] place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40">
          {draft.image ? <img src={draft.image} alt="" className="size-full object-cover" /> : <span className="text-sm text-muted-foreground">Drop a cover image</span>}
        </div>
        <label className="mt-4 block text-sm">Image URL
          <input disabled={disabled} value={draft.image} onChange={(e) => set("image", e.target.value)} className={field} />
        </label>
        <div className="mt-3 flex gap-2">
          {IMAGE_PRESETS.map((preset) => (
            <button key={preset} type="button" disabled={disabled} onClick={() => set("image", preset)} className={`size-12 overflow-hidden rounded-md border ${draft.image === preset ? "border-accent" : "border-border"}`}>
              <img src={preset} alt="" className="size-full object-cover" />
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">The first image is the cover.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm sm:col-span-2">Name*
          <input required disabled={disabled} value={draft.name} onChange={(e) => { set("name", e.target.value); if (!initial.id) set("slug", slugify(e.target.value)); }} className={`${field} font-display text-lg`} />
        </label>
        <label className="text-sm">Slug*<input required disabled={disabled} value={draft.slug} onChange={(e) => set("slug", slugify(e.target.value))} className={`${field} font-mono text-xs`} /></label>
        <label className="text-sm">Category*
          <select disabled={disabled} value={draft.category} onChange={(e) => set("category", e.target.value)} className={field}>
            {["Jackets", "Dresses", "Tops", "Shoes", "Accessories"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-sm sm:col-span-2">Description*<textarea required disabled={disabled} rows={4} value={draft.description} onChange={(e) => set("description", e.target.value)} className={`${field} resize-none`} /></label>
        <label className="text-sm">Condition*
          <select disabled={disabled} value={draft.condition} onChange={(e) => set("condition", e.target.value)} className={field}>
            {["Good", "Very Good", "Excellent"].map((c) => <option key={c}>{c}</option>)}
          </select>
        </label>
        <label className="text-sm">Brand<input disabled={disabled} value={draft.brand ?? ""} onChange={(e) => set("brand", e.target.value)} className={field} /></label>
        <label className="text-sm">Era<input disabled={disabled} value={draft.era ?? ""} onChange={(e) => set("era", e.target.value)} className={field} /></label>
        <label className="text-sm">Material<input disabled={disabled} value={draft.material ?? ""} onChange={(e) => set("material", e.target.value)} className={field} /></label>
        <label className="text-sm">Colour<input disabled={disabled} value={draft.colour ?? ""} onChange={(e) => set("colour", e.target.value)} className={field} /></label>
        <label className="text-sm">Gender<input disabled={disabled} value={draft.gender ?? ""} onChange={(e) => set("gender", e.target.value)} className={field} /></label>
        <label className="text-sm">Price (KES)*<input required disabled={disabled} type="number" min="0" step="1" value={draft.price} onChange={(e) => set("price", Number(e.target.value))} className={field} /></label>
        <label className="text-sm">Size*<input required disabled={disabled} value={draft.size} onChange={(e) => set("size", e.target.value)} placeholder="M / 39 / One Size" className={field} /></label>
        <label className="text-sm">Stock*<input required disabled={disabled || draft.unique} type="number" min="0" value={draft.unique ? 1 : draft.stock} onChange={(e) => set("stock", Number(e.target.value))} className={field} /></label>
        <label className="flex items-center gap-2 self-end text-sm">
          <input type="checkbox" disabled={disabled} checked={draft.unique} onChange={(e) => { set("unique", e.target.checked); if (e.target.checked) set("stock", 1); }} className="accent-[var(--color-accent)]" />
          One-of-one piece (locks stock to 1)
        </label>

        {!readOnly && (
          <div className="mt-4 flex flex-wrap gap-3 sm:col-span-2">
            <Button variant="outline" onClick={() => onSave?.(draft, "draft")}>Save draft</Button>
            <Button onClick={() => onSave?.(draft, "active")}>Publish</Button>
            <Button variant="ghost" onClick={() => void navigate({ to: "/admin/products" })}>Cancel</Button>
            {onArchive && <Button variant="ghost" className="text-accent" onClick={() => { if (window.confirm("Archive this piece? It will leave the shop.")) onArchive(); }}>Archive</Button>}
          </div>
        )}
      </div>
    </div>
  );
}
