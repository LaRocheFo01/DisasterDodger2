
import type { Request, Response } from 'express';
import { storage } from './storage';
import { callDeepseek } from './deepseek-service';
import { jsPDF } from 'jspdf';

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    console.log(`[Backend] Starting PDF generation for audit ${auditId}`);

    if (isNaN(auditId)) {
      console.error('[Backend] Invalid audit ID:', req.params.id);
      return res.status(400).json({ error: "Invalid audit ID" });
    }

    // Get audit data
    const audit = await storage.getAudit(auditId);
    if (!audit) {
      console.error('[Backend] Audit not found:', auditId);
      return res.status(404).json({ error: "Audit not found" });
    }

    console.log('[Backend] Audit data retrieved:', audit);

    let deepseekResult;
    try {
      // Call DeepSeek API with timeout
      console.log('[Backend] Calling DeepSeek API...');
      deepseekResult = await callDeepseek(
        audit, 
        'deepseek/deepseek-r1-0528:free',
        'comprehensive',
        audit.zipCode || '',
        audit.primaryHazard || 'earthquake'
      );
      console.log('[Backend] DeepSeek analysis complete:', deepseekResult.name);
    } catch (deepseekError) {
      console.log('[Backend] DeepSeek API timeout or error, generating standard report...');
      // Create a basic report structure when API fails
      deepseekResult = {
        id: `audit-${auditId}`,
        name: `Disaster Preparedness Report - ${audit.zipCode}`,
        description: `Comprehensive safety assessment for ${audit.primaryHazard || 'multiple hazard'} risks`,
        sections: [
          {
            id: 'cover',
            title: 'Cover Page',
            type: 'cover' as const,
            enabled: true,
            order: 1,
            customContent: `Property Analysis Report\nLocation: ${audit.zipCode}\nPrimary Hazard: ${audit.primaryHazard || 'Multiple Hazards'}`
          },
          {
            id: 'summary',
            title: 'Executive Summary',
            type: 'summary' as const,
            enabled: true,
            order: 2,
            customContent: 'This report provides recommendations based on your completed audit responses for disaster preparedness improvements.'
          },
          {
            id: 'analysis',
            title: 'Property Analysis',
            type: 'analysis' as const,
            enabled: true,
            order: 3,
            customContent: `Your property responses indicate preparation levels for ${audit.primaryHazard || 'disaster'} scenarios.`
          }
        ],
        styling: {
          fonts: {
            primary: 'Arial',
            secondary: 'Arial',
            size: { title: 20, header: 16, body: 12, small: 10 }
          },
          colors: {
            primary: '#2563eb',
            secondary: '#64748b',
            accent: '#0f172a',
            text: '#1e293b',
            lightGray: '#f1f5f9',
            background: '#ffffff',
            white: '#ffffff',
            danger: '#dc2626',
            warning: '#ea580c',
            success: '#16a34a'
          },
          layout: {
            margins: 50,
            pageSize: 'LETTER',
            spacing: 15
          }
        }
      };
    }

    // Generate PDF with jsPDF using new ReportTemplate structure
    console.log('[Backend] Generating PDF...');
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text(deepseekResult.name, 20, 30);
    
    // Basic info
    doc.setFontSize(12);
    doc.text(`Property: ${audit.zipCode}`, 20, 50);
    doc.text(deepseekResult.description, 20, 60);
    
    let yPos = 80;
    
    // Generate sections from the report template
    const enabledSections = deepseekResult.sections
      .filter(section => section.enabled)
      .sort((a, b) => a.order - b.order);
    
    for (const section of enabledSections) {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
      
      // Section title
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text(section.title, 20, yPos);
      yPos += 15;
      
      // Section content
      doc.setFontSize(12);
      doc.setFont(undefined, 'normal');
      if (section.customContent) {
        const contentLines = doc.splitTextToSize(section.customContent, 170);
        doc.text(contentLines, 20, yPos);
        yPos += contentLines.length * 6 + 10;
      }
      
      yPos += 10;
    }

    // Convert to buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    console.log('[Backend] PDF generated, size:', pdfBuffer.length, 'bytes');

    // Set proper headers
    const filename = `Report_${auditId}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.setHeader('Cache-Control', 'no-cache');

    console.log('[Backend] Sending PDF response...');
    res.end(pdfBuffer);

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });
    console.log('[Backend] Audit marked as completed');

  } catch (error: any) {
    console.error('[Backend] PDF generation error:', error);
    console.error('[Backend] Error stack:', error.stack);
    
    if (!res.headersSent) {
      res.status(500).json({ 
        error: error.message || 'PDF generation failed',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  }
}
