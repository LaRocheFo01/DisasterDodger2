import { db } from './database';
import type { Audit, InsertAudit } from '@shared/schema';
import { audits } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const storage = {
  async createAudit(data: InsertAudit): Promise<Audit> {
    try {
      console.log('Creating audit with data:', data);

      const auditData = {
        zipCode: data.zipCode,
        primaryHazard: data.primaryHazard,
        stripePaymentId: data.paymentId || null,
        completed: data.completed || false,
      };

      const result = await db.insert(audits).values(auditData).returning();

      if (!result || result.length === 0) {
        throw new Error('Failed to create audit - no result returned');
      }

      console.log('Created audit:', result[0]);
      return result[0];
    } catch (error: any) {
      console.error('Error creating audit:', error);
      throw new Error('Failed to create audit: ' + error.message);
    }
  },

  async updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | null> {
    try {
      console.log('Updating audit:', id, updates);

      const result = await db
        .update(audits)
        .set(updates)
        .where(eq(audits.id, id))
        .returning();

      if (!result || result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error: any) {
      console.error('Error updating audit:', error);
      throw new Error('Failed to update audit: ' + error.message);
    }
  },

  async getAudit(id: number): Promise<Audit | null> {
    try {
      const result = await db
        .select()
        .from(audits)
        .where(eq(audits.id, id))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    } catch (error: any) {
      console.error('Error getting audit:', error);
      throw new Error('Failed to get audit: ' + error.message);
    }
  },

  async getAuditByPaymentId(paymentId: string): Promise<Audit | null> {
    try {
      const result = await db
        .select()
        .from(audits)
        .where(eq(audits.stripePaymentId, paymentId))
        .limit(1);

      return result.length > 0 ? result[0] : null;
    } catch (error: any) {
      console.error('Error getting audit by payment ID:', error);
      throw new Error('Failed to get audit by payment ID: ' + error.message);
    }
  },

  async getCompletedAudits(limit: number = 10): Promise<Audit[]> {
    try {
      const result = await db
        .select()
        .from(audits)
        .where(eq(audits.completed, true))
        .limit(limit);

      return result;
    } catch (error: any) {
      console.error('Error getting completed audits:', error);
      throw new Error('Failed to get completed audits: ' + error.message);
    }
  }
};