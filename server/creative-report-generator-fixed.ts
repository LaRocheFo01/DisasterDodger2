import { Request, Response } from 'express';
import { storage } from './storage';
import { jsPDF } from 'jspdf';

interface CreativeReportSection {
  id: string;
  title: string;
  type: 'hero' | 'scorecard' | 'action_plan' | 'resources';
  content: string;
}

interface CreativeReport {
  id: string;
  title: string;
  subtitle: string;
  homeAddress: string;
  generatedDate: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
  primaryHazard: string;
  sections: CreativeReportSection[];
  metadata: {
    auditScore: number;
    preparednessLevel: string;
    totalRecommendations: number;
    estimatedCost: number;
    potentialSavings: number;
  };
}

function determineRiskLevel(hazard: string, responses: any): 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME' {
  if (!responses || Object.keys(responses).length === 0) {
    return 'MEDIUM';
  }
  
  let riskFactors = 0;
  const responseValues = Object.values(responses);
  
  responseValues.forEach((value: any) => {
    if (typeof value === 'string') {
      if (value.includes('None') || value.includes('No') || value.includes('Basic')) {
        riskFactors++;
      }
    }
  });
  
  if (riskFactors >= 8) return 'EXTREME';
  if (riskFactors >= 5) return 'HIGH';
  if (riskFactors >= 2) return 'MEDIUM';
  return 'LOW';
}

function calculateAuditScore(responses: any): number {
  if (!responses || Object.keys(responses).length === 0) {
    return 65;
  }
  
  let score = 100;
  const responseValues = Object.values(responses);
  
  responseValues.forEach((value: any) => {
    if (typeof value === 'string') {
      if (value.includes('None') || value.includes('No')) {
        score -= 8;
      } else if (value.includes('Basic') || value.includes('Single')) {
        score -= 4;
      }
    }
  });
  
  return Math.max(30, Math.min(95, score));
}

export async function generateCreativeReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.auditId);
    
    if (!auditId) {
      return res.status(400).json({ error: 'Invalid audit ID' });
    }

    const audit = await storage.getAudit(auditId);
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    console.log(`[Creative Report] Generating for audit ${auditId}...`);

    // Generate report data directly
    const reportData: CreativeReport = {
      id: `creative_report_${auditId}_${Date.now()}`,
      title: `${audit.primaryHazard} Protection Plan for Your Home`,
      subtitle: `Personalized safety strategy for ZIP ${audit.zipCode}`,
      homeAddress: audit.zipCode,
      generatedDate: new Date().toLocaleDateString(),
      riskLevel: determineRiskLevel(audit.primaryHazard, audit.auditResponses),
      primaryHazard: audit.primaryHazard,
      sections: [
        {
          id: "hero",
          title: "Your Home's Protection Journey",
          type: "hero",
          content: `Welcome to your personalized ${audit.primaryHazard} protection plan. This comprehensive assessment identifies your home's vulnerabilities and provides actionable solutions to keep your family safe.`
        },
        {
          id: "current_state",
          title: "Current Protection Status",
          type: "scorecard",
          content: `Based on your responses, we've identified key areas for improvement in your ${audit.primaryHazard} preparedness.`
        },
        {
          id: "action_roadmap",
          title: "Your 90-Day Action Plan",
          type: "action_plan",
          content: `Follow this prioritized roadmap to systematically improve your home's protection against ${audit.primaryHazard} disasters.`
        },
        {
          id: "resource_arsenal",
          title: "Emergency Resources",
          type: "resources",
          content: "Essential contacts, supplies, and documentation to keep your family prepared for any emergency."
        }
      ],
      metadata: {
        auditScore: calculateAuditScore(audit.auditResponses),
        preparednessLevel: "Developing Guardian",
        totalRecommendations: 6,
        estimatedCost: 3500,
        potentialSavings: 1800
      }
    };

    // Generate PDF directly with jsPDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add title page
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129);
    doc.text(reportData.title, 20, 40);

    doc.setFontSize(16);
    doc.setTextColor(75, 85, 99);
    doc.text(reportData.subtitle, 20, 55);

    // Add generation info
    doc.setFontSize(12);
    doc.setTextColor(107, 114, 128);
    doc.text(`Generated: ${reportData.generatedDate}`, 20, 70);
    doc.text(`Risk Level: ${reportData.riskLevel}`, 20, 80);
    doc.text(`Primary Hazard: ${reportData.primaryHazard}`, 20, 90);

    // Add sections
    let yPos = 110;
    doc.setFontSize(14);
    doc.setTextColor(31, 41, 55);

    reportData.sections.forEach((section, index) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 30;
      }
      
      doc.setFontSize(16);
      doc.setTextColor(16, 185, 129);
      doc.text(`${index + 1}. ${section.title}`, 20, yPos);
      yPos += 10;
      
      doc.setFontSize(12);
      doc.setTextColor(31, 41, 55);
      const lines = doc.splitTextToSize(section.content, 170);
      doc.text(lines, 20, yPos);
      yPos += lines.length * 6 + 10;
    });

    // Add footer
    const totalPages = doc.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setTextColor(107, 114, 128);
      doc.text('Generated by Disaster Dodger™ - Professional Home Safety Assessment', 20, 280);
      doc.text(`Page ${i} of ${totalPages}`, 170, 280);
    }

    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="creative-safety-report-${auditId}.pdf"`);
    res.send(pdfBuffer);

    console.log(`[Creative Report] Generated successfully for audit ${auditId}`);

  } catch (error) {
    console.error('[Creative Report] Generation failed:', error);
    res.status(500).json({ 
      error: 'Failed to generate creative report',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}