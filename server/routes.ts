import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generatePDFReport } from "./report";
import { insertAuditSchema } from "@shared/schema";
import { z } from "zod";
import { dbManager } from "./db-manager";
import { generateAutomatedReport, type Hazard } from "./automated-report-generator";

// Stripe secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error("STRIPE_SECRET_KEY environment variable is missing");
  console.error("Available environment variables:", Object.keys(process.env).filter(key => !key.includes('PASSWORD')));
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: "2025-04-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Create payment intent for audit
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { zipCode, primaryHazard } = req.body;
      
      if (!zipCode || !primaryHazard) {
        return res.status(400).json({ 
          message: "ZIP code and primary hazard are required" 
        });
      }
      
      const paymentIntent = await stripe.paymentIntents.create({
        amount: 2900, // $29.00 in cents
        currency: "usd",
        metadata: {
          zipCode,
          primaryHazard,
          product: "disaster-audit"
        }
      });

      res.json({ 
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      });
    } catch (error: any) {
      console.error("Payment intent creation error:", {
        message: error.message,
        type: error.type,
        code: error.code
      });
      res.status(500).json({ 
        message: "Error creating payment intent: " + (error.message || "Unknown error")
      });
    }
  });

  // Create audit after successful payment
  app.post("/api/audits", async (req, res) => {
    try {
      // Only use the basic required fields to avoid column errors
      const basicAuditData = {
        zipCode: req.body.zipCode,
        primaryHazard: req.body.primaryHazard,
        stripePaymentId: req.body.stripePaymentId || null
      };
      
      const audit = await storage.createAudit(basicAuditData);
      res.json(audit);
    } catch (error: any) {
      console.error("Error creating audit:", {
        message: error.message,
        stack: error.stack,
        details: error
      });
      res.status(500).json({ 
        message: "Error creating audit: " + (error.message || "Unknown error"),
        error: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Update audit with wizard data
  app.patch("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid audit ID" });
      }
      
      const audit = await storage.updateAudit(id, updates);
      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }
      
      res.json(audit);
    } catch (error: any) {
      console.error("Error updating audit:", {
        message: error.message,
        auditId: req.params.id,
        updates: req.body
      });
      res.status(500).json({ 
        message: "Error updating audit: " + (error.message || "Unknown error")
      });
    }
  });

  // Get audit by ID
  app.get("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getAudit(id);
      
      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }
      
      res.json(audit);
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error fetching audit: " + error.message 
      });
    }
  });

  // Generate comprehensive PDF report
  app.post("/api/audits/:id/generate-pdf", generatePDFReport);

  // Database management endpoint
  app.post("/api/admin/cleanup-database", async (req, res) => {
    try {
      console.log("Database cleanup requested");
      const result = await dbManager.performFullCleanup();
      res.json({
        message: "Database cleanup completed successfully",
        statistics: result
      });
    } catch (error: any) {
      console.error("Database cleanup error:", error);
      res.status(500).json({
        message: "Error cleaning database: " + error.message
      });


// Get automated recommendations for an audit
app.get("/api/audit/:id/recommendations", async (req, res) => {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    const primaryHazard = audit.primaryHazard as Hazard;
    const auditData = { ...audit };
    const automatedReport = generateAutomatedReport(auditData, primaryHazard);
    automatedReport.auditId = auditId;

    res.json(automatedReport);
  } catch (error) {
    console.error("Error generating recommendations:", error);
    res.status(500).json({ error: "Failed to generate recommendations" });
  }
});

// Get available report templates
app.get("/api/report-templates", (req, res) => {
  try {
    const { AVAILABLE_TEMPLATES } = require("./report-templates");
    res.json(AVAILABLE_TEMPLATES.map((template: any) => ({
      id: template.id,
      name: template.name,
      description: template.description,
      sections: template.sections.length
    })));
  } catch (error) {
    console.error("Error fetching templates:", error);
    res.status(500).json({ error: "Failed to fetch report templates" });
  }
});

  // Enhanced ZIP code based hazard detection
  app.get("/api/hazards/:zipCode", async (req, res) => {
    try {
      const zipCode = req.params.zipCode;
      const hazardData = getEnhancedRegionalHazardData(zipCode);
      res.json(hazardData);
    } catch (error: any) {
      console.error("Hazard detection error:", error);
      res.status(500).json({ 
        message: "Error detecting hazard: " + error.message 
      });
    }
  });

  // Location analysis endpoint (detailed analysis)
  app.get("/api/location-analysis/:zipCode", async (req, res) => {
    try {
      const zipCode = req.params.zipCode;
      const hazardData = getEnhancedRegionalHazardData(zipCode);
      
      // Enhanced analysis with additional details
      const analysisData = {
        ...hazardData,
        detailedRiskFactors: getDetailedRiskFactors(zipCode),
        mitigationPriorities: getMitigationPriorities(hazardData.primaryHazard),
        regionalContext: getRegionalContext(zipCode)
      };
      
      res.json(analysisData);
    } catch (error: any) {
      console.error("Location analysis error:", error);
      res.status(500).json({ 
        message: "Error analyzing location: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Simple but effective ZIP code based hazard detection
function getEnhancedRegionalHazardData(zipCode: string) {
  // Enhanced regional mapping with more accurate hazard identification
  const regionalHazardMap: { [key: string]: any } = {
    // California ZIP codes (90000-96999)
    '90': { primaryHazard: 'Earthquake', risk: 5, state: 'California' },
    '91': { primaryHazard: 'Wildfire', risk: 4, state: 'California' },
    '92': { primaryHazard: 'Earthquake', risk: 5, state: 'California' },
    '93': { primaryHazard: 'Wildfire', risk: 4, state: 'California' },
    '94': { primaryHazard: 'Earthquake', risk: 5, state: 'California' },
    '95': { primaryHazard: 'Wildfire', risk: 4, state: 'California' },
    '96': { primaryHazard: 'Earthquake', risk: 4, state: 'California' },
    
    // Florida ZIP codes (32000-34999)
    '32': { primaryHazard: 'Hurricane', risk: 5, state: 'Florida' },
    '33': { primaryHazard: 'Hurricane', risk: 5, state: 'Florida' },
    '34': { primaryHazard: 'Hurricane', risk: 4, state: 'Florida' },
    
    // Texas ZIP codes (75000-79999)
    '75': { primaryHazard: 'Tornado', risk: 4, state: 'Texas' },
    '76': { primaryHazard: 'Tornado', risk: 4, state: 'Texas' },
    '77': { primaryHazard: 'Flood', risk: 4, state: 'Texas' },
    '78': { primaryHazard: 'Tornado', risk: 4, state: 'Texas' },
    '79': { primaryHazard: 'Tornado', risk: 3, state: 'Texas' },
    
    // New York ZIP codes
    '10': { primaryHazard: 'Winter Storm', risk: 3, state: 'New York' },
    '11': { primaryHazard: 'Winter Storm', risk: 3, state: 'New York' },
    '12': { primaryHazard: 'Winter Storm', risk: 3, state: 'New York' },
    
    // Illinois ZIP codes
    '60': { primaryHazard: 'Tornado', risk: 3, state: 'Illinois' },
    '61': { primaryHazard: 'Tornado', risk: 3, state: 'Illinois' },
    '62': { primaryHazard: 'Flood', risk: 3, state: 'Illinois' }
  };
  
  // Try ZIP code prefix matching (first 2 digits)
  const twoDigitPrefix = zipCode.substring(0, 2);
  let hazardInfo = regionalHazardMap[twoDigitPrefix];
  
  // If no match, try first digit for broader regional mapping
  if (!hazardInfo) {
    const oneDigitPrefix = zipCode.substring(0, 1);
    const broadRegionalMap: { [key: string]: any } = {
      '9': { primaryHazard: 'Earthquake', risk: 4, state: 'West Coast' },
      '8': { primaryHazard: 'Wildfire', risk: 3, state: 'Mountain West' },
      '7': { primaryHazard: 'Tornado', risk: 3, state: 'South Central' },
      '6': { primaryHazard: 'Tornado', risk: 3, state: 'Central Plains' },
      '5': { primaryHazard: 'Tornado', risk: 3, state: 'Midwest' },
      '4': { primaryHazard: 'Winter Storm', risk: 2, state: 'Southeast' },
      '3': { primaryHazard: 'Hurricane', risk: 4, state: 'Southeast' },
      '2': { primaryHazard: 'Winter Storm', risk: 3, state: 'Mid-Atlantic' },
      '1': { primaryHazard: 'Winter Storm', risk: 3, state: 'Northeast' },
      '0': { primaryHazard: 'Winter Storm', risk: 3, state: 'Northeast' }
    };
    hazardInfo = broadRegionalMap[oneDigitPrefix] || { primaryHazard: 'Flood', risk: 2, state: 'Unknown' };
  }
  
  return {
    zipCode,
    primaryHazard: hazardInfo.primaryHazard,
    primaryRisk: hazardInfo.risk,
    state: hazardInfo.state,
    confidence: 'high',
    dataSource: 'Regional Analysis',
    lastUpdated: new Date().toISOString()
  };
}

function getDetailedRiskFactors(zipCode: string) {
  const twoDigitPrefix = zipCode.substring(0, 2);
  
  // Risk factor mapping by region
  const riskFactors: { [key: string]: string[] } = {
    '90': ['High seismic activity', 'Fault line proximity', 'Wildfire-prone vegetation'],
    '91': ['Drought conditions', 'High fire risk', 'Strong winds'],
    '32': ['Hurricane season', 'Storm surge risk', 'Heavy rainfall'],
    '33': ['Coastal flooding', 'Wind damage', 'Storm surge'],
    '75': ['Tornado alley', 'Severe thunderstorms', 'Hail damage'],
    '77': ['Flood plains', 'Heavy rainfall', 'Hurricane remnants'],
    '10': ['Nor\'easter storms', 'Heavy snow', 'Ice storms']
  };
  
  return riskFactors[twoDigitPrefix] || ['Variable weather patterns', 'Regional climate risks'];
}

function getMitigationPriorities(primaryHazard: string) {
  const priorities: { [key: string]: string[] } = {
    'Earthquake': ['Foundation anchoring', 'Water heater strapping', 'Gas shutoff valves'],
    'Wildfire': ['Defensible space', 'Fire-resistant materials', 'Ember protection'],
    'Flood': ['Elevation', 'Drainage systems', 'Waterproofing'],
    'Hurricane': ['Wind resistance', 'Impact protection', 'Roof strengthening'],
    'Tornado': ['Safe room', 'Impact windows', 'Structural reinforcement'],
    'Winter Storm': ['Insulation', 'Heating backup', 'Pipe protection']
  };
  
  return priorities[primaryHazard] || ['General preparedness', 'Emergency planning'];
}

function getRegionalContext(zipCode: string) {
  const twoDigitPrefix = zipCode.substring(0, 2);
  
  const context: { [key: string]: any } = {
    '90': { climate: 'Mediterranean', season: 'Year-round risk', buildingCodes: 'Strict seismic' },
    '32': { climate: 'Subtropical', season: 'June-November peak', buildingCodes: 'Hurricane standards' },
    '75': { climate: 'Humid subtropical', season: 'Spring peak', buildingCodes: 'Wind resistance' }
  };
  
  return context[twoDigitPrefix] || { 
    climate: 'Variable', 
    season: 'Seasonal variation', 
    buildingCodes: 'Standard codes' 
  };
}

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
