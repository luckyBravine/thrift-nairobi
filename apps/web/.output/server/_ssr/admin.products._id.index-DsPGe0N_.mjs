import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { r as RoleGate, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { r as PRODUCTS_KEY, u as seedProducts } from "./admin-data-BRPKL9MM.mjs";
import { t as Route } from "./admin.products._id.index-BQpz23eK.mjs";
import { t as ProductForm } from "./product-form-DzU8yTug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products._id.index-DsPGe0N_.js
var import_jsx_runtime = require_jsx_runtime();
function EditProduct() {
	const { id } = Route.useParams();
	const navigate = useNavigate();
	const [items, setItems] = useStored(PRODUCTS_KEY, seedProducts);
	const item = items.find((p) => p.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Edit product",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RoleGate, {
			min: "admin",
			children: !item ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "py-16 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl",
					children: "Piece not found."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/admin/products",
					className: "mt-4 inline-block underline underline-offset-4",
					children: "Back to products"
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl sm:text-5xl",
					children: item.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
					children: ["Updated ", item.updated]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
					initial: item,
					onSave: (draft, status) => {
						setItems(items.map((p) => p.id === id ? {
							...draft,
							id,
							status,
							updated: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
						} : p));
						navigate({ to: "/admin/products" });
					},
					onArchive: () => {
						setItems(items.map((p) => p.id === id ? {
							...p,
							status: "archived"
						} : p));
						navigate({ to: "/admin/products" });
					}
				})
			] })
		})
	});
}
//#endregion
export { EditProduct as component };
