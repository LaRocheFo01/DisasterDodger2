import PDFDocument from 'pdfkit';
import type { Request, Response } from 'express';
import { storage } from './storage';
import type { Audit } from '@shared/schema';

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Set headers for PDF download
    const filename = `Disaster_Dodger_Report_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Create PDF document
    const doc = new PDFDocument({ 
      size: 'LETTER', 
      margin: 50
    });
    doc.pipe(res);

    // Colors
    const colors = {
      primary: '#16A34A',
      secondary: '#10B981',
      accent: '#0F4C81',
      text: '#1F2937',
      lightGray: '#6B7280'
    };

    // Cover Page
    doc.fontSize(24)
       .fillColor(colors.primary)
       .text('Disaster Dodger™ Safety Assessment Report', 50, 100, { width: 500, align: 'center' });

    doc.fontSize(14)
       .fillColor(colors.text)
       .text(`Property: ${audit.zipCode}`, 50, 180)
       .text(`Primary Hazard: ${audit.primaryHazard}`, 50, 200)
       .text(`Assessment Date: ${new Date().toLocaleDateString()}`, 50, 220);

    // Executive Summary
    doc.addPage();
    doc.fontSize(18)
       .fillColor(colors.primary)
       .text('Executive Summary', 50, 50);

    doc.fontSize(12)
       .fillColor(colors.text)
       .text('Your comprehensive home safety assessment has been completed.', 50, 90)
       .text('This report provides personalized recommendations based on your responses', 50, 110)
       .text('and FEMA guidelines for disaster preparedness.', 50, 130);

    // Assessment Details
    doc.addPage();
    doc.fontSize(18)
       .fillColor(colors.primary)
       .text('Assessment Details', 50, 50);

    let currentY = 90;
    const responses = [
      { label: 'ZIP Code', value: audit.zipCode },
      { label: 'Primary Hazard', value: audit.primaryHazard },
      { label: 'Home Type', value: audit.homeType || 'Not specified' },
      { label: 'Year Built', value: audit.yearBuilt || 'Not specified' },
      { label: 'Water Heater Security', value: audit.waterHeaterSecurity || 'Not assessed' },
      { label: 'Defensible Space', value: audit.defensibleSpaceWidth || 'Not assessed' },
      { label: 'Equipment Elevation', value: audit.equipmentElevation || 'Not assessed' }
    ];

    responses.forEach(response => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }
      
      doc.fontSize(10)
         .fillColor(colors.lightGray)
         .text(`${response.label}:`, 50, currentY)
         .fillColor(colors.text)
         .text(response.value, 200, currentY);
      
      currentY += 20;
    });

    // Recommendations
    doc.addPage();
    doc.fontSize(18)
       .fillColor(colors.primary)
       .text('Safety Recommendations', 50, 50);

    doc.fontSize(12)
       .fillColor(colors.text)
       .text('Based on your assessment, here are key recommendations:', 50, 90)
       .text('• Secure water heater with proper strapping', 50, 120)
       .text('• Maintain defensible space around property', 50, 140)
       .text('• Elevate utilities above potential flood levels', 50, 160)
       .text('• Regular inspection and maintenance schedules', 50, 180);

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
}