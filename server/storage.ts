import { db } from './database';
import type { Audit, InsertAudit } from '@shared/schema';

// Field mapping between camelCase (JS) and snake_case (DB)
const fieldMapping = {
  // Basic fields
  zipCode: 'zip_code',
  primaryHazard: 'primary_hazard',
  stripePaymentId: 'stripe_payment_id',
  homeType: 'home_type',
  yearBuilt: 'year_built',
  ownershipStatus: 'ownership_status',
  insuredValue: 'insured_value',
  insurancePolicies: 'insurance_policies',
  previousGrants: 'previous_grants',

  // Earthquake fields
  foundationWork: 'foundation_work',
  waterHeaterSecurity: 'water_heater_security',
  chimneyInspection: 'chimney_inspection',
  garageRetrofit: 'garage_retrofit',

  // Wind fields
  roofInspection: 'roof_inspection',
  windowDoorProtection: 'window_door_protection',
  continuousLoadPath: 'continuous_load_path',

  // Flood fields
  equipmentElevation: 'equipment_elevation',
  automaticFloodVents: 'automatic_flood_vents',
  appliancePlatforms: 'appliance_platforms',

  // Wildfire fields
  roofMaterial: 'roof_material',
  defensibleSpaceWidth: 'defensible_space_width',
  underElevationFinish: 'under_elevation_finish',

  // Additional fields
  recentUpgrades: 'recent_upgrades',
  insuranceClaims: 'insurance_claims',
  emergencyKit: 'emergency_kit',
  evacuationPlan: 'evacuation_plan',

  // Metadata
  userAgent: 'user_agent',
  ipAddress: 'ip_address',
  assessmentDuration: 'assessment_duration',
  createdAt: 'created_at'
};

// Convert JS object to DB format
function toDbFormat(jsObject: any): any {
  const dbObject: any = {};
  for (const [jsKey, value] of Object.entries(jsObject)) {
    const dbKey = fieldMapping[jsKey as keyof typeof fieldMapping] || jsKey;
    dbObject[dbKey] = value;
  }
  return dbObject;
}

// Convert DB object to JS format
function fromDbFormat(dbObject: any): any {
  const jsObject: any = {};
  const reverseMapping = Object.entries(fieldMapping).reduce((acc, [js, db]) => {
    acc[db] = js;
    return acc;
  }, {} as any);

  for (const [dbKey, value] of Object.entries(dbObject)) {
    const jsKey = reverseMapping[dbKey] || dbKey;
    jsObject[jsKey] = value;
  }
  return jsObject;
}

export const storage = {
  async createAudit(data: InsertAudit): Promise<Audit> {
    try {
      const dbData = toDbFormat(data);

      const result = await db.run(
        `INSERT INTO audits (
          zip_code, primary_hazard, stripe_payment_id, 
          home_type, year_built, ownership_status, 
          insured_value, insurance_policies, previous_grants
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          dbData.zip_code || null,
          dbData.primary_hazard || null,
          dbData.stripe_payment_id || null,
          dbData.home_type || null,
          dbData.year_built || null,
          dbData.ownership_status || null,
          dbData.insured_value || null,
          dbData.insurance_policies || null,
          dbData.previous_grants || null
        ]
      );

      const audit = await db.get(
        'SELECT * FROM audits WHERE id = ?',
        [result.lastID]
      );

      return fromDbFormat(audit);
    } catch (error) {
      console.error('Error creating audit:', error);
      throw new Error('Failed to create audit: ' + error.message);
    }
  },

  async updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | null> {
    try {
      const dbUpdates = toDbFormat(updates);

      // Build dynamic UPDATE query
      const updateFields = Object.keys(dbUpdates)
        .filter(key => key !== 'id' && key !== 'created_at')
        .map(key => `${key} = ?`);

      if (updateFields.length === 0) {
        return this.getAudit(id);
      }

      const values = Object.keys(dbUpdates)
        .filter(key => key !== 'id' && key !== 'created_at')
        .map(key => dbUpdates[key]);

      values.push(id);

      await db.run(
        `UPDATE audits SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      return this.getAudit(id);
    } catch (error) {
      console.error('Error updating audit:', error);
      throw new Error('Failed to update audit: ' + error.message);
    }
  },

  async getAudit(id: number): Promise<Audit | null> {
    try {
      const audit = await db.get(
        'SELECT * FROM audits WHERE id = ?',
        [id]
      );

      return audit ? fromDbFormat(audit) : null;
    } catch (error) {
      console.error('Error getting audit:', error);
      throw new Error('Failed to get audit: ' + error.message);
    }
  },

  async getAuditByPaymentId(paymentId: string): Promise<Audit | null> {
    try {
      const audit = await db.get(
        'SELECT * FROM audits WHERE stripe_payment_id = ?',
        [paymentId]
      );

      return audit ? fromDbFormat(audit) : null;
    } catch (error) {
      console.error('Error getting audit by payment ID:', error);
      throw new Error('Failed to get audit by payment ID: ' + error.message);
    }
  },

  async getCompletedAudits(limit: number = 10): Promise<Audit[]> {
    try {
      const audits = await db.all(
        'SELECT * FROM audits WHERE completed = 1 ORDER BY created_at DESC LIMIT ?',
        [limit]
      );

      return audits.map(fromDbFormat);
    } catch (error) {
      console.error('Error getting completed audits:', error);
      throw new Error('Failed to get completed audits: ' + error.message);
    }
  }
};