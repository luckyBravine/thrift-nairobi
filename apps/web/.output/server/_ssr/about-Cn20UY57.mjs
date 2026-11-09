import { p as require_jsx_runtime } from "../_libs/@radix-ui/react-avatar+[...].mjs";
import { f as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { b as Heart, v as Leaf, x as Eye } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/about-Cn20UY57.js
var import_jsx_runtime = require_jsx_runtime();
var values = [
	{
		icon: Eye,
		title: "Chosen slowly",
		text: "We select for fabric, construction and the kind of character that gets better with wear."
	},
	{
		icon: Heart,
		title: "Loved again",
		text: "Every find is checked, refreshed and presented honestly so its next chapter starts well."
	},
	{
		icon: Leaf,
		title: "Local by nature",
		text: "We source with Nairobi wardrobes and weather in mind, keeping beautiful clothes in motion."
	}
];
function About() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mx-auto max-w-4xl px-6 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
					children: "Our story"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-4 font-display text-6xl leading-none sm:text-7xl",
					children: "Good clothes deserve another life."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-foreground/70",
					children: "Thift Nairobi began with weekend searches through markets, rails and family wardrobes. We look for pieces with quality, personality and enough life left for many more stories."
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto grid max-w-[1100px] gap-10 px-6 py-14 md:grid-cols-3",
				children: values.map(({ icon: Icon, title, text }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-6 text-accent" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-5 font-display text-3xl",
						children: title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 leading-relaxed text-muted-foreground",
						children: text
					})
				] }, title))
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			id: "journal",
			className: "mx-auto max-w-3xl px-6 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-mono text-[10px] uppercase tracking-[.18em] text-accent",
					children: "Journal · coming soon"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-3 font-display text-4xl",
					children: "Notes on style, care and the city."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/shop",
					className: "mt-7 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground",
					children: "Shop the current edit"
				})
			]
		})
	] });
}
//#endregion
export { About as component };
