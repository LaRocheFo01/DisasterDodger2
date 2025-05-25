import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull(),
  primaryHazard: text("primary_hazard").notNull(),
  homeType: text("home_type"),
  yearBuilt: text("year_built"),
  foundationType: text("foundation_type"),
  stories: text("stories"),
  roofMaterial: text("roof_material"),
  safetySystems: jsonb("safety_systems").$type<string[]>().default([]),
  waterStorage: text("water_storage"),
  foodStorage: text("food_storage"),
  backupPower: text("backup_power"),
  photosUploaded: integer("photos_uploaded").default(0),
  stripePaymentId: text("stripe_payment_id"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAuditSchema = createInsertSchema(audits).omit({
  id: true,
  createdAt: true,
});

export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type Audit = typeof audits.$inferSelect;
