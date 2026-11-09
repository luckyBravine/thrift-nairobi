import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as SlidersHorizontal, t as X } from "../_libs/lucide-react.mjs";
import { s as products } from "./catalog-mqyfKZjT.mjs";
import { t as Route } from "./shop-DMggxbed.mjs";
import { t as ProductCard } from "./product-card-CBxuebAx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-CLm975WO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Shop() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: "/shop" });
	const [sheet, setSheet] = (0, import_react.useState)(false);
	const update = (key, value) => navigate({ search: (prev) => {
		const next = { ...prev };
		if (value === "") delete next[key];
		else Object.assign(next, { [key]: value });
		return next;
	} });
	const list = (0, import_react.useMemo)(() => products.filter((p) => (!search.category || p.category === search.category) && (!search.size || p.sizes.includes(search.size)) && (!search.condition || p.condition === search.condition) && p.price <= (search.max ?? 5e3)).sort((a, b) => search.sort === "price" ? a.price - b.price : search.sort === "name" ? a.name.localeCompare(b.name) : 0), [search]);
	const Filters = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-7",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				label: "Category",
				values: [
					"Jackets",
					"Dresses",
					"Tops",
					"Shoes",
					"Accessories"
				],
				selected: search.category ?? "",
				onChange: (v) => update("category", v)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				label: "Size",
				values: [
					"S",
					"M",
					"L",
					"38",
					"39",
					"One Size"
				],
				selected: search.size ?? "",
				onChange: (v) => update("size", v)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filter, {
				label: "Condition",
				values: ["Good", "Very Good"],
				selected: search.condition ?? "",
				onChange: (v) => update("condition", v)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-xl",
					children: "Maximum price"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono text-xs",
					children: ["KSh ", search.max ?? 5e3]
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				"aria-label": "Maximum price",
				type: "range",
				min: "900",
				max: "5000",
				step: "100",
				value: search.max ?? 5e3,
				onChange: (e) => update("max", Number(e.target.value)),
				className: "mt-4 w-full accent-[var(--color-accent)]"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: () => navigate({ search: search.sort ? { sort: search.sort } : {} }),
				className: "text-sm underline underline-offset-4",
				children: "Clear filters"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-[1320px] px-6 py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-[minmax(0,1fr)_auto] items-end gap-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
						children: "The current edit"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-5xl sm:text-6xl",
						children: "Shop all pieces"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => setSheet(true),
					className: "flex h-11 shrink-0 items-center gap-2 rounded-full border border-border px-4 text-sm lg:hidden",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "size-4" }), " Filters"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: "hidden border-r border-border pr-7 lg:block",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filters, {})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-7 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-mono text-[10px] uppercase tracking-[.15em] text-muted-foreground",
						children: [list.length, " pieces"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "text-sm",
						children: ["Sort ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
							value: search.sort,
							onChange: (e) => update("sort", e.target.value),
							className: "ml-2 rounded-full border border-border bg-background px-3 py-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "newest",
									children: "Newest"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "price",
									children: "Price"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "name",
									children: "Name"
								})
							]
						})]
					})]
				}), list.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-2 gap-x-4 gap-y-10 xl:grid-cols-3 xl:gap-6",
					children: list.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: p }, p.slug))
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid min-h-80 place-items-center border-y border-border text-center",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-3xl",
						children: "No pieces match."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: "Try changing or clearing your filters."
					})] })
				})] })]
			}),
			sheet && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-[60] bg-foreground/25 lg:hidden",
				onClick: () => setSheet(false),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "absolute inset-y-0 right-0 w-[min(88vw,360px)] overflow-y-auto bg-background p-6",
					onClick: (e) => e.stopPropagation(),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-8 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-3xl",
							children: "Filters"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							"aria-label": "Close filters",
							onClick: () => setSheet(false),
							className: "grid size-10 place-items-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Filters, {})]
				})
			})
		]
	});
}
function Filter({ label, values, selected, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
		className: "mb-3 font-display text-xl",
		children: label
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-2",
		children: values.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: selected === v,
				onChange: () => onChange(selected === v ? "" : v),
				className: "accent-[var(--color-accent)]"
			}), v]
		}, v))
	})] });
}
//#endregion
export { Shop as component };
