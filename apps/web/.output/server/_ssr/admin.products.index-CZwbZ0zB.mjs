import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link, p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { a as useStored, i as useStaff, r as atLeast } from "./admin-auth-D87Yl1YF.mjs";
import { t as formatPrice } from "./catalog-mqyfKZjT.mjs";
import { i as StatusBadge, t as AdminShell } from "./admin-shell-C8bby1mf.mjs";
import { r as PRODUCTS_KEY, u as seedProducts } from "./admin-data-BRPKL9MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin.products.index-CZwbZ0zB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProductsList() {
	const { session } = useStaff();
	const navigate = useNavigate();
	const canEdit = atLeast(session.role, "admin");
	const [items] = useStored(PRODUCTS_KEY, seedProducts);
	const [status, setStatus] = (0, import_react.useState)("");
	const [category, setCategory] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const list = (0, import_react.useMemo)(() => items.filter((p) => (!status || p.status === status) && (!category || p.category === category) && (!query.trim() || p.name.toLowerCase().includes(query.trim().toLowerCase()))), [
		items,
		status,
		category,
		query
	]);
	const open = (item) => canEdit ? navigate({
		to: "/admin/products/$id",
		params: { id: item.id }
	}) : navigate({
		to: "/admin/products/$id/view",
		params: { id: item.id }
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AdminShell, {
		title: "Products",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-4xl sm:text-5xl",
					children: "Products"
				}), canEdit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: () => void navigate({ to: "/admin/products/new" }),
					children: "Add product"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 flex flex-wrap gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Status",
						value: status,
						onChange: (e) => setStatus(e.target.value),
						className: "field max-w-40 rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All"
						}), [
							"draft",
							"active",
							"sold",
							"archived"
						].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s
						}, s))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
						"aria-label": "Category",
						value: category,
						onChange: (e) => setCategory(e.target.value),
						className: "field max-w-44 rounded-full",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							children: "All categories"
						}), [
							"Jackets",
							"Dresses",
							"Tops",
							"Shoes",
							"Accessories"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						"aria-label": "Search products",
						placeholder: "Search pieces…",
						value: query,
						onChange: (e) => setQuery(e.target.value),
						className: "field max-w-64 rounded-full"
					})
				]
			}),
			!list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid min-h-60 place-items-center rounded-xl border border-border text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-2xl",
					children: "No products. Add your first piece."
				}) })
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 hidden overflow-x-auto rounded-xl border border-border md:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[860px] text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "bg-secondary/50 text-left font-mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Piece"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Condition"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Size"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Price"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Stock"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Status"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-3",
								children: "Updated"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						onClick: () => void open(item),
						className: "cursor-pointer border-t border-border hover:bg-secondary/30",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "flex items-center gap-3 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: item.image,
									alt: "",
									className: "size-12 rounded-md object-cover"
								}), item.name]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs",
								children: item.condition
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: item.size
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: formatPrice(item.price)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: item.stock
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "p-3 font-mono text-xs text-muted-foreground",
								children: item.updated
							})
						]
					}, item.id)) })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 grid gap-3 md:hidden",
				children: list.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: canEdit ? "/admin/products/$id" : "/admin/products/$id/view",
					params: { id: item.id },
					className: "admin-card flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: item.image,
						alt: "",
						className: "size-16 rounded-md object-cover"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm",
								children: item.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground",
								children: [
									item.condition,
									" · ",
									item.size,
									" · ",
									formatPrice(item.price)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1.5",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: item.status })
							})
						]
					})]
				}, item.id))
			})] })
		]
	});
}
//#endregion
export { ProductsList as component };
