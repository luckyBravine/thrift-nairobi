import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { D as Check, p as MessageCircle, s as ShoppingBag } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { n as useCart } from "./cart-context-DeumWN0k.mjs";
import { t as Route } from "./product._slug-BiHHcbBP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-CNVEA1Zg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductPage() {
	const product = Route.useLoaderData();
	const { add, lines } = useCart();
	const [size, setSize] = (0, import_react.useState)(product.sizes[0] ?? "");
	const [added, setAdded] = (0, import_react.useState)(false);
	const already = lines.some((l) => l.product.slug === product.slug);
	const wa = `https://wa.me/?text=${encodeURIComponent(`Hello Thift Nairobi, I would like to order ${product.name} (${size}) for ${formatPrice(product.price)}.`)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mx-auto max-w-[1320px] px-6 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-10 lg:grid-cols-[1.15fr_.85fr] lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[72px_minmax(0,1fr)] gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-3",
					children: [
						1,
						2,
						3
					].map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						"aria-label": `View image ${n}`,
						className: "aspect-square overflow-hidden rounded-lg border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: product.image,
							alt: "",
							width: 100,
							height: 100,
							loading: "lazy",
							className: "h-full w-full object-cover"
						})
					}, n))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("figure", {
					className: "overflow-hidden rounded-xl bg-secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: product.image,
						alt: product.name,
						width: 1024,
						height: 1024,
						className: "aspect-square h-full w-full object-cover"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "self-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						className: "font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground",
						children: ["Shop / ", product.category]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-5 font-display text-5xl leading-none sm:text-6xl",
						children: product.name
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-4 font-display text-3xl font-semibold",
						children: formatPrice(product.price)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 font-mono text-[10px] uppercase tracking-[.15em] text-accent",
						children: ["Condition: ", product.condition]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-5 max-w-lg leading-relaxed text-foreground/70",
						children: [product.description, " Every piece is carefully checked and steam-cleaned before dispatch."]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-3 text-sm font-semibold",
							children: "Choose size"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: product.sizes.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setSize(s),
								className: `grid min-h-11 min-w-11 place-items-center rounded-full border px-3 text-sm ${size === s ? "border-accent bg-accent text-accent-foreground" : "border-border"}`,
								children: s
							}, s))
						})]
					}),
					product.sold ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-8 border-y border-border py-5 font-display text-2xl",
						children: "This piece has been found a home."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							disabled: already,
							onClick: () => {
								if (add(product, size)) setAdded(true);
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "size-4" }), already || added ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " In your cart"] }) : "Add to cart"]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: wa,
							target: "_blank",
							rel: "noreferrer",
							className: "inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " WhatsApp Order"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 border-t border-border pt-5 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "One-of-one piece · You can only add it once." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1",
							children: "Delivery arranged across Nairobi and Kenya."
						})]
					})
				]
			})]
		})
	});
}
//#endregion
export { ProductPage as component };
