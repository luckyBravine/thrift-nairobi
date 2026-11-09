import { h as notFound, l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as getProduct } from "./catalog-mqyfKZjT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/product._slug-BiHHcbBP.js
var $$splitComponentImporter = () => import("./product._slug-CNVEA1Zg.mjs");
var Route = createFileRoute("/product/$slug")({
	loader: ({ params }) => {
		const p = getProduct(params.slug);
		if (!p) throw notFound();
		return p;
	},
	head: ({ loaderData }) => ({ meta: [
		{ title: `${loaderData?.name ?? "Piece"} — Thift Nairobi` },
		{
			name: "description",
			content: loaderData?.description ?? "Curated vintage piece from Thift Nairobi."
		},
		{
			property: "og:title",
			content: `${loaderData?.name ?? "Piece"} — Thift Nairobi`
		},
		{
			property: "og:description",
			content: loaderData?.description ?? "Curated vintage piece from Thift Nairobi."
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
