
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

    // Call DeepSeek API
    console.log('[Backend] Calling DeepSeek API...');
    const deepseekResult = await callDeepseek(
      audit, 
      'deepseek/deepseek-r1-0528-qwen3-8b:free',
      'comprehensive',
      audit.zipCode || '',
      audit.primaryHazard || 'earthquake'
    );
    console.log('[Backend] DeepSeek analysis complete:', deepseekResult.name);

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
