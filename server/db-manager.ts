
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { audits } from "@shared/schema";
import { eq, sql } from "drizzle-orm";

const sqlConnection = neon(process.env.DATABASE_URL!);
const db = drizzle(sqlConnection);

export class DatabaseManager {
  // Clean up incomplete or test audits
  async cleanupIncompleteAudits() {
    try {
      console.log("Cleaning up incomplete audits...");
      
      // Delete audits without payment ID that are older than 24 hours
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      
      const result = await db
        .delete(audits)
        .where(
          sql`${audits.stripePaymentId} IS NULL AND ${audits.createdAt} < ${oneDayAgo}`
        );
      
      console.log(`Cleaned up incomplete audits`);
      return result;
    } catch (error) {
      console.error("Error cleaning up incomplete audits:", error);
      throw error;
    }
  }

  // Remove duplicate audits (same ZIP code and payment ID)
  async removeDuplicateAudits() {
    try {
      console.log("Removing duplicate audits...");
      
      // Find duplicates and keep only the latest one
      const duplicates = await db.execute(sql`
        WITH duplicates AS (
          SELECT 
            id,
            ROW_NUMBER() OVER (
              PARTITION BY zip_code, stripe_payment_id 
              ORDER BY created_at DESC
            ) as rn
          FROM ${audits}
          WHERE stripe_payment_id IS NOT NULL
        )
        DELETE FROM ${audits}
        WHERE id IN (
          SELECT id FROM duplicates WHERE rn > 1
        )
      `);
      
      console.log("Removed duplicate audits");
      return duplicates;
    } catch (error) {
      console.error("Error removing duplicates:", error);
      throw error;
    }
  }

  // Update database statistics
  async updateStatistics() {
    try {
      console.log("Updating database statistics...");
      
      const stats = await db.execute(sql`
        SELECT 
          COUNT(*) as total_audits,
          COUNT(CASE WHEN completed = true THEN 1 END) as completed_audits,
          COUNT(CASE WHEN stripe_payment_id IS NOT NULL THEN 1 END) as paid_audits,
          COUNT(DISTINCT zip_code) as unique_zip_codes,
          COUNT(DISTINCT primary_hazard) as unique_hazards
        FROM ${audits}
      `);
      
      console.log("Database statistics:", stats.rows[0]);
      return stats.rows[0];
    } catch (error) {
      console.error("Error getting statistics:", error);
      throw error;
    }
  }

  // Vacuum and analyze database (PostgreSQL specific)
  async optimizeDatabase() {
    try {
      console.log("Optimizing database...");
      
      // Analyze tables for query optimization
      await db.execute(sql`ANALYZE ${audits}`);
      
      console.log("Database optimization complete");
    } catch (error) {
      console.error("Error optimizing database:", error);
      throw error;
    }
  }

  // Complete database cleanup and optimization
  async performFullCleanup() {
    try {
      console.log("Starting full database cleanup...");
      
      const stats = await this.updateStatistics();
      console.log("Before cleanup:", stats);
      
      await this.cleanupIncompleteAudits();
      await this.removeDuplicateAudits();
      await this.optimizeDatabase();
      
      const newStats = await this.updateStatistics();
      console.log("After cleanup:", newStats);
      
      return {
        before: stats,
        after: newStats
      };
    } catch (error) {
      console.error("Error during full cleanup:", error);
      throw error;
    }
  }
}

export const dbManager = new DatabaseManager();
