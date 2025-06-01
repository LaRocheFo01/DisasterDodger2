import PDFDocument from 'pdfkit';
import type { Request, Response } from 'express';
import { storage } from './storage';
import type { Audit } from '@shared/schema';

import { generateAutomatedReport, RECOMMENDATION_LIBRARY, type Hazard } from './automated-report-generator.js';

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Generate automated report using the new system
    const primaryHazard = audit.primaryHazard as Hazard;
    const auditData = { ...audit };
    const automatedReport = generateAutomatedReport(auditData, primaryHazard);
    automatedReport.auditId = auditId;

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
      lightGray: '#6B7280',
      background: '#F9FAFB',
      white: '#FFFFFF',
      danger: '#DC2626',
      warning: '#F59E0B',
      success: '#10B981'
    };

    // Helper function to get risk color
    const getRiskColor = (score: number) => {
      if (score >= 70) return colors.danger;
      if (score >= 40) return colors.warning;
      return colors.success;
    };

    // Cover Page
    doc.fontSize(28)
       .fillColor(colors.primary)
       .text('Disaster Dodger™', 50, 100, { width: 500, align: 'center' });
    
    doc.fontSize(20)
       .fillColor(colors.text)
       .text('Comprehensive Safety Assessment Report', 50, 140, { width: 500, align: 'center' });

    doc.fontSize(14)
       .fillColor(colors.text)
       .text(`Property: ${audit.zipCode}`, 50, 200)
       .text(`Primary Hazard: ${primaryHazard.charAt(0).toUpperCase() + primaryHazard.slice(1)}`, 50, 220)
       .text(`Assessment Date: ${new Date().toLocaleDateString()}`, 50, 240)
       .text(`Report ID: ${auditId}`, 50, 260);

    // Risk Summary Box
    doc.rect(50, 320, 500, 120)
       .fillAndStroke(colors.background, colors.lightGray);
    
    doc.fontSize(16)
       .fillColor(colors.primary)
       .text('Risk Summary', 70, 340);

    const primaryRisk = automatedReport.riskScores.find(r => r.hazard === primaryHazard);
    if (primaryRisk) {
      doc.fontSize(12)
         .fillColor(getRiskColor(primaryRisk.overallScore))
         .text(`${primaryHazard.charAt(0).toUpperCase() + primaryHazard.slice(1)} Risk Score: ${primaryRisk.overallScore}/100`, 70, 365);
      
      doc.fillColor(colors.text)
         .text(`Total Estimated Investment: $${automatedReport.totalEstimatedCost.toLocaleString()}`, 70, 385)
         .text(`Estimated Annual Savings: $${automatedReport.totalAnnualSavings.toLocaleString()}`, 70, 405)
         .text(`Payback Period: ${automatedReport.paybackPeriod} years`, 70, 425);
    }

    // Executive Summary
    doc.addPage();
    doc.fontSize(18)
       .fillColor(colors.primary)
       .text('Executive Summary', 50, 50);

    doc.fontSize(12)
       .fillColor(colors.text)
       .text('Your comprehensive home safety assessment has identified specific vulnerabilities and opportunities for improvement. This report provides FEMA-referenced recommendations with detailed cost estimates and insurance savings calculations.', 50, 90, { width: 500 });

    // Risk Scores by Hazard
    let currentY = 150;
    doc.fontSize(14)
       .fillColor(colors.primary)
       .text('Risk Assessment by Hazard Type', 50, currentY);
    
    currentY += 30;
    automatedReport.riskScores.forEach(riskScore => {
      if (riskScore.overallScore > 0) {
        doc.fontSize(12)
           .fillColor(colors.text)
           .text(`${riskScore.hazard.charAt(0).toUpperCase() + riskScore.hazard.slice(1)}:`, 70, currentY)
           .fillColor(getRiskColor(riskScore.overallScore))
           .text(`${riskScore.overallScore}/100`, 200, currentY);
        
        currentY += 20;
        riskScore.riskFactors.forEach(factor => {
          doc.fontSize(10)
             .fillColor(colors.secondary)
             .text(`• ${factor}`, 90, currentY);
          currentY += 15;
        });
        currentY += 10;
      }
    });

    // Priority Recommendations
    doc.addPage();
    doc.fontSize(18)
       .fillColor(colors.primary)
       .text('Priority Recommendations', 50, 50);

    currentY = 90;
    automatedReport.recommendations.slice(0, 8).forEach((rec, index) => {
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      // Priority number and title
      doc.fontSize(14)
         .fillColor(colors.primary)
         .text(`${index + 1}. ${rec.title}`, 50, currentY);
      
      currentY += 20;
      
      // Description
      doc.fontSize(10)
         .fillColor(colors.text)
         .text(rec.description, 70, currentY, { width: 450 });
      
      currentY += Math.ceil(rec.description.length / 80) * 12 + 10;
      
      // Cost and FEMA reference
      doc.fontSize(9)
         .fillColor(colors.secondary)
         .text(`Cost: $${rec.costRangeUsd[0].toLocaleString()} - $${rec.costRangeUsd[1].toLocaleString()}`, 70, currentY)
         .text(`FEMA Reference: ${rec.femaPdf}, ${rec.femaPage}`, 300, currentY);
      
      currentY += 15;
      
      // Insurance savings if available
      if (rec.premiumSavingsPct) {
        doc.fillColor(colors.success)
           .text(`Insurance Savings: ${rec.premiumSavingsPct[0]}-${rec.premiumSavingsPct[1]}%`, 70, currentY);
        currentY += 15;
      }
      
      currentY += 20;
    });

    // Grant Opportunities
    if (automatedReport.grantOpportunities.length > 0) {
      doc.addPage();
      doc.fontSize(18)
         .fillColor(colors.primary)
         .text('Grant Opportunities', 50, 50);

      currentY = 90;
      automatedReport.grantOpportunities.forEach(grant => {
        doc.fontSize(12)
           .fillColor(colors.text)
           .text(`• ${grant.title}`, 70, currentY);
        
        currentY += 20;
        
        if (grant.grantProgram) {
          doc.fontSize(10)
             .fillColor(colors.secondary)
             .text(`Program: ${grant.grantProgram}`, 90, currentY);
          currentY += 15;
        }
        
        if (grant.grantSharePct) {
          doc.fillColor(colors.success)
             .text(`Grant Coverage: Up to ${grant.grantSharePct}% of project cost`, 90, currentY);
          currentY += 15;
        }
        
        currentY += 10;
      });
    }

    // Insurance Programs
    if (automatedReport.insurancePrograms.length > 0) {
      doc.addPage();
      doc.fontSize(18)
         .fillColor(colors.primary)
         .text('Insurance Discount Programs', 50, 50);

      currentY = 90;
      automatedReport.insurancePrograms.forEach(program => {
        doc.fontSize(12)
           .fillColor(colors.text)
           .text(program.title, 50, currentY);
        
        currentY += 20;
        
        doc.fontSize(10)
           .fillColor(colors.secondary)
           .text(program.summary, 70, currentY, { width: 450 });
        
        currentY += Math.ceil(program.summary.length / 80) * 12 + 10;
        
        if (program.creditRange) {
          doc.fillColor(colors.success)
             .text(`Potential Savings: ${program.creditRange}`, 70, currentY);
          currentY += 15;
        }
        
        currentY += 20;
      });
    }

    // Disclaimer
    doc.addPage();
    doc.fontSize(18)
       .fillColor(colors.primary)
       .text('Important Disclaimers', 50, 50);

    doc.fontSize(10)
       .fillColor(colors.text)
       .text('This report is based on self-reported information and should not replace professional inspection or engineering analysis. Cost estimates are approximate and may vary by location, contractor, and specific site conditions. Insurance savings are estimates based on available program information and actual savings may differ. Consult with licensed contractors, engineers, and insurance professionals before making any modifications to your property.', 50, 90, { width: 500 });

    doc.text('FEMA publications referenced in this report are available at www.fema.gov. Always verify current building codes and permit requirements with local authorities before beginning any retrofit work.', 50, 160, { width: 500 });

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate PDF report" });
  }
}