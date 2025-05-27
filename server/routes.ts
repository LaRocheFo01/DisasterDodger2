import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generatePDFReport } from "./report";
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

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
      res.status(500).json({ 
        message: "Error creating payment intent: " + error.message 
      });
    }
  });

  // Create audit with pure SQL - bypassing old schema conflicts
  app.post("/api/audits", async (req, res) => {
    try {
      console.log("Creating audit with data:", req.body);
      
      // Direct PostgreSQL insert with the correct column names
      const client = await sql`SELECT 1`; // Test connection
      
      const result = await sql`
        INSERT INTO audits (zip, hazard) 
        VALUES (${req.body.zipCode}, ${req.body.primaryHazard}) 
        RETURNING id, zip, hazard, created_at
      `;
      
      console.log("Audit created successfully:", result[0]);
      res.json(result[0]);
    } catch (error: any) {
      console.error("Error creating audit:", error);
      res.status(500).json({ 
        message: "Error creating audit: " + error.message 
      });
    }
  });

  // Save questionnaire responses to the relational database
  app.patch("/api/audits/:id", async (req, res) => {
    try {
      const auditId = parseInt(req.params.id);
      const { questionnaireResponses } = req.body;
      
      console.log("Saving questionnaire responses for audit:", auditId);
      
      if (questionnaireResponses) {
        // Save each question-answer pair to the answers table
        for (const [questionKey, answer] of Object.entries(questionnaireResponses)) {
          if (answer) {
            await sql`
              INSERT INTO answers (audit_id, question_id, answer_text) 
              VALUES (${auditId}, ${questionKey}, ${answer as string})
              ON CONFLICT DO NOTHING
            `;
          }
        }
      }
      
      // Return the audit data
      const auditResult = await sql`
        SELECT * FROM audits WHERE id = ${auditId}
      `;
      
      res.json(auditResult[0]);
    } catch (error: any) {
      console.error("Error saving responses:", error);
      res.status(500).json({ 
        message: "Error saving responses: " + error.message 
      });
    }
  });

  // Get audit by ID with responses
  app.get("/api/audits/:id", async (req, res) => {
    try {
      const auditId = parseInt(req.params.id);
      
      // Get audit data with proper field mapping
      const auditResult = await sql`
        SELECT id, zip as zipCode, hazard as primaryHazard, created_at 
        FROM audits WHERE id = ${auditId}
      `;
      
      if (auditResult.length === 0) {
        return res.status(404).json({ message: "Audit not found" });
      }
      
      const audit = auditResult[0];
      
      // Get all responses for this audit
      const responsesResult = await sql`
        SELECT question_id, answer_text 
        FROM answers 
        WHERE audit_id = ${auditId}
      `;
      
      // Add responses to audit object
      audit.questionnaireResponses = {};
      responsesResult.forEach(row => {
        audit.questionnaireResponses[row.question_id] = row.answer_text;
      });
      
      res.json(audit);
    } catch (error: any) {
      console.error("Error fetching audit:", error);
      res.status(500).json({ 
        message: "Error fetching audit: " + error.message 
      });
    }
  });

  // Generate comprehensive PDF report
  app.post("/api/audits/:id/generate-pdf", generatePDFReport);

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
