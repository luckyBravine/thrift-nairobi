import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as ArrowRight, i as Trash2 } from "../_libs/lucide-react.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { n as useCart } from "./cart-context-DeumWN0k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-1a9pMEl5.js
var import_jsx_runtime = require_jsx_runtime();
function Cart() {
	const { lines, remove } = useCart();
	const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
				children: "Your selection"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Shopping cart"
			}),
			!lines.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 grid min-h-80 place-items-center border-y border-border text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl",
					children: "Your cart is waiting."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "mt-5 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground",
					children: "Explore the shop"
				})] })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "divide-y divide-border border-y border-border",
					children: lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
						className: "grid grid-cols-[96px_minmax(0,1fr)_auto] gap-4 py-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: l.product.image,
								alt: "",
								width: 120,
								height: 120,
								className: "aspect-square rounded-lg object-cover"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/product/$slug",
										params: { slug: l.product.slug },
										className: "font-display text-xl leading-tight",
										children: l.product.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "mt-2 font-mono text-[9px] uppercase tracking-[.12em] text-muted-foreground",
										children: [
											"Size ",
											l.size,
											" · ",
											l.product.condition
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-2 text-xs text-muted-foreground",
										children: "Qty 1 · Unique piece"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-end justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-lg font-semibold",
									children: formatPrice(l.product.price)
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									"aria-label": `Remove ${l.product.name}`,
									onClick: () => remove(l.product.slug),
									className: "grid size-9 place-items-center rounded-full hover:bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
								})]
							})
						]
					}, l.product.slug))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit border-y border-border py-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl",
							children: "Summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: formatPrice(subtotal) })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex justify-between text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Calculated at checkout" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/checkout",
							className: "mt-7 flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground",
							children: ["Proceed to checkout ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Cart as component };
