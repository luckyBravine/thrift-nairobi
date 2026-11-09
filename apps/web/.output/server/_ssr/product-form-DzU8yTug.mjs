import { n as __toESM } from "../_runtime.mjs";
import { m as require_react, p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { p as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Button } from "./button-CBFOEsKR.mjs";
import { a as product_dress_default, i as product_denim_default, o as product_tee_default, r as product_bag_default } from "./catalog-mqyfKZjT.mjs";
import { d as slugify } from "./admin-data-BRPKL9MM.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product-form-DzU8yTug.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var IMAGE_PRESETS = [
	product_denim_default,
	product_dress_default,
	product_bag_default,
	product_tee_default
];
var emptyProduct = {
	id: "",
	name: "",
	slug: "",
	category: "Jackets",
	description: "",
	condition: "Good",
	brand: "",
	era: "",
	material: "",
	colour: "",
	gender: "",
	price: 0,
	unique: true,
	size: "",
	stock: 1,
	status: "draft",
	image: product_denim_default
};
function ProductForm({ initial, readOnly = false, onSave, onArchive }) {
	const navigate = useNavigate();
	const [draft, setDraft] = (0, import_react.useState)(initial);
	const set = (key, value) => setDraft((current) => ({
		...current,
		[key]: value
	}));
	const field = "field mt-2";
	const disabled = readOnly;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-8 grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid aspect-[4/5] place-items-center overflow-hidden rounded-xl border border-dashed border-border bg-secondary/40",
				children: draft.image ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
					src: draft.image,
					alt: "",
					className: "size-full object-cover"
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm text-muted-foreground",
					children: "Drop a cover image"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "mt-4 block text-sm",
				children: ["Image URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					disabled,
					value: draft.image,
					onChange: (e) => set("image", e.target.value),
					className: field
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 flex gap-2",
				children: IMAGE_PRESETS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled,
					onClick: () => set("image", preset),
					className: `size-12 overflow-hidden rounded-md border ${draft.image === preset ? "border-accent" : "border-border"}`,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: preset,
						alt: "",
						className: "size-full object-cover"
					})
				}, preset))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "The first image is the cover."
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm sm:col-span-2",
					children: ["Name*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						disabled,
						value: draft.name,
						onChange: (e) => {
							set("name", e.target.value);
							if (!initial.id) set("slug", slugify(e.target.value));
						},
						className: `${field} font-display text-lg`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Slug*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						disabled,
						value: draft.slug,
						onChange: (e) => set("slug", slugify(e.target.value)),
						className: `${field} font-mono text-xs`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Category*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						disabled,
						value: draft.category,
						onChange: (e) => set("category", e.target.value),
						className: field,
						children: [
							"Jackets",
							"Dresses",
							"Tops",
							"Shoes",
							"Accessories"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm sm:col-span-2",
					children: ["Description*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						required: true,
						disabled,
						rows: 4,
						value: draft.description,
						onChange: (e) => set("description", e.target.value),
						className: `${field} resize-none`
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Condition*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						disabled,
						value: draft.condition,
						onChange: (e) => set("condition", e.target.value),
						className: field,
						children: [
							"Good",
							"Very Good",
							"Excellent"
						].map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: c }, c))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Brand", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						disabled,
						value: draft.brand ?? "",
						onChange: (e) => set("brand", e.target.value),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Era", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						disabled,
						value: draft.era ?? "",
						onChange: (e) => set("era", e.target.value),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Material", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						disabled,
						value: draft.material ?? "",
						onChange: (e) => set("material", e.target.value),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Colour", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						disabled,
						value: draft.colour ?? "",
						onChange: (e) => set("colour", e.target.value),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Gender", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						disabled,
						value: draft.gender ?? "",
						onChange: (e) => set("gender", e.target.value),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Price (KES)*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						disabled,
						type: "number",
						min: "0",
						step: "1",
						value: draft.price,
						onChange: (e) => set("price", Number(e.target.value)),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Size*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						disabled,
						value: draft.size,
						onChange: (e) => set("size", e.target.value),
						placeholder: "M / 39 / One Size",
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "text-sm",
					children: ["Stock*", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						disabled: disabled || draft.unique,
						type: "number",
						min: "0",
						value: draft.unique ? 1 : draft.stock,
						onChange: (e) => set("stock", Number(e.target.value)),
						className: field
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 self-end text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						disabled,
						checked: draft.unique,
						onChange: (e) => {
							set("unique", e.target.checked);
							if (e.target.checked) set("stock", 1);
						},
						className: "accent-[var(--color-accent)]"
					}), "One-of-one piece (locks stock to 1)"]
				}),
				!readOnly && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex flex-wrap gap-3 sm:col-span-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => onSave?.(draft, "draft"),
							children: "Save draft"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							onClick: () => onSave?.(draft, "active"),
							children: "Publish"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => void navigate({ to: "/admin/products" }),
							children: "Cancel"
						}),
						onArchive && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "text-accent",
							onClick: () => {
								if (window.confirm("Archive this piece? It will leave the shop.")) onArchive();
							},
							children: "Archive"
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { emptyProduct as n, ProductForm as t };
