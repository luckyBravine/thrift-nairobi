import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { O as ArrowRight } from "../_libs/lucide-react.mjs";
import { s as products } from "./catalog-mqyfKZjT.mjs";
import { t as ProductCard } from "./product-card-CBxuebAx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DrkWjCsr.js
var import_jsx_runtime = require_jsx_runtime();
var thift_hero_default = "/assets/thift-hero-CA0EzlFr.jpg";
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "relative overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "pointer-events-none absolute right-0 top-0 size-96 rounded-full bg-accent/10 blur-3xl" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-[1320px] items-center gap-10 px-6 py-14 md:grid-cols-2 md:py-20 lg:gap-16",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rise",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent",
						children: "Curated in Nairobi · One of one"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
						className: "max-w-[10ch] font-display text-6xl font-medium leading-[.9] sm:text-7xl lg:text-8xl",
						children: ["Curated Secondhand ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", {
							className: "text-accent",
							children: "Style."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-7 max-w-[38ch] text-base leading-relaxed text-foreground/70",
						children: "Thoughtfully sourced vintage pieces with soul, style and stories. Thrifted in Kenya, made to be loved again."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/shop",
						search: { sort: "newest" },
						className: "mt-9 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90",
						children: ["Shop New Drops ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("figure", {
				className: "rise relative mx-auto w-full max-w-xl",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute -inset-4 rounded-3xl bg-primary/5 backdrop-blur-sm" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute -left-3 -top-4 z-10 rounded-full border border-border bg-background/85 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] backdrop-blur",
						children: "Nairobi · Est. 2026"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: thift_hero_default,
						alt: "Woman styled in a vintage paisley blouse and tailored trousers",
						width: 1024,
						height: 1280,
						className: "relative aspect-[4/5] w-full rounded-2xl object-cover"
					})
				]
			})]
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto max-w-[1320px] px-6 pb-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-9 text-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-4xl font-medium sm:text-5xl",
					children: "New Arrivals"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 font-mono text-[10px] uppercase tracking-[0.17em] text-muted-foreground",
					children: "06 pieces · updated weekly"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-3 lg:gap-6",
				children: products.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-12 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "inline-flex rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold hover:bg-primary hover:text-primary-foreground",
					children: "View the full collection"
				})
			})
		]
	})] });
}
//#endregion
export { Home as component };
