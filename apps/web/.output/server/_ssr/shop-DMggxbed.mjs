import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-DMggxbed.js
var $$splitComponentImporter = () => import("./shop-CLm975WO.mjs");
var Route = createFileRoute("/shop")({
	validateSearch: (s) => ({
		...typeof s["sort"] === "string" ? { sort: s["sort"] } : {},
		...typeof s["category"] === "string" ? { category: s["category"] } : {},
		...typeof s["size"] === "string" ? { size: s["size"] } : {},
		...typeof s["condition"] === "string" ? { condition: s["condition"] } : {},
		...typeof s["max"] === "number" ? { max: s["max"] } : {}
	}),
	head: () => ({ meta: [
		{ title: "Shop Vintage Fashion — Thift Nairobi" },
		{
			name: "description",
			content: "Browse curated secondhand clothing and accessories in Nairobi."
		},
		{
			property: "og:title",
			content: "Shop — Thift Nairobi"
		},
		{
			property: "og:description",
			content: "One-of-one vintage and secondhand pieces, curated in Nairobi."
		},
		{
			property: "og:type",
			content: "website"
		},
		{
			name: "twitter:card",
			content: "summary_large_image"
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
