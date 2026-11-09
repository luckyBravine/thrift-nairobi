import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-card-CBxuebAx.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/product/$slug",
		params: { slug: product.slug },
		className: "group block min-w-0",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
			className: "relative aspect-[4/5] overflow-hidden rounded-lg bg-secondary",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: product.image,
				alt: product.name,
				width: 1024,
				height: 1024,
				loading: "lazy",
				className: "h-full w-full object-cover transition duration-500 group-hover:scale-[1.035]"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-3 top-3 rounded-full bg-background/85 px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] backdrop-blur",
				children: product.condition
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-3 flex items-start justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-display text-xl leading-tight group-hover:text-accent",
					children: product.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-muted-foreground",
					children: [
						product.category,
						" · ",
						product.year
					]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "shrink-0 font-display text-lg font-semibold",
				children: formatPrice(product.price)
			})]
		})]
	});
}
//#endregion
export { ProductCard as t };
