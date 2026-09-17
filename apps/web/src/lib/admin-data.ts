import { products } from "@/lib/catalog";
import type { Role } from "@/lib/admin-auth";

export type ProductStatus = "draft" | "active" | "sold" | "archived";
export type AdminProduct = {
  id: string; name: string; slug: string; category: string; description: string; condition: string;
  brand?: string; era?: string; material?: string; colour?: string; gender?: string;
  price: number; unique: boolean; size: string; stock: number; status: ProductStatus;
  image: string; updated: string;
};

export const PRODUCTS_KEY = "thift_admin_products_v1";
export const SETTINGS_KEY = "thift_settings_v1";
export const STAFF_KEY = "thift_admin_staff_v1";
export const ORDERS_KEY = "thift_admin_orders_v1";
export const MESSAGES_KEY = "thift_admin_messages_v1";

const statuses: ProductStatus[] = ["active", "active", "active", "draft", "active", "sold"];
export const seedProducts: AdminProduct[] = products.map((p, i) => ({
  id: p.slug, name: p.name, slug: p.slug, category: p.category, description: p.description,
  condition: p.condition, era: p.year, price: p.price, unique: true, size: p.sizes[0] ?? "One Size",
  stock: statuses[i] === "sold" ? 0 : 1, status: statuses[i] ?? "active", image: p.image,
  updated: `2026-09-${String(8 + i).padStart(2, "0")}`,
}));

export type OrderStatus = "pending" | "paid" | "processing" | "shipped" | "delivered" | "cancelled";
export type AdminOrderLine = { name: string; image: string; size: string; condition: string; qty: number; unit: number };
export type AdminOrder = {
  publicId: string; customer: string; email: string; phone: string; area: string; notes: string;
  method: "WhatsApp" | "M-Pesa"; status: OrderStatus; created: string; shipping: number; lines: AdminOrderLine[];
};

const line = (i: number, qty = 1): AdminOrderLine => {
  const p = products[i % products.length]!;
  return { name: p.name, image: p.image, size: p.sizes[0] ?? "One Size", condition: p.condition, qty, unit: p.price };
};

export const seedOrders: AdminOrder[] = [
  { publicId: "TN-260918-004", customer: "Wanjiru Mwangi", email: "wanjiru@example.com", phone: "254712345678", area: "Kilimani, Nairobi", notes: "Please deliver after 5pm.", method: "WhatsApp", status: "pending", created: "2026-09-14", shipping: 300, lines: [line(0), line(3)] },
  { publicId: "TN-260918-003", customer: "Kevin Ochieng", email: "kevin@example.com", phone: "254720111222", area: "Westlands, Nairobi", notes: "", method: "M-Pesa", status: "paid", created: "2026-09-14", shipping: 300, lines: [line(1)] },
  { publicId: "TN-260917-002", customer: "Aisha Hassan", email: "aisha@example.com", phone: "254733444555", area: "Lavington, Nairobi", notes: "Gift wrap if possible.", method: "WhatsApp", status: "processing", created: "2026-09-13", shipping: 300, lines: [line(2), line(4)] },
  { publicId: "TN-260916-001", customer: "Brian Mutiso", email: "brian@example.com", phone: "254701998877", area: "Karen, Nairobi", notes: "", method: "WhatsApp", status: "shipped", created: "2026-09-12", shipping: 300, lines: [line(5)] },
  { publicId: "TN-260915-000", customer: "Faith Chebet", email: "faith@example.com", phone: "254799123456", area: "Ngong Road, Nairobi", notes: "", method: "M-Pesa", status: "delivered", created: "2026-09-11", shipping: 0, lines: [line(4, 1)] },
];

export type AdminMessage = { id: string; name: string; email: string; body: string; date: string; read: boolean };
export const seedMessages: AdminMessage[] = [
  { id: "m1", name: "Lucy Njoroge", email: "lucy@example.com", body: "Hi! Do you restock the heritage denim jackets in size L? I missed the last drop and would love one for an upcoming trip.", date: "2026-09-14", read: false },
  { id: "m2", name: "Samuel Kariuki", email: "samuel@example.com", body: "Do you deliver to Nakuru, and how long does it usually take?", date: "2026-09-13", read: false },
  { id: "m3", name: "Zawadi Ali", email: "zawadi@example.com", body: "I would like to sell a few of my vintage pieces to you. What is the process?", date: "2026-09-11", read: true },
];

export type StaffMember = { id: string; name: string; email: string; role: Role; active: boolean; joined: string };
export const seedStaff: StaffMember[] = [
  { id: "s1", name: "Amina Otieno", email: "owner@thift.ke", role: "superadmin", active: true, joined: "2025-11-02" },
  { id: "s2", name: "Brian Kimani", email: "manager@thift.ke", role: "admin", active: true, joined: "2026-01-18" },
  { id: "s3", name: "Njeri Wanjiku", email: "support@thift.ke", role: "support", active: true, joined: "2026-04-06" },
];

export type StoreSettings = { storeName: string; whatsapp: string; delivery: number; freeOver: number; mpesa: boolean };
export const defaultSettings: StoreSettings = {
  storeName: "Thift Nairobi", whatsapp: "254712345678", delivery: 300, freeOver: 8000, mpesa: false,
};

export const orderTotal = (order: AdminOrder) =>
  order.lines.reduce((sum, l) => sum + l.unit * l.qty, 0) + order.shipping;
export const orderSubtotal = (order: AdminOrder) =>
  order.lines.reduce((sum, l) => sum + l.unit * l.qty, 0);

export const waLink = (phone: string, text: string) =>
  `https://wa.me/${phone.replace(/\D/g, "")}?text=${encodeURIComponent(text)}`;

export const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
