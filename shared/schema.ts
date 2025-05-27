import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull(),
  primaryHazard: text("primary_hazard").notNull(),
  
  // Section A: General Home Information
  homeType: text("home_type"),
  yearBuilt: text("year_built"),
  ownershipStatus: text("ownership_status"),
  insuredValue: text("insured_value"),
  insurancePolicies: jsonb("insurance_policies").$type<string[]>().default([]),
  previousGrants: text("previous_grants"),
  previousGrantsProgram: text("previous_grants_program"),
  
  // Comprehensive audit responses for all hazard types
  auditResponses: jsonb("audit_responses").$type<Record<string, any>>().default({}),
  
  // Metadata
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
