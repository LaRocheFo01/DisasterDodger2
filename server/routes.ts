import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertAuditSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
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

  // Create audit after successful payment
  app.post("/api/audits", async (req, res) => {
    try {
      const validatedData = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(validatedData);
      res.json(audit);
    } catch (error: any) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      } else {
        res.status(500).json({ 
          message: "Error creating audit: " + error.message 
        });
      }
    }
  });

  // Update audit with wizard data
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
      res.status(500).json({ 
        message: "Error updating audit: " + error.message 
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

  // Generate PDF report (mock for now)
  app.post("/api/audits/:id/generate-pdf", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getAudit(id);
      
      if (!audit) {
        return res.status(404).json({ message: "Audit not found" });
      }

      // Mark audit as completed
      await storage.updateAudit(id, { completed: true });

      // Mock PDF generation - in production, integrate with PDF service
      const pdfData = {
        filename: `Disaster_Dodger_Audit_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`,
        downloadUrl: `/api/audits/${id}/download-pdf`,
        generated: true
      };

      res.json(pdfData);
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error generating PDF: " + error.message 
      });
    }
  });

  // Detect hazard by ZIP code (mock implementation)
  app.get("/api/hazards/:zipCode", async (req, res) => {
    try {
      const zipCode = req.params.zipCode;
      
      // Mock hazard detection based on ZIP code
      const hazardMap: { [key: string]: string } = {
        "90210": "Earthquake",
        "33101": "Hurricane", 
        "73301": "Tornado",
        "97301": "Wildfire",
        "10001": "Winter Storm"
      };

      // Default hazard detection logic
      const firstDigit = parseInt(zipCode[0]);
      const hazards = ["Earthquake", "Hurricane", "Tornado", "Flood", "Wildfire", "Winter Storm"];
      const primaryHazard = hazardMap[zipCode] || hazards[firstDigit % hazards.length];

      res.json({ 
        zipCode,
        primaryHazard,
        riskLevel: Math.floor(Math.random() * 5) + 1 // 1-5 scale
      });
    } catch (error: any) {
      res.status(500).json({ 
        message: "Error detecting hazard: " + error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
