
import { dbManager } from "../server/db-manager";

async function main() {
  const command = process.argv[2];
  
  try {
    switch (command) {
      case "cleanup":
        console.log("Performing full database cleanup...");
        await dbManager.performFullCleanup();
        break;
        
      case "stats":
        console.log("Getting database statistics...");
        await dbManager.updateStatistics();
        break;
        
      case "remove-duplicates":
        console.log("Removing duplicate audits...");
        await dbManager.removeDuplicateAudits();
        break;
        
      case "cleanup-incomplete":
        console.log("Cleaning up incomplete audits...");
        await dbManager.cleanupIncompleteAudits();
        break;
        
      case "optimize":
        console.log("Optimizing database...");
        await dbManager.optimizeDatabase();
        break;
        
      default:
        console.log("Available commands:");
        console.log("  cleanup - Perform full database cleanup");
        console.log("  stats - Show database statistics");
        console.log("  remove-duplicates - Remove duplicate audits");
        console.log("  cleanup-incomplete - Remove incomplete audits");
        console.log("  optimize - Optimize database performance");
        break;
    }
  } catch (error) {
    console.error("Database operation failed:", error);
    process.exit(1);
  }
  
  process.exit(0);
}

main();
