import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { i as StatusBadge, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { c as seedMessages, f as waLink, l as seedOrders, n as ORDERS_KEY, s as orderTotal, t as MESSAGES_KEY } from "./admin-data-BRPKL9MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders.index-Dofw1i0j.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersList() {
	const [orders] = useStored(ORDERS_KEY, seedOrders);
	const [messages] = useStored(MESSAGES_KEY, seedMessages);
	const [status, setStatus] = (0, import_react.useState)("");
	const [method, setMethod] = (0, import_react.useState)("");
	const [range, setRange] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => {
		const now = /* @__PURE__ */ new Date("2026-09-14");
		return [...orders].filter((o) => (!status || o.status === status) && (!method || o.method === method)).filter((o) => {
			if (!range) return true;
			const days = (now.getTime() - new Date(o.created).getTime()) / 864e5;
			return range === "today" ? days < 1 : days <= 7;
		}).filter((o) => {
			const q = query.trim().toLowerCase();
			return !q || o.customer.toLowerCase().includes(q) || o.phone.includes(q) || o.publicId.toLowerCase().includes(q);
		}).sort((a, b) => b.created.localeCompare(a.created) || b.publicId.localeCompare(a.publicId));
	}, [
		orders,
		status,
		method,
		range,
		query
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Orders",
		unread: messages.filter((m) => !m.read).length,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl sm:text-5xl",
				children: "Orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Status",
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "field max-w-44 rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All statuses"
						}), [
							"pending",
							"paid",
							"processing",
							"shipped",
							"delivered",
							"cancelled"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Method",
						value: method,
						onChange: (e) => setMethod(e.target.value),
						className: "field max-w-44 rounded-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "All methods"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "WhatsApp",
								children: "WhatsApp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "M-Pesa",
								children: "M-Pesa"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Date range",
						value: range,
						onChange: (e) => setRange(e.target.value),
						className: "field max-w-40 rounded-full",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "",
								children: "Any date"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "today",
								children: "Today"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "7",
								children: "Last 7 days"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Search orders",
						placeholder: "Search name, phone or TN-…",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						className: "field max-w-64 rounded-full"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 overflow-x-auto rounded-xl border border-border",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[880px] text-sm",
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
								children: "Items"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Method"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Created"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "WhatsApp"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: order.lines.reduce((s, l) => s + l.qty, 0)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: formatPrice(orderTotal(order))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 text-muted-foreground",
								children: order.method
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs text-muted-foreground",
								children: order.created
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
				}), !list.length && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "p-8 text-center text-sm text-muted-foreground",
					children: "No orders match these filters."
				})]
			})
		]
	});
}
//#endregion
export { OrdersList as component };
