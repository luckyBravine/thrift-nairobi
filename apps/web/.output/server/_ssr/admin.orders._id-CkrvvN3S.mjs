import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { a as useStored } from "./admin-auth-D87Yl1YF.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { i as StatusBadge, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { f as waLink, l as seedOrders, n as ORDERS_KEY, o as orderSubtotal, s as orderTotal } from "./admin-data-BRPKL9MM.mjs";
import { t as Route } from "./admin.orders._id-BRHKDepB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.orders._id-CkrvvN3S.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACTIONS = [
	{
		label: "Mark paid",
		status: "paid"
	},
	{
		label: "Processing",
		status: "processing"
	},
	{
		label: "Shipped",
		status: "shipped"
	},
	{
		label: "Delivered",
		status: "delivered"
	}
];
function OrderShow() {
	const { id } = Route.useParams();
	const [orders, setOrders] = useStored(ORDERS_KEY, seedOrders);
	const [toast, setToast] = (0, import_react.useState)("");
	const order = orders.find((o) => o.publicId === id);
	if (!order) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AdminShell, {
		title: "Order",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "py-16 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl",
				children: "Order not found."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/orders",
				className: "mt-4 inline-block underline underline-offset-4",
				children: "Back to orders"
			})]
		})
	});
	const terminal = order.status === "delivered" || order.status === "cancelled";
	const update = (patch, message) => {
		setOrders(orders.map((o) => o.publicId === id ? {
			...o,
			...patch
		} : o));
		setToast(message);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: order.publicId,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/admin/orders",
				className: "font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground underline underline-offset-4",
				children: "Back to orders"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-wrap items-center gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-4xl",
						children: order.publicId
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: order.status }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted-foreground",
						children: order.created
					})
				]
			}),
			toast && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 rounded-md border border-border bg-secondary/50 px-3 py-2 text-sm",
				children: toast
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-6 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "admin-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Customer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Name"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.customer })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
										className: "truncate",
										children: order.email
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Phone"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "flex items-center gap-2 font-mono text-xs",
										children: [order.phone, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => {
												navigator.clipboard.writeText(order.phone);
												setToast("Phone copied.");
											},
											className: "underline underline-offset-4",
											children: "Copy"
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Area"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.area })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Method"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.method })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-5 block text-sm",
							children: ["Notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								defaultValue: order.notes,
								rows: 3,
								className: "field mt-2 resize-none",
								onBlur: (e) => update({ notes: e.target.value }, "Notes saved.")
							})]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "admin-card",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Items"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4 divide-y divide-border",
							children: order.lines.map((l, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3 py-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: l.image,
										alt: "",
										className: "size-14 rounded-md object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm",
											children: l.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
											children: [
												l.size,
												" · ",
												l.condition,
												" · x",
												l.qty
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-sm",
										children: formatPrice(l.unit)
									})
								]
							}, `${l.name}-${i}`))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-4 space-y-1.5 border-t border-border pt-4 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Subtotal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(orderSubtotal(order)) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Shipping"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: order.shipping ? formatPrice(order.shipping) : "Free" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(orderTotal(order)) })]
								})
							]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 flex flex-wrap gap-3",
				children: [
					ACTIONS.map((action) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: terminal,
						onClick: () => update({ status: action.status }, `Order marked ${action.status}.`),
						children: action.label
					}, action.status)),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						disabled: terminal,
						onClick: () => {
							if (window.confirm("Cancel this order? This cannot be undone.")) update({ status: "cancelled" }, "Order cancelled.");
						},
						children: "Cancel"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						className: "wa-link self-center",
						target: "_blank",
						rel: "noreferrer",
						href: waLink(order.phone, `Hi ${order.customer}, re order ${order.publicId}…`),
						children: "Chat on WhatsApp"
					})
				]
			}),
			terminal && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"This order is ",
					order.status,
					" — no further status changes."
				]
			})
		]
	});
}
//#endregion
export { OrderShow as component };
