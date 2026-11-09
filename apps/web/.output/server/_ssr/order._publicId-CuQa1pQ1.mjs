import { l as lazyRouteComponent, u as createFileRoute } from "../_libs/@tanstack/react-router+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/order._publicId-CuQa1pQ1.js
var $$splitComponentImporter = () => import("./order._publicId-VqPg62fZ.mjs");
var Route = createFileRoute("/order/$publicId")({
	head: () => ({ meta: [
		{ title: "Order Confirmation — Thift Nairobi" },
		{
			name: "description",
			content: "Your Thift Nairobi order confirmation."
		},
		{
			property: "og:title",
			content: "Order Confirmation — Thift Nairobi"
		},
		{
			property: "og:description",
			content: "Your order is ready to complete on WhatsApp."
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
