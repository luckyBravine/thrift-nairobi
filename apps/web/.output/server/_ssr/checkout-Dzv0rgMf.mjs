import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as CreditCard, _ as Lock, a as Smartphone, p as MessageCircle } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { a as defaultSettings } from "./admin-data-BRPKL9MM.mjs";
import { n as useCart } from "./cart-context-DeumWN0k.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/checkout-Dzv0rgMf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var METHODS = [
	{
		id: "pesalink",
		label: "Pesalink — bank or card",
		caption: "Secure bank transfer, handled by our payment partner.",
		icon: CreditCard
	},
	{
		id: "mpesa",
		label: "M-Pesa",
		caption: "Coming soon — pay by STK push.",
		icon: Smartphone,
		disabled: true
	},
	{
		id: "whatsapp",
		label: "Finish on WhatsApp",
		caption: "Confirm sizing and delivery with our team first.",
		icon: MessageCircle
	}
];
function Checkout() {
	const { lines, clear } = useCart();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [method, setMethod] = (0, import_react.useState)("pesalink");
	const subtotal = lines.reduce((sum, line) => sum + line.product.price, 0);
	const shipping = subtotal >= defaultSettings.freeOver || subtotal === 0 ? 0 : defaultSettings.delivery;
	const total = subtotal + shipping;
	function submit(event) {
		event.preventDefault();
		setBusy(true);
		const form = new FormData(event.currentTarget);
		const id = `TN-${Date.now().toString().slice(-6)}`;
		const summary = lines.map((l) => `${l.product.name} (${l.size})`).join(", ");
		sessionStorage.setItem(`thift_order_${id}`, JSON.stringify({
			id,
			lines,
			subtotal,
			shipping,
			total,
			method,
			customer: {
				name: form.get("name"),
				email: form.get("email"),
				phone: form.get("phone"),
				area: form.get("area"),
				notes: form.get("notes")
			}
		}));
		if (method === "whatsapp") window.open(`https://wa.me/${defaultSettings.whatsapp}?text=${encodeURIComponent(`Hello Thift Nairobi, my order ${id}: ${summary}. Total ${formatPrice(total)}.`)}`, "_blank", "noopener,noreferrer");
		clear();
		navigate({
			to: "/order/$publicId",
			params: { publicId: id }
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
				children: "Guest checkout — no account needed"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl sm:text-6xl",
				children: "Checkout"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-xl text-sm text-muted-foreground",
				children: "Every piece is one-of-one, so your items stay reserved while you pay. You can complete this order as a guest—no account required."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit: submit,
				className: "mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_340px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-2xl",
						children: "Delivery details"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 grid gap-5 sm:grid-cols-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: ["Full name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									name: "name",
									autoComplete: "name",
									className: "field mt-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: ["Email", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "email",
									name: "email",
									autoComplete: "email",
									className: "field mt-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: ["Kenya phone", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									type: "tel",
									name: "phone",
									placeholder: "07XX XXX XXX",
									pattern: "(?:\\+254|0)[17][0-9]{8}",
									className: "field mt-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm",
								children: ["Area / town", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									required: true,
									name: "area",
									placeholder: "e.g. Kilimani, Nairobi",
									className: "field mt-2"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm sm:col-span-2",
								children: ["Delivery notes", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									name: "notes",
									rows: 3,
									className: "field mt-2 resize-none"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-10 font-display text-2xl",
						children: "Payment"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5 space-y-3",
						children: METHODS.map((option) => {
							const Icon = option.icon;
							const active = method === option.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: `flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition-colors ${option.disabled ? "cursor-not-allowed border-border opacity-55" : active ? "border-accent bg-secondary/40" : "border-border hover:bg-secondary/25"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "radio",
										name: "method",
										disabled: option.disabled,
										checked: active,
										onChange: () => setMethod(option.id),
										className: "mt-1 accent-[var(--color-accent)]"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "mt-0.5 size-4 shrink-0" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-sm font-medium",
											children: option.label
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "block text-xs text-muted-foreground",
											children: option.caption
										})]
									})
								]
							}, option.id);
						})
					}),
					method === "pesalink" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-[10px] uppercase tracking-[.16em] text-muted-foreground",
								children: "Pesalink"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-4 grid gap-4 sm:grid-cols-2",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm sm:col-span-2",
										children: ["Name on account", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "payerName",
											autoComplete: "cc-name",
											className: "field mt-2"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm sm:col-span-2",
										children: ["Bank", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
											name: "bank",
											className: "field mt-2",
											children: [
												"Equity Bank",
												"KCB",
												"Co-operative Bank",
												"NCBA",
												"Absa Kenya",
												"Other"
											].map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: b }, b))
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
										className: "text-sm sm:col-span-2",
										children: ["Account or Pesalink number", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											name: "payerAccount",
											inputMode: "numeric",
											placeholder: "0700 000 000",
											className: "field mt-2 font-mono text-xs"
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 flex items-center gap-2 text-xs text-muted-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }), " You'll confirm the transfer on your bank's secure page. We never store your bank details."]
							})
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "h-fit rounded-xl border border-border bg-card p-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl",
							children: "Order summary"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 space-y-3",
							children: [lines.map((line) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
										src: line.product.image,
										alt: "",
										className: "size-14 rounded-md object-cover"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "min-w-0 flex-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm",
											children: line.product.name
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "font-mono text-[10px] uppercase tracking-[.12em] text-muted-foreground",
											children: [
												line.size,
												" · ",
												line.product.condition
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "shrink-0 text-sm",
										children: formatPrice(line.product.price)
									})
								]
							}, line.product.slug)), !lines.length && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-sm text-muted-foreground",
								children: [
									"Your bag is empty. ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/shop",
										className: "underline underline-offset-4",
										children: "Find a piece"
									}),
									"."
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "mt-5 space-y-1.5 border-t border-border pt-5 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Subtotal"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(subtotal) })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted-foreground",
										children: "Nairobi delivery"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: shipping ? formatPrice(shipping) : "Free" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between pt-2 font-semibold",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", { children: "Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: formatPrice(total) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							disabled: busy || !lines.length,
							className: "mt-6 w-full",
							type: "submit",
							children: busy ? "Processing…" : method === "whatsapp" ? "Place order on WhatsApp" : `Pay ${formatPrice(total)}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-3 flex items-center gap-2 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-3.5" }),
								" Free delivery on orders over ",
								formatPrice(defaultSettings.freeOver),
								"."
							]
						})
					]
				})]
			})
		]
	});
}
//#endregion
export { Checkout as component };
