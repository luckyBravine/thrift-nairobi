import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { r as RoleGate, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { d as slugify, r as PRODUCTS_KEY, u as seedProducts } from "./admin-data-BRPKL9MM.mjs";
import { n as emptyProduct, t as ProductForm } from "./product-form-DzU8yTug.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.new-ItgnPNym.js
var import_jsx_runtime = require_jsx_runtime();
function NewProduct() {
	const navigate = useNavigate();
	const [items, setItems] = useStored(PRODUCTS_KEY, seedProducts);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Add product",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RoleGate, {
			min: "admin",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl sm:text-5xl",
					children: "Add product"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Publish a new piece to the shop."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
					initial: emptyProduct,
					onSave: (draft, status) => {
						const id = draft.slug || slugify(draft.name) || `piece-${Date.now()}`;
						setItems([{
							...draft,
							id,
							slug: id,
							status,
							updated: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10)
						}, ...items]);
						navigate({ to: "/admin/products" });
					}
				})
			]
		})
	});
}
//#endregion
export { NewProduct as component };
