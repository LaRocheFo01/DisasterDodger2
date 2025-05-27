import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import { storage } from "./storage";

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Set headers for PDF download
    const filename = `Disaster_Dodger_Audit_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Create PDF document
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    // Color scheme
    const colors = {
      primary: "#0F4C81",
      secondary: "#16A34A",
      danger: "#DC2626",
      warning: "#D97706",
      text: "#000000",
      lightGray: "#6B7280"
    };

    // --- Page 1: Cover Page ---
    doc.fontSize(32).fillColor(colors.primary)
       .text("Disaster Dodger™", 50, 100, { align: "center" });
    
    doc.fontSize(24).fillColor(colors.text)
       .text("Home Safety Audit Report", 50, 150, { align: "center" });

    doc.fontSize(16).fillColor(colors.lightGray)
       .text(`Property ZIP Code: ${audit.zipCode}`, 50, 250)
       .text(`Report Date: ${new Date().toLocaleDateString()}`, 50, 280)
       .text(`Audit ID: ${audit.id}`, 50, 310);

    // Calculate risk score based on audit data
    const riskScore = calculateRiskScore(audit);
    
    // Risk Score Circle
    const centerX = 297.5;
    const centerY = 450;
    const radius = 80;
    
    doc.circle(centerX, centerY, radius)
       .stroke(colors.primary);
    
    doc.fontSize(48).fillColor(colors.primary)
       .text(riskScore.toString(), centerX - 30, centerY - 20);
    
    doc.fontSize(16).fillColor(colors.text)
       .text("Risk Score", centerX - 35, centerY + 25);

    doc.fontSize(14).fillColor(colors.lightGray)
       .text(`Primary Hazard: ${audit.primaryHazard || 'Multiple Hazards'}`, 50, 600, { align: "center" });

    // --- Page 2: Executive Summary ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Executive Summary", 50, 50);

    doc.fontSize(12).fillColor(colors.text)
       .text(payload.summary, 50, 100, { 
         width: 495, 
         align: "justify",
         lineGap: 5
       });

    // Hazard Risk Table
    doc.fontSize(18).fillColor(colors.primary)
       .text("Identified Hazards", 50, 300);

    let tableY = 340;
    payload.allHazards.forEach((hazard, index) => {
      const y = tableY + (index * 30);
      
      // Risk level color
      let riskColor = colors.secondary;
      if (hazard.risk >= 7) riskColor = colors.danger;
      else if (hazard.risk >= 4) riskColor = colors.warning;
      
      doc.fontSize(12).fillColor(colors.text)
         .text(hazard.type, 50, y)
         .text(hazard.severity, 250, y)
         .fillColor(riskColor)
         .text(hazard.risk.toString(), 400, y)
         .fillColor(colors.text);
    });

    // --- Page 3: Detailed Recommendations ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Recommendations", 50, 50);

    let recY = 100;
    payload.recommendations.forEach((rec, index) => {
      doc.fontSize(12).fillColor(colors.text)
         .text(`${index + 1}. ${rec}`, 50, recY, { 
           width: 495,
           lineGap: 3
         });
      recY += 40;
      
      // Add new page if needed
      if (recY > 700) {
        doc.addPage();
        recY = 50;
      }
    });

    // --- Page 4: Priority Upgrades ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Priority Upgrades", 50, 50);

    let upgradeY = 100;
    payload.priorityUpgrades.forEach((upgrade, index) => {
      doc.fontSize(12).fillColor(colors.text)
         .text(`• ${upgrade}`, 50, upgradeY, { 
           width: 495,
           lineGap: 3
         });
      upgradeY += 30;
    });

    // --- Page 5: Cost Estimates ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Estimated Costs", 50, 50);

    let costY = 100;
    let totalCost = 0;
    
    payload.costEstimates.forEach((cost) => {
      const amount = parseFloat(cost.estimate.replace(/[,$]/g, ''));
      totalCost += amount;
      
      doc.fontSize(12).fillColor(colors.text)
         .text(cost.item, 50, costY)
         .text(`$${cost.estimate}`, 400, costY);
      costY += 25;
    });

    // Total cost
    doc.fontSize(14).fillColor(colors.primary)
       .text(`Total Estimated Cost: $${totalCost.toLocaleString()}`, 50, costY + 20);

    // --- Page 6: Available Grants & Rebates ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Available Grants & Rebates", 50, 50);

    let grantY = 100;
    payload.grantsRebates.forEach((grant) => {
      doc.fontSize(12).fillColor(colors.text)
         .text(`• ${grant}`, 50, grantY, { 
           width: 495,
           lineGap: 3
         });
      grantY += 30;
    });

    // --- Page 7: Audit Details ---
    doc.addPage();
    doc.fontSize(24).fillColor(colors.primary)
       .text("Audit Question Responses", 50, 50);

    let answerY = 100;
    let currentSection = "";
    
    payload.answers.forEach((qa) => {
      // Add section header if new section
      if (qa.section !== currentSection) {
        currentSection = qa.section;
        doc.fontSize(16).fillColor(colors.primary)
           .text(qa.section, 50, answerY);
        answerY += 30;
      }
      
      doc.fontSize(11).fillColor(colors.text)
         .text(`Q: ${qa.question}`, 50, answerY, { width: 495 });
      answerY += 20;
      
      doc.fontSize(11).fillColor(colors.secondary)
         .text(`A: ${qa.answer}`, 50, answerY, { width: 495 });
      answerY += 30;
      
      // Add new page if needed
      if (answerY > 700) {
        doc.addPage();
        answerY = 50;
      }
    });

    // --- Footer on last page ---
    doc.fontSize(10).fillColor(colors.lightGray)
       .text("This report was generated by Disaster Dodger™ - Your trusted partner in home safety preparedness.", 50, 750, {
         align: "center",
         width: 495
       });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
}