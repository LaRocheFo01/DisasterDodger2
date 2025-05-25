import { audits, type Audit, type InsertAudit } from "@shared/schema";

export interface IStorage {
  createAudit(audit: InsertAudit): Promise<Audit>;
  getAudit(id: number): Promise<Audit | undefined>;
  updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | undefined>;
  getAuditByPaymentId(paymentId: string): Promise<Audit | undefined>;
}

export class MemStorage implements IStorage {
  private audits: Map<number, Audit>;
  private currentId: number;

  constructor() {
    this.audits = new Map();
    this.currentId = 1;
  }

  async createAudit(insertAudit: InsertAudit): Promise<Audit> {
    const id = this.currentId++;
    const audit: Audit = { 
      ...insertAudit, 
      id,
      createdAt: new Date()
    };
    this.audits.set(id, audit);
    return audit;
  }

  async getAudit(id: number): Promise<Audit | undefined> {
    return this.audits.get(id);
  }

  async updateAudit(id: number, updates: Partial<Audit>): Promise<Audit | undefined> {
    const existing = this.audits.get(id);
    if (!existing) return undefined;
    
    const updated = { ...existing, ...updates };
    this.audits.set(id, updated);
    return updated;
  }

  async getAuditByPaymentId(paymentId: string): Promise<Audit | undefined> {
    return Array.from(this.audits.values()).find(
      (audit) => audit.stripePaymentId === paymentId
    );
  }
}

export const storage = new MemStorage();
