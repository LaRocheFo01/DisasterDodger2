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

  // Individual question responses
  homeTypeResponse: text("home_type_response"),
  yearBuiltResponse: text("year_built_response"),
  ownershipStatusResponse: text("ownership_status_response"),
  insuredValueResponse: text("insured_value_response"),
  insurancePoliciesResponse: jsonb("insurance_policies_response").$type<string[]>().default([]),
  previousGrantsResponse: text("previous_grants_response"),
  previousGrantsProgramResponse: text("previous_grants_program_response"),

  // Section B: Earthquake Readiness
  waterHeaterSecurity: text("water_heater_security"),
  anchoredItems: jsonb("anchored_items").$type<string[]>().default([]),
  cabinetLatches: text("cabinet_latches"),
  electronicsStability: text("electronics_stability"),
  gasShutoffPlan: text("gas_shutoff_plan"),
  chimneyInspection: text("chimney_inspection"),
  garageRetrofit: text("garage_retrofit"),
  applianceConnectors: text("appliance_connectors"),
  woodStoveAnchor: text("wood_stove_anchor"),
  earthquakeDrill: text("earthquake_drill"),
  emergencyKit: jsonb("emergency_kit").$type<string[]>().default([]),
  hangingDecor: text("hanging_decor"),
  foundationWork: text("foundation_work"),
  ceilingFixtures: text("ceiling_fixtures"),
  roomByRoomChecklist: text("room_by_room_checklist"),

  // Section C: Hurricane & High-Wind Protection
  roofInspection: text("roof_inspection"),
  atticVents: text("attic_vents"),
  roofCovering: text("roof_covering"),
  windowDoorProtection: text("window_door_protection"),
  garageDoorUpgrade: text("garage_door_upgrade"),
  gableEndBracing: text("gable_end_bracing"),
  soffitOverhangs: text("soffit_overhangs"),
  chimneyTies: text("chimney_ties"),
  attachedStructures: text("attached_structures"),
  continuousLoadPath: text("continuous_load_path"),
  sidingMaterial: text("siding_material"),
  retrofitEvaluation: text("retrofit_evaluation"),
  gutterAnchors: text("gutter_anchors"),
  retrofitLevel: text("retrofit_level"),
  completedMeasures: jsonb("completed_measures").$type<string[]>().default([]),

  // Section D: Wildfire Hardening
  defensibleSpaceWidth: text("defensible_space_width"),
  roofMaterial: text("roof_material"),
  emberBarriers: text("ember_barriers"),
  underlaymentType: text("underlayment_type"),
  ventProtection: text("vent_protection"),
  crawlspaceVents: jsonb("crawlspace_vents").$type<string[]>().default([]),
  wallCladding: text("wall_cladding"),
  vegetationSpacing: text("vegetation_spacing"),
  outbuildingDistance: text("outbuilding_distance"),
  patioFurniturePlan: text("patio_furniture_plan"),
  gutterGuards: text("gutter_guards"),
  windowGlazing: text("window_glazing"),
  entryDoorRating: text("entry_door_rating"),
  siteOrientation: text("site_orientation"),
  underElevationFinish: text("under_elevation_finish"),

  // Section E: Flood Mitigation
  equipmentElevation: text("equipment_elevation"),
  floodBarriers: text("flood_barriers"),
  backflowPrevention: text("backflow_prevention"),
  appliancePlatforms: text("appliance_platforms"),
  houseWrapSeal: text("house_wrap_seal"),
  automaticFloodVents: text("automatic_flood_vents"),
  ventPlacement: text("vent_placement"),
  sumpPump: text("sump_pump"),
  fuelTankAnchoring: text("fuel_tank_anchoring"),
  floodResistantMaterials: text("flood_resistant_materials"),
  underSlabDrainage: text("under_slab_drainage"),
  electricalLocation: text("electrical_location"),
  landscapeSwales: text("landscape_swales"),
  floodShields: text("flood_shields"),
  perimeterDrainage: text("perimeter_drainage"),

  // Legacy comprehensive responses (for backward compatibility)
  auditResponses: jsonb("audit_responses").$type<Record<string, any>>().default({}),

  // Metadata
  photosUploaded: integer("photos_uploaded").default(0),
  stripePaymentId: text("stripe_payment_id"),
  completed: boolean("completed").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const emailSignups = pgTable("email_signups", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  downloadedKit: boolean("downloaded_kit").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertEmailSignupSchema = createInsertSchema(emailSignups).omit({
  id: true,
  createdAt: true,
});

export type InsertEmailSignup = z.infer<typeof insertEmailSignupSchema>;
export type EmailSignup = typeof emailSignups.$inferSelect;

export const insertAuditSchema = z.object({
  zipCode: z.string().min(5).max(5),
  primaryHazard: z.string(),
  status: z.string().optional(),
  paymentId: z.string().optional(),
  paymentStatus: z.string().optional(),
  completed: z.boolean().optional().default(false),
});

export type InsertAudit = z.infer<typeof insertAuditSchema>;
export type Audit = typeof audits.$inferSelect;