import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generatePDFReport } from "./report";
import { insertAuditSchema } from "@shared/schema";
import { z } from "zod";
import { dbManager } from "./db-manager";
import { generateAutomatedReport, type Hazard } from "./automated-report-generator";
import { normalizeHazard } from "./hazard-utils";

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

// Helper functions moved to module scope
function getEnhancedRegionalHazardData(zipCode: string) {
  const twoDigitPrefix = zipCode.substring(0, 2);

  // Enhanced regional hazard mapping
  const hazardMap: { [key: string]: any } = {
    '90': { primaryHazard: 'Earthquake', primaryRisk: 85, allHazards: [
      { type: 'Earthquake', risk: 85, severity: 'High' },
      { type: 'Wildfire', risk: 75, severity: 'High' },
      { type: 'Flood', risk: 25, severity: 'Low' }
    ]},
    '91': { primaryHazard: 'Wildfire', primaryRisk: 80, allHazards: [
      { type: 'Wildfire', risk: 80, severity: 'High' },
      { type: 'Earthquake', risk: 70, severity: 'High' },
      { type: 'Flood', risk: 20, severity: 'Low' }
    ]},
    '32': { primaryHazard: 'Hurricane', primaryRisk: 90, allHazards: [
      { type: 'Hurricane', risk: 90, severity: 'Very High' },
      { type: 'Flood', risk: 80, severity: 'High' },
      { type: 'Tornado', risk: 45, severity: 'Medium' }
    ]},
    '33': { primaryHazard: 'Hurricane', primaryRisk: 85, allHazards: [
      { type: 'Hurricane', risk: 85, severity: 'High' },
      { type: 'Flood', risk: 75, severity: 'High' },
      { type: 'Tornado', risk: 40, severity: 'Medium' }
    ]},
    '75': { primaryHazard: 'Tornado', primaryRisk: 75, allHazards: [
      { type: 'Tornado', risk: 75, severity: 'High' },
      { type: 'Flood', risk: 60, severity: 'Medium' },
      { type: 'Hurricane', risk: 55, severity: 'Medium' }
    ]},
    '77': { primaryHazard: 'Flood', primaryRisk: 70, allHazards: [
      { type: 'Flood', risk: 70, severity: 'High' },
      { type: 'Tornado', risk: 65, severity: 'Medium' },
      { type: 'Hurricane', risk: 50, severity: 'Medium' }
    ]},
    '10': { primaryHazard: 'Winter Storm', primaryRisk: 60, allHazards: [
      { type: 'Winter Storm', risk: 60, severity: 'Medium' },
      { type: 'Flood', risk: 40, severity: 'Medium' },
      { type: 'Earthquake', risk: 15, severity: 'Low' }
    ]}
  };

  return hazardMap[twoDigitPrefix] || { 
    primaryHazard: 'Variable Weather', 
    primaryRisk: 40,
    allHazards: [
      { type: 'Severe Weather', risk: 40, severity: 'Medium' },
      { type: 'Flood', risk: 30, severity: 'Low' }
    ]
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
      console.error("Payment intent creation error:", error);
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Create audit
  app.post("/api/audits", async (req, res) => {
    try {
      console.log("Received audit creation request:", req.body);
      
      const auditData = insertAuditSchema.parse(req.body);
      console.log("Parsed audit data:", auditData);
      
      const audit = await storage.createAudit(auditData);
      console.log("Created audit:", audit);
      
      res.json(audit);
    } catch (error: any) {
      console.error("Audit creation error:", error);
      console.error("Error stack:", error.stack);
      
      if (error.name === "ZodError") {
        console.error("Validation errors:", error.errors);
        return res.status(400).json({ 
          message: "Invalid audit data", 
          errors: error.errors,
          receivedData: req.body
        });
      }
      
      res.status(500).json({ 
        message: "Error creating audit: " + error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  });

  // Get audit
  app.get("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getAudit(id);

      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }

      res.json(audit);
    } catch (error: any) {
      console.error("Audit retrieval error:", error);
      res.status(500).json({ 
        message: "Error retrieving audit: " + error.message 
      });
    }
  });

  // Update audit
  app.patch("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;

      const audit = await storage.updateAudit(id, updates);

      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }

      res.json(audit);
    } catch (error: any) {
      console.error("Audit update error:", error);
      res.status(500).json({ 
        message: "Error updating audit: " + error.message 
      });
    }
  });

  // Generate PDF report
  app.get("/api/audits/:id/report", generatePDFReport);
  app.post("/api/audits/:id/generate-pdf", generatePDFReport);

  // Stripe webhook for payment confirmation
  app.post("/api/webhook", async (req, res) => {
    try {
      const event = req.body;

      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const { zipCode, primaryHazard } = paymentIntent.metadata;

        // Create audit record after successful payment
        const auditData = {
          zipCode,
          primaryHazard,
          paymentId: paymentIntent.id,
          paymentStatus: 'completed'
        };

        const audit = await storage.createAudit(auditData);
        console.log("Audit created after payment:", audit.id);
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Webhook error:", error);
      res.status(500).json({ 
        message: "Webhook error: " + error.message 
      });
    }
  });

  // Get audit by payment ID
  app.get("/api/payment/:paymentId/audit", async (req, res) => {
    try {
      const paymentId = req.params.paymentId;
      const audit = await storage.getAuditByPaymentId(paymentId);

      if (!audit) {
        return res.status(404).json({ message: "Audit not found for payment" });
      }

      res.json(audit);
    } catch (error: any) {
      console.error("Payment audit retrieval error:", error);
      res.status(500).json({ 
        message: "Error retrieving audit: " + error.message 
      });
    }
  });

  // Database cleanup endpoint (for maintenance)
  app.post("/api/cleanup-database", async (req, res) => {
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
    }
  });

  // Get automated recommendations for an audit - FIXED PATH
  app.get("/api/audits/:id/recommendations", async (req, res) => {
    try {
      const auditId = parseInt(req.params.id);
      const audit = await storage.getAudit(auditId);

      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }

      const primaryHazard = normalizeHazard(audit.primaryHazard || 'earthquake');
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

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}