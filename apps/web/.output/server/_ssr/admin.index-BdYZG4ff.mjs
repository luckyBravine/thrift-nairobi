import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { C as Coins, r as TriangleAlert, s as ShoppingBag, w as Clock } from "../_libs/lucide-react.mjs";
import { a as useStored, i as useStaff } from "./admin-auth-D87Yl1YF.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { i as StatusBadge, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { c as seedMessages, f as waLink, l as seedOrders, n as ORDERS_KEY, s as orderTotal, t as MESSAGES_KEY } from "./admin-data-BRPKL9MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.index-BdYZG4ff.js
var import_jsx_runtime = require_jsx_runtime();
var CARDS = [
	{
		label: "Total revenue",
		value: "KSh 286,540",
		icon: Coins,
		tone: "text-primary",
		to: "/admin/orders"
	},
	{
		label: "Orders today",
		value: "18",
		icon: ShoppingBag,
		tone: "text-foreground",
		to: "/admin/orders"
	},
	{
		label: "Pending orders",
		value: "7",
		icon: Clock,
		tone: "text-accent",
		to: "/admin/orders"
	},
	{
		label: "Low stock",
		value: "4",
		icon: TriangleAlert,
		tone: "text-accent",
		to: "/admin/products"
	}
];
function Dashboard() {
	const { session } = useStaff();
	const [orders] = useStored(ORDERS_KEY, seedOrders);
	const [messages] = useStored(MESSAGES_KEY, seedMessages);
	const unread = messages.filter((m) => !m.read).length;
	const firstName = session.name.split(" ")[0];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Dashboard",
		unread,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl sm:text-5xl",
				children: "Dashboard"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Welcome back, ",
					firstName,
					". Here's the shop today."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: CARDS.map((card) => {
					const Icon = card.icon;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: card.to,
						className: "admin-card relative block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "absolute right-4 top-4 size-4 text-muted-foreground/60" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
								children: card.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: `mt-3 font-display text-3xl ${card.tone}`,
								children: card.value
							})
						]
					}, card.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-12 font-display text-2xl",
				children: "Recent orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto rounded-xl border border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Piece"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "WhatsApp"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: orders.slice(0, 5).map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-t border-border hover:bg-secondary/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/admin/orders/$id",
									params: { id: order.publicId },
									className: "underline underline-offset-4",
									children: order.publicId
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: order.customer
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "p-3 text-muted-foreground",
								children: [order.lines[0]?.name, order.lines.length > 1 ? ` +${order.lines.length - 1}` : ""]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: formatPrice(orderTotal(order))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									className: "wa-link",
									target: "_blank",
									rel: "noreferrer",
									href: waLink(order.phone, `Hi ${order.customer}, re order ${order.publicId}…`),
									children: "Chat on WhatsApp"
								})
							})
						]
					}, order.publicId)) })]
				})
			})
		]
	});
}
//#endregion
export { Dashboard as component };
