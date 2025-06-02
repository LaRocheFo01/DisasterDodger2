import type { Request, Response } from 'express';
import { storage } from './storage';
import { callDeepseek } from './deepseek-service';
import { generatePDFFromHTML } from './pdf-generator';

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);

    if (isNaN(auditId)) {
      return res.status(400).json({ message: "Invalid audit ID" });
    }

    const audit = await storage.getAudit(auditId);

    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    console.log("Generating report with Deepseek AI for audit:", auditId);

    // Use Deepseek AI for analysis instead of automated system
    const auditData = { ...audit };
    const deepseekResult = await callDeepseek(auditData, 'deepseek-chat');

    // Generate PDF using Puppeteer with the AI analysis
    const pdfBuffer = await generatePDFFromHTML(deepseekResult, auditData);

    // Set headers for PDF download
    const filename = `Disaster_Dodger_AI_Report_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length.toString());

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Send PDF
    res.send(pdfBuffer);

  } catch (error: any) {
    console.error("Deepseek PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate AI report: " + error.message });
  }
}