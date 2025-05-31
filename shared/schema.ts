// shared/schema.ts
import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export const audits = pgTable("audits", {
  id: serial("id").primaryKey(),
  zipCode: text("zip_code").notNull(),
  primaryHazard: text("primary_hazard").notNull(),
  
  // Basic home info
  homeType: text("home_type"),
  yearBuilt: text("year_built"),
  foundationType: text("foundation_type"),
  stories: text("stories"),
  roofMaterial: text("roof_material"),
  
  // Safety systems
  safetySystems: jsonb("safety_systems").$type<string[]>().default([]),
  waterStorage: text("water_storage"),
  foodStorage: text("food_storage"),
  backupPower: text("backup_power"),
  
  // Earthquake preparedness
  waterHeaterSecurity: text("water_heater_security"),
  gasShutoffPlan: text("gas_shutoff_plan"),
  cabinetLatches: text("cabinet_latches"),
  electronicsStability: text("electronics_stability"),
  foundationWork: text("foundation_work"),
  
  // Wildfire preparedness
  defensibleSpaceWidth: text("defensible_space_width"),
  ventProtection: text("vent_protection"),
  wallCladding: text("wall_cladding"),
  
  // Flood preparedness
  equipmentElevation: text("equipment_elevation"),
  backflowPrevention: text("backflow_prevention"),
  floodBarriers: text("flood_barriers"),
  sumpPump: text("sump_pump"),
  
  // Hurricane preparedness
  windowDoorProtection: text("window_door_protection"),
  roofInspection: text("roof_inspection"),
  garageDoorUpgrade: text("garage_door_upgrade"),
  roofCovering: text("roof_covering"),
  
  // Meta fields
  photosUploaded: integer("photos_uploaded").default(0),
  stripePaymentId: text("stripe_payment_id"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

export type Audit = typeof audits.$inferSelect;
export type InsertAudit = typeof audits.$inferInsert;

export const insertAuditSchema = createInsertSchema(audits).omit({
  id: true,
  createdAt: true
});