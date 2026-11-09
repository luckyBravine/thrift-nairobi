import { s as products } from "./catalog-mqyfKZjT.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-data-BRPKL9MM.js
var PRODUCTS_KEY = "thift_admin_products_v1";
var SETTINGS_KEY = "thift_settings_v1";
var ORDERS_KEY = "thift_admin_orders_v1";
var MESSAGES_KEY = "thift_admin_messages_v1";
var statuses = [
	"active",
	"active",
	"active",
	"draft",
	"active",
	"sold"
];
var seedProducts = products.map((p, i) => ({
	id: p.slug,
	name: p.name,
	slug: p.slug,
	category: p.category,
	description: p.description,
	condition: p.condition,
	era: p.year,
	price: p.price,
	unique: true,
	size: p.sizes[0] ?? "One Size",
	stock: statuses[i] === "sold" ? 0 : 1,
	status: statuses[i] ?? "active",
	image: p.image,
	updated: `2026-09-${String(8 + i).padStart(2, "0")}`
}));
var line = (i, qty = 1) => {
	const p = products[i % products.length];
	return {
		name: p.name,
		image: p.image,
		size: p.sizes[0] ?? "One Size",
		condition: p.condition,
		qty,
		unit: p.price
	};
};
var seedOrders = [
	{
		publicId: "TN-260918-004",
		customer: "Wanjiru Mwangi",
		email: "wanjiru@example.com",
		phone: "254712345678",
		area: "Kilimani, Nairobi",
		notes: "Please deliver after 5pm.",
		method: "WhatsApp",
		status: "pending",
		created: "2026-09-14",
		shipping: 300,
		lines: [line(0), line(3)]
	},
	{
		publicId: "TN-260918-003",
		customer: "Kevin Ochieng",
		email: "kevin@example.com",
		phone: "254720111222",
		area: "Westlands, Nairobi",
		notes: "",
		method: "M-Pesa",
		status: "paid",
		created: "2026-09-14",
		shipping: 300,
		lines: [line(1)]
	},
	{
		publicId: "TN-260917-002",
		customer: "Aisha Hassan",
		email: "aisha@example.com",
		phone: "254733444555",
		area: "Lavington, Nairobi",
		notes: "Gift wrap if possible.",
		method: "WhatsApp",
		status: "processing",
		created: "2026-09-13",
		shipping: 300,
		lines: [line(2), line(4)]
	},
	{
		publicId: "TN-260916-001",
		customer: "Brian Mutiso",
		email: "brian@example.com",
		phone: "254701998877",
		area: "Karen, Nairobi",
		notes: "",
		method: "WhatsApp",
		status: "shipped",
		created: "2026-09-12",
		shipping: 300,
		lines: [line(5)]
	},
	{
		publicId: "TN-260915-000",
		customer: "Faith Chebet",
		email: "faith@example.com",
		phone: "254799123456",
		area: "Ngong Road, Nairobi",
		notes: "",
		method: "M-Pesa",
		status: "delivered",
		created: "2026-09-11",
		shipping: 0,
		lines: [line(4, 1)]
	}
];
var seedMessages = [
	{
		id: "m1",
		name: "Lucy Njoroge",
		email: "lucy@example.com",
		body: "Hi! Do you restock the heritage denim jackets in size L? I missed the last drop and would love one for an upcoming trip.",
		date: "2026-09-14",
		read: false
	},
	{
		id: "m2",
		name: "Samuel Kariuki",
		email: "samuel@example.com",
		body: "Do you deliver to Nakuru, and how long does it usually take?",
		date: "2026-09-13",
		read: false
	},
	{
		id: "m3",
		name: "Zawadi Ali",
		email: "zawadi@example.com",
		body: "I would like to sell a few of my vintage pieces to you. What is the process?",
		date: "2026-09-11",
		read: true
	}
];
var defaultSettings = {
	storeName: "Thift Nairobi",
	whatsapp: "254712345678",
	delivery: 300,
	freeOver: 8e3,
	mpesa: false
};
var orderTotal = (order) => order.lines.reduce((sum, l) => sum + l.unit * l.qty, 0) + order.shipping;
var orderSubtotal = (order) => order.lines.reduce((sum, l) => sum + l.unit * l.qty, 0);
var waLink = (phone, text) => `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;
var slugify = (value) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
//#endregion
export { defaultSettings as a, seedMessages as c, slugify as d, waLink as f, SETTINGS_KEY as i, seedOrders as l, ORDERS_KEY as n, orderSubtotal as o, PRODUCTS_KEY as r, orderTotal as s, MESSAGES_KEY as t, seedProducts as u };
