import { audits, type Audit, type InsertAudit } from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq } from "drizzle-orm";

export interface IStorage {
  createAudit(audit: InsertAudit): Promise<Audit>;
  getAudit(id: number): Promise<Audit | undefined>;
  updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | undefined>;
  getAuditByPaymentId(paymentId: string): Promise<Audit | undefined>;
}

// Database setup
const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

export class DatabaseStorage implements IStorage {
  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const [audit] = await db.insert(audits).values(insertAudit).returning();
    return audit;
  }

  async getAudit(id: number): Promise<Audit | undefined> {
    const [audit] = await db.select().from(audits).where(eq(audits.id, id));
    return audit;
  }

  async updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | undefined> {
    const [audit] = await db
      .update(audits)
      .set(updates)
      .where(eq(audits.id, id))
      .returning();
    return audit;
  }

  async getAuditByPaymentId(paymentId: string): Promise<Audit | undefined> {
    const [audit] = await db
      .select()
      .from(audits)
      .where(eq(audits.stripePaymentId, paymentId));
    return audit;
  }
}

export const storage = new DatabaseStorage();
