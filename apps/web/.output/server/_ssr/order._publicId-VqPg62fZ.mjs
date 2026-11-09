import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { T as CircleCheck, p as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { t as Route } from "./order._publicId-CuQa1pQ1.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._publicId-VqPg62fZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Confirmation() {
	const { publicId } = Route.useParams();
	const [order, setOrder] = (0, import_react.useState)();
	(0, import_react.useEffect)(() => {
		const raw = sessionStorage.getItem(`thift_order_${publicId}`);
		if (raw) setOrder(JSON.parse(raw));
	}, [publicId]);
	const message = encodeURIComponent(`Hello Thift Nairobi, I am following up on order ${publicId}.`);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl px-6 py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "mx-auto size-12 text-accent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 font-mono text-[10px] uppercase tracking-[.18em] text-accent",
				children: "WhatsApp — pending"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display text-5xl sm:text-6xl",
				children: "Thank you for your order."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mx-auto mt-5 max-w-xl text-foreground/70",
				children: "Your pieces are reserved while we confirm delivery and payment with you on WhatsApp."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 font-mono text-xs",
				children: ["ORDER ", publicId]
			}),
			order && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto mt-10 max-w-xl divide-y divide-border border-y border-border text-left",
				children: [order.lines.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between gap-4 py-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
						l.product.name,
						" · ",
						l.size
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(l.product.price) })]
				}, l.product.slug)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-between py-4 font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(order.subtotal) })]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-9 flex flex-wrap justify-center gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `https://wa.me/?text=${message}`,
					target: "_blank",
					rel: "noreferrer",
					className: "inline-flex min-h-11 items-center gap-2 rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageCircle, { className: "size-4" }), " Open WhatsApp again"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "inline-flex min-h-11 items-center rounded-full border border-primary/25 px-5 text-sm font-semibold",
					children: "Continue shopping"
				})]
			})
		]
	});
}
//#endregion
export { Confirmation as component };
