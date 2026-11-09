import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { i as StatusBadge, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { r as PRODUCTS_KEY, u as seedProducts } from "./admin-data-BRPKL9MM.mjs";
import { t as ProductForm } from "./product-form-DzU8yTug.mjs";
import { t as Route } from "./admin.products._id.view-Di_yPgEW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products._id.view-BhZfbuIo.js
var import_jsx_runtime = require_jsx_runtime();
function ViewProduct() {
	const { id } = Route.useParams();
	const [items] = useStored(PRODUCTS_KEY, seedProducts);
	const item = items.find((p) => p.id === id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Product",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/products",
				className: "font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4",
				children: "Back to products"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl sm:text-5xl",
					children: item.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Read-only view."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductForm, {
				initial: item,
				readOnly: true
			})
		] })
	});
}
//#endregion
export { ViewProduct as component };
