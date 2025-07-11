import { db } from './database';
import type { Audit, InsertAudit, EmailSignup, InsertEmailSignup } from '@shared/schema';
import { audits, emailSignups } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const storage = {
  async createAudit(data: InsertAudit): Promise<Audit> {
    try {
      console.log("Storage: Creating audit with data:", data);
      const auditData = {
        zipCode: data.zipCode,
        primaryHazard: data.primaryHazard,
        stripePaymentId: data.paymentId || null,
        completed: data.completed || false,
      };
      const result = await db.insert(audits).values(auditData).returning();
      console.log("Storage: Audit created:", result[0]);
      return result[0];
    } catch (error: any) {
      console.error("Storage: Create audit error:", error);
      throw new Error('Failed to create audit: ' + error.message);
    }
  },

  async updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | null> {
    try {
      console.log('Updating audit:', id, updates);

      // Filter out undefined values and handle nested objects
      const filteredUpdates: any = {};
      for (const [key, value] of Object.entries(updates)) {
        if (value !== undefined) {
          filteredUpdates[key] = value;
        }
      }

      if (Object.keys(filteredUpdates).length === 0) {
        console.log('No valid updates provided');
        return await this.getAudit(id);
      }

      const result = await db
        .update(audits)
        .set(filteredUpdates)
        .where(eq(audits.id, id))
        .returning();

      if (!result || result.length === 0) {
        console.log('No audit found with ID:', id);
        return null;
      }

      console.log('Audit updated successfully:', result[0]);
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
  },

  async createEmailSignup(data: InsertEmailSignup): Promise<EmailSignup> {
    try {
      console.log("Storage: Creating email signup with data:", data);
      const result = await db.insert(emailSignups).values(data).returning();
      console.log("Storage: Email signup created:", result[0]);
      return result[0];
    } catch (error: any) {
      console.error("Storage: Create email signup error:", error);
      throw new Error('Failed to create email signup: ' + error.message);
    }
  },

  async getEmailSignup(email: string): Promise<EmailSignup | null> {
    try {
      const result = await db
        .select()
        .from(emailSignups)
        .where(eq(emailSignups.email, email))
        .limit(1);
      
      return result[0] || null;
    } catch (error: any) {
      console.error('Error getting email signup:', error);
      throw new Error('Failed to get email signup: ' + error.message);
    }
  },

  async updateEmailSignup(email: string, updates: Partial<EmailSignup>): Promise<EmailSignup | null> {
    try {
      const result = await db
        .update(emailSignups)
        .set(updates)
        .where(eq(emailSignups.email, email))
        .returning();
      
      return result[0] || null;
    } catch (error: any) {
      console.error('Error updating email signup:', error);
      throw new Error('Failed to update email signup: ' + error.message);
    }
  }
};