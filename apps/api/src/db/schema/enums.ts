import { pgEnum } from "drizzle-orm/pg-core";

export const sizeEnum = pgEnum("size", [
  "XS",
  "S",
  "M",
  "L",
  "XL",
  "XXL",
  "ONE_SIZE",
  "OTHER",
]);

export const conditionEnum = pgEnum("condition", [
  "LIKE_NEW",
  "GENTLY_USED",
  "VERY_GOOD",
  "GOOD",
  "FAIR",
  "WELL_WORN",
]);

export const productStatusEnum = pgEnum("product_status", [
  "draft",
  "published",
  "sold",
  "archived",
]);

export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "awaiting_payment",
  "confirmed",
  "packed",
  "shipped",
  "completed",
  "cancelled",
  "returned",
]);

export const staffInviteRoleEnum = pgEnum("staff_invite_role", [
  "admin",
  "support",
]);

export const messageStatusEnum = pgEnum("message_status", [
  "new",
  "read",
  "archived",
]);

export const cmsPageStatusEnum = pgEnum("cms_page_status", [
  "draft",
  "published",
  "archived",
]);

export const cmsPageTypeEnum = pgEnum("cms_page_type", [
  "page",      // About, Contact content blocks, landings
  "journal",   // editorial posts
  "landing",   // campaign
]);

export const couponTypeEnum = pgEnum("coupon_type", ["percent", "fixed_kes"]);

export const purchaseOrderStatusEnum = pgEnum("purchase_order_status", [
  "draft",
  "sent",
  "partial",
  "received",
  "cancelled",
]);

export const stockMovementReasonEnum = pgEnum("stock_movement_reason", [
  "po_receipt",
  "overage",
  "shortage",
  "sale",
  "return",
  "damage",
  "adjustment",
  "transfer",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "processing",
  "paid",
  "failed",
  "cancelled",
  "refunded",
]);

export const paymentProviderEnum = pgEnum("payment_provider", [
  "whatsapp_manual",
  "mpesa_stk",
  "pesapal",
  "intasend",
  "other",
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "pending",
  "published",
  "hidden",
  "rejected",
]);