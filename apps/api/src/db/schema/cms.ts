import {
  pgTable,
  text,
  integer,
//   boolean,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { cmsPageStatusEnum, cmsPageTypeEnum } from "./enums";

/**
 * CMS only — About, Journal, landings.
 * Do not put products/orders here.
 */

export const cmsPages = pgTable(
  "cms_pages",
  {
    id: text("id").primaryKey(),
    slug: text("slug").notNull().unique(),
    type: cmsPageTypeEnum("type").notNull().default("page"),
    title: text("title").notNull(),
    excerpt: text("excerpt"),
    /** Structured body: blocks JSON (paragraph, image, drop-cap, CTA, etc.) */
    body: jsonb("body").$type<Record<string, unknown>[]>().notNull().default([]),
    coverImageUrl: text("cover_image_url"),
    coverCloudinaryPublicId: text("cover_cloudinary_public_id"),
    status: cmsPageStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    archivedAt: timestamp("archived_at", { withTimezone: true }),
    seoTitle: text("seo_title"),
    seoDescription: text("seo_description"),
    sortOrder: integer("sort_order").notNull().default(0),
    authorId: text("author_id"), // staff user.id
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("cms_pages_status_type_idx").on(t.status, t.type),
    index("cms_pages_published_at_idx").on(t.publishedAt),
  ]
);

/** Optional history for restore — keep if you want admin “revisions” */
export const cmsPageRevisions = pgTable(
  "cms_page_revisions",
  {
    id: text("id").primaryKey(),
    pageId: text("page_id")
      .notNull()
      .references(() => cmsPages.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    body: jsonb("body").$type<Record<string, unknown>[]>().notNull(),
    editedById: text("edited_by_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index("cms_page_revisions_page_idx").on(t.pageId)]
);

export const cmsPagesRelations = relations(cmsPages, ({ many }) => ({
  revisions: many(cmsPageRevisions),
}));

export const cmsPageRevisionsRelations = relations(cmsPageRevisions, ({ one }) => ({
  page: one(cmsPages, {
    fields: [cmsPageRevisions.pageId],
    references: [cmsPages.id],
  }),
}));