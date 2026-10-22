import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  numeric,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import {
  couponTypeEnum,
  purchaseOrderStatusEnum,
  stockMovementReasonEnum,
  paymentStatusEnum,
  paymentProviderEnum,
  reviewStatusEnum,
} from "./enums";
import { products, productVariants, orders } from "./commerce";

// ─── Coupons ─────────────────────────────────────────────────────────────────

export const coupons = pgTable(
  "coupons",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull().unique(),
    type: couponTypeEnum("type").notNull(),
    value: integer("value").notNull(), // percent 1–100 or KES amount
    minOrderKes: integer("min_order_kes").notNull().default(0),
    maxUses: integer("max_uses"), // null = unlimited
    maxUsesPerUser: integer("max_uses_per_user"),
    startsAt: timestamp("starts_at", { withTimezone: true }),
    endsAt: timestamp("ends_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("coupons_active_idx").on(t.isActive)]
);

export const couponRedemptions = pgTable(
  "coupon_redemptions",
  {
    id: text("id").primaryKey(),
    couponId: text("coupon_id")
      .notNull()
      .references(() => coupons.id, { onDelete: "restrict" }),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    userId: text("user_id"),
    amountKes: integer("amount_kes").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("coupon_redemptions_coupon_idx").on(t.couponId),
    index("coupon_redemptions_order_idx").on(t.orderId),
  ]
);

// Also add to orders in commerce.ts when you edit it:
// 
// 

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const reviews = pgTable(
  "reviews",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: text("user_id"), // Better Auth user; null if you allow guest later
    orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
    rating: integer("rating").notNull(), // 1–5, enforce in Zod
    title: text("title"),
    body: text("body"),
    status: reviewStatusEnum("status").notNull().default("pending"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("reviews_product_idx").on(t.productId),
    index("reviews_status_idx").on(t.status),
    uniqueIndex("reviews_user_product_uidx").on(t.userId, t.productId),
  ]
);

// ─── Payments (WhatsApp manual now, STK later) ───────────────────────────────

export const payments = pgTable(
  "payments",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    provider: paymentProviderEnum("provider").notNull().default("whatsapp_manual"),
    status: paymentStatusEnum("status").notNull().default("pending"),
    amountKes: integer("amount_kes").notNull(),
    currency: text("currency").notNull().default("KES"),
    // M-Pesa / STK fields (nullable until used)
    phone: text("phone"),
    providerRef: text("provider_ref"), // CheckoutRequestID, etc.
    merchantRequestId: text("merchant_request_id"),
    mpesaReceipt: text("mpesa_receipt"),
    rawCallback: text("raw_callback"), // JSON string of provider payload
    paidAt: timestamp("paid_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("payments_order_idx").on(t.orderId),
    index("payments_status_idx").on(t.status),
    index("payments_provider_ref_idx").on(t.providerRef),
  ]
);

// ─── Suppliers & procurement ─────────────────────────────────────────────────

export const suppliers = pgTable("suppliers", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  phone: text("phone"),
  email: text("email"),
  notes: text("notes"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const purchaseOrders = pgTable(
  "purchase_orders",
  {
    id: text("id").primaryKey(),
    supplierId: text("supplier_id")
      .notNull()
      .references(() => suppliers.id, { onDelete: "restrict" }),
    status: purchaseOrderStatusEnum("status").notNull().default("draft"),
    reference: text("reference"), // your PO number
    orderedAt: timestamp("ordered_at", { withTimezone: true }),
    notes: text("notes"),
    createdById: text("created_by_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("purchase_orders_supplier_idx").on(t.supplierId),
    index("purchase_orders_status_idx").on(t.status),
  ]
);

export const purchaseOrderItems = pgTable(
  "purchase_order_items",
  {
    id: text("id").primaryKey(),
    purchaseOrderId: text("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    description: text("description"), // free text if product not in catalog yet
    qtyOrdered: integer("qty_ordered").notNull(),
    unitCostKes: integer("unit_cost_kes"), // what you pay supplier
  },
  (t) => [index("po_items_po_idx").on(t.purchaseOrderId)]
);

export const goodsReceipts = pgTable(
  "goods_receipts",
  {
    id: text("id").primaryKey(),
    purchaseOrderId: text("purchase_order_id")
      .notNull()
      .references(() => purchaseOrders.id, { onDelete: "restrict" }),
    receivedAt: timestamp("received_at", { withTimezone: true }).notNull().defaultNow(),
    notes: text("notes"),
    receivedById: text("received_by_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("goods_receipts_po_idx").on(t.purchaseOrderId)]
);

export const goodsReceiptItems = pgTable(
  "goods_receipt_items",
  {
    id: text("id").primaryKey(),
    goodsReceiptId: text("goods_receipt_id")
      .notNull()
      .references(() => goodsReceipts.id, { onDelete: "cascade" }),
    purchaseOrderItemId: text("purchase_order_item_id").references(
      () => purchaseOrderItems.id,
      { onDelete: "set null" }
    ),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    qtyOrdered: integer("qty_ordered").notNull(),
    qtyReceived: integer("qty_received").notNull(),
    // variance = qtyReceived - qtyOrdered → overage if > 0, shortage if < 0
  },
  (t) => [index("grn_items_receipt_idx").on(t.goodsReceiptId)]
);

export const stockMovements = pgTable(
  "stock_movements",
  {
    id: text("id").primaryKey(),
    variantId: text("variant_id")
      .notNull()
      .references(() => productVariants.id, { onDelete: "restrict" }),
    reason: stockMovementReasonEnum("reason").notNull(),
    quantityDelta: integer("quantity_delta").notNull(), // +in / -out
    balanceAfter: integer("balance_after").notNull(),
    orderId: text("order_id").references(() => orders.id, { onDelete: "set null" }),
    goodsReceiptId: text("goods_receipt_id").references(() => goodsReceipts.id, {
      onDelete: "set null",
    }),
    note: text("note"),
    createdById: text("created_by_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("stock_movements_variant_idx").on(t.variantId),
    index("stock_movements_created_at_idx").on(t.createdAt),
  ]
);