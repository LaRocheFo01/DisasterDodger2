import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generatePDFReport } from "./report";
import { insertAuditSchema } from "@shared/schema";
import { z } from "zod";
import { dbManager } from "./db-manager";
import { generateAutomatedReport, type Hazard } from "./automated-report-generator";
import { callDeepseek } from "./deepseek-service";
import { generatePDFFromHTML } from "./pdf-generator";
import axios from 'axios';

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/api/hello", async (req, res) => {
    res.send({ message: "Hello from the server!" });
  });

  app.post("/api/upload", async (req, res) => {
    try {
      // File upload functionality - implement as needed
      const files = req.files || [];
      console.log("files", files);

      return res.status(200).json({ message: "Files uploaded successfully", files });
    } catch (e: any) {
      console.error("upload err", e);
      return res
        .status(500)
        .send({ message: "Failed to upload files", error: e.message });
    }
  });

  app.get("/api/audits", async (req, res) => {
    try {
      const audits = await storage.getCompletedAudits(50);
      return res.status(200).json(audits);
    } catch (e: any) {
      console.error("get audits err", e);
      return res
        .status(500)
        .send({ message: "Failed to get audits", error: e.message });
    }
  });

  app.get("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const audit = await storage.getAudit(id);
      if (!audit) {
        return res.status(404).send({ message: "Audit not found" });
      }
      return res.status(200).json(audit);
    } catch (e: any) {
      console.error("get audit err", e);
      return res
        .status(500)
        .send({ message: "Failed to get audit", error: e.message });
    }
  });

  app.post("/api/audits", async (req, res) => {
    try {
      const body = insertAuditSchema.parse(req.body);
      const audit = await storage.createAudit(body);
      return res.status(201).json(audit);
    } catch (e: any) {
      console.error("create audit err", e);
      return res
        .status(500)
        .send({ message: "Failed to create audit", error: e.message });
    }
  });

  app.put("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const body = req.body;
      const audit = await storage.updateAudit(id, body);
      return res.status(200).json(audit);
    } catch (e: any) {
      console.error("update audit err", e);
      return res
        .status(500)
        .send({ message: "Failed to update audit", error: e.message });
    }
  });

  app.delete("/api/audits/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      // Delete functionality would go here if needed
      return res.status(204).send();
    } catch (e: any) {
      console.error("delete audit err", e);
      return res
        .status(500)
        .send({ message: "Failed to delete audit", error: e.message });
    }
  });

  app.post("/api/audits/:id/automated-report", async (req, res) => {
    try {
      const auditId = parseInt(req.params.id);
      const audit = await storage.getAudit(auditId);

      if (!audit) {
        return res.status(404).send({ message: "Audit not found" });
      }

      const hazards: Hazard[] = [
        {
          type: "fire",
          location: "kitchen",
          description: "flammable materials near stove",
          priority: "high",
        },
        {
          type: "flood",
          location: "basement",
          description: "sump pump not working",
          priority: "medium",
        },
      ];

      const report = generateAutomatedReport({
        address: audit.address,
        hazards,
      });

      return res.status(200).json({ report });
    } catch (e: any) {
      console.error("generate report err", e);
      return res
        .status(500)
        .send({ message: "Failed to generate report", error: e.message });
    }
  });

  app.post("/api/audits/:id/generate-pdf", generatePDFReport);

  // New Deepseek AI workflow endpoint
  app.post("/api/audit", async (req, res) => {
    try {
      const { answers } = req.body;

      if (!answers || typeof answers !== 'object') {
        return res.status(400).json({ 
          message: "Questionnaire answers are required" 
        });
      }

      console.log("Processing audit with Deepseek AI...");

      // Step 1: Call Deepseek with questionnaire answers and PDF content
      const pdfContent = answers.pdfContent || [];
      const auditResult = await callDeepseek(answers, 'deepseek/deepseek-r1-0528-qwen3-8b:free', pdfContent);

      // Step 2: Generate HTML from audit result
      const auditData = {
         zipCode: answers.zipCode || 'Not specified',
        ...answers
      };

      // Step 3: Generate PDF using jsPDF
      const pdfBuffer = await generatePDFFromHTML(auditResult, auditData);

      // Step 4: Send PDF to browser
      const filename = `Disaster_Dodger_AI_Report_${auditData.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
      res.setHeader("Content-Length", pdfBuffer.length.toString());

      res.send(pdfBuffer);

    } catch (error: any) {
      console.error("Deepseek audit workflow error:", error);
      res.status(500).json({ 
        message: "Error generating AI audit report: " + error.message 
      });
    }
  });

  // Stripe webhook for payment confirmation
  app.post("/api/webhook", async (req, res) => {
    try {
      const event = req.body;

      if (event.type === 'payment_intent.succeeded') {
        // Fulfill the purchase
        console.log('PaymentIntent was successful!');
      }

      res.json({ received: true });
    } catch (error: any) {
      console.error("Stripe webhook error:", error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  });

  return createServer(app);
}