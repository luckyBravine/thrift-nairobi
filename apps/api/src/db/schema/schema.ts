
import {
  pgTable,
  pgEnum,
  text,
  integer,
  boolean,
  timestamp,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────────────────────────

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

// ─── Categories (seeded, editable later) ─────────────────────────────────────

export const categories = pgTable(
  "categories",
  {
    id: text("id").primaryKey(), // cuid or uuid string
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("categories_active_sort_idx").on(t.isActive, t.sortOrder)]
);

// ─── Products ────────────────────────────────────────────────────────────────

export const products = pgTable(
  "products",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    description: text("description"),
    condition: conditionEnum("condition").notNull(),
    categoryId: text("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    brand: text("brand"),
    priceKes: integer("price_kes").notNull(), // store cents? no — whole KES
    compareAtKes: integer("compare_at_kes"), // optional “was ~X”, nullable
    status: productStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdById: text("created_by_id"), // Better Auth user.id (staff)
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("products_status_idx").on(t.status),
    index("products_category_idx").on(t.categoryId),
    index("products_published_at_idx").on(t.publishedAt),
  ]
);

// ─── Variants (size + stock) ─────────────────────────────────────────────────

export const productVariants = pgTable(
  "product_variants",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    size: sizeEnum("size").notNull(),
    sizeNote: text("size_note"), // when size === OTHER
    sku: text("sku"),
    quantity: integer("quantity").notNull().default(1), // 0 or 1 for thrift
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("product_variants_product_size_uidx").on(t.productId, t.size),
    index("product_variants_product_idx").on(t.productId),
  ]
);

// ─── Images (Cloudinary refs) ────────────────────────────────────────────────

export const productImages = pgTable(
  "product_images",
  {
    id: text("id").primaryKey(),
    productId: text("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    cloudinaryPublicId: text("cloudinary_public_id").notNull(),
    url: text("url").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
    isPrimary: boolean("is_primary").notNull().default(false),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("product_images_product_idx").on(t.productId),
    index("product_images_primary_idx").on(t.productId, t.isPrimary),
  ]
);

// ─── Orders (guest-first) ────────────────────────────────────────────────────

export const orders = pgTable(
  "orders",
  {
    id: text("id").primaryKey(),
    publicId: text("public_id").notNull().unique(), // TN-YYMMDD-NNN
    status: orderStatusEnum("status").notNull().default("pending"),
    customerName: text("customer_name").notNull(),
    customerEmail: text("customer_email"),
    customerPhone: text("customer_phone").notNull(), // 07…
    area: text("area").notNull(),
    notes: text("notes"),
    subtotalKes: integer("subtotal_kes").notNull(),
    totalKes: integer("total_kes").notNull(),
    // optional link if you ever add customer accounts later
    userId: text("user_id"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("orders_status_idx").on(t.status),
    index("orders_public_id_idx").on(t.publicId),
    index("orders_created_at_idx").on(t.createdAt),
    index("orders_phone_idx").on(t.customerPhone),
  ]
);

// ─── Order items (price/title snapshot) ──────────────────────────────────────

export const orderItems = pgTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: text("product_id").references(() => products.id, {
      onDelete: "set null",
    }),
    variantId: text("variant_id").references(() => productVariants.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    size: sizeEnum("size").notNull(),
    condition: conditionEnum("condition").notNull(),
    unitPriceKes: integer("unit_price_kes").notNull(),
    quantity: integer("quantity").notNull().default(1),
  },
  (t) => [index("order_items_order_idx").on(t.orderId)]
);

// ─── Order events (timeline + notes) ─────────────────────────────────────────

export const orderEvents = pgTable(
  "order_events",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: orderStatusEnum("from_status"),
    toStatus: orderStatusEnum("to_status"),
    note: text("note"),
    actorUserId: text("actor_user_id"), // staff user.id
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [index("order_events_order_idx").on(t.orderId)]
);

// ─── Contact / inbox ─────────────────────────────────────────────────────────

export const contactMessages = pgTable(
  "contact_messages",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone"),
    body: text("body").notNull(),
    status: messageStatusEnum("status").notNull().default("new"),
    assignedToId: text("assigned_to_id"),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    index("contact_messages_status_idx").on(t.status),
    index("contact_messages_created_at_idx").on(t.createdAt),
  ]
);

// ─── Staff invites (Better Auth owns users; this is invite-only onboarding) ──

export const staffInvites = pgTable(
  "staff_invites",
  {
    id: text("id").primaryKey(),
    email: text("email").notNull(),
    role: staffInviteRoleEnum("role").notNull(),
    token: text("token").notNull().unique(),
    invitedById: text("invited_by_id").notNull(), // superadmin/admin user.id
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    acceptedAt: timestamp("accepted_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (t) => [
    uniqueIndex("staff_invites_email_pending_uidx").on(t.email),
    index("staff_invites_token_idx").on(t.token),
  ]
);

// ─── Relations (optional but useful for queries) ─────────────────────────────

export const categoriesRelations = relations(categories, ({ many }) => ({
  products: many(products),
}));

export const productsRelations = relations(products, ({ one, many }) => ({
  category: one(categories, {
    fields: [products.categoryId],
    references: [categories.id],
  }),
  variants: many(productVariants),
  images: many(productImages),
}));

export const productVariantsRelations = relations(
  productVariants,
  ({ one }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
  })
);

export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(orders, ({ many }) => ({
  items: many(orderItems),
  events: many(orderEvents),
}));

export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

export const orderEventsRelations = relations(orderEvents, ({ one }) => ({
  order: one(orders, {
    fields: [orderEvents.orderId],
    references: [orders.id],
  }),
}));