
import type { Request, Response } from 'express';
import { jsPDF } from 'jspdf';
import { storage } from './storage';
import { callDeepseek } from './deepseek-service';
import { generatePDFFromHTML } from './pdf-generator';

export async function testBasicPDF(req: Request, res: Response) {
  try {
    console.log('Testing basic PDF generation...');
    
    const doc = new jsPDF();
    doc.text('Hello World - Basic PDF Test', 20, 20);
    doc.text('This is a test PDF from jsPDF', 20, 30);
    doc.text(`Generated at: ${new Date().toISOString()}`, 20, 40);
    
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'));
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=test-basic.pdf');
    res.send(pdfBuffer);
    
  } catch (error: any) {
    console.error('Basic PDF test error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function testDeepSeekOnly(req: Request, res: Response) {
  try {
    console.log('Testing DeepSeek API only...');
    
    const testData = {
      zipCode: '90210',
      homeType: 'Single-family detached',
      primaryHazard: 'Earthquake'
    };
    
    const result = await callDeepseek(testData);
    res.json({ success: true, result });
    
  } catch (error: any) {
    console.error('DeepSeek test error:', error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
}

export async function testReportHTML(req: Request, res: Response) {
  try {
    const auditId = req.params.id ? parseInt(req.params.id) : 1;
    console.log(`Testing HTML report generation for audit ${auditId}...`);
    
    let audit;
    if (auditId) {
      audit = await storage.getAudit(auditId);
    }
    
    if (!audit) {
      audit = {
        zipCode: '90210',
        homeType: 'Single-family detached',
        primaryHazard: 'Earthquake',
        id: auditId
      };
    }
    
    const mockDeepseekResult = {
      riskScore: 75,
      primaryHazards: ['Earthquake', 'Wildfire'],
      summary: 'This is a test summary for HTML report generation.',
      recommendations: [
        { title: 'Foundation anchoring', priority: 'High', estimatedCost: '$8000' },
        { title: 'Water heater strapping', priority: 'Medium', estimatedCost: '$300' }
      ]
    };
    
    const pdfBuffer = await generatePDFFromHTML(mockDeepseekResult, audit);
    
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=test-html-${auditId}.pdf`);
    res.send(pdfBuffer);
    
  } catch (error: any) {
    console.error('HTML report test error:', error);
    res.status(500).json({ error: error.message });
  }
}

export async function testFullPDFWorkflow(req: Request, res: Response) {
  try {
    const auditId = req.params.id ? parseInt(req.params.id) : 1;
    console.log(`Testing full PDF workflow for audit ${auditId}...`);
    
    let audit = await storage.getAudit(auditId);
    
    if (!audit) {
      console.log('Audit not found, creating test data...');
      audit = {
        zipCode: '90210',
        homeType: 'Single-family detached',
        primaryHazard: 'Earthquake',
        id: auditId,
        auditResponses: {
          roofInspection: 'Professional yearly',
          waterHeaterSecurity: 'Yes',
          foundationWork: 'Yes'
        }
      };
    }
    
    console.log('Step 1: Calling DeepSeek...');
    let deepseekResult;
    try {
      deepseekResult = await callDeepseek(audit);
    } catch (deepseekError) {
      console.log('DeepSeek failed, using mock data...');
      deepseekResult = {
        riskScore: 65,
        primaryHazards: ['Earthquake', 'Wildfire'],
        summary: 'Mock analysis: Property shows moderate risk levels with some areas for improvement.',
        recommendations: [
          { title: 'Foundation retrofitting', priority: 'High', estimatedCost: '$8000' },
          { title: 'Roof inspection and repair', priority: 'Medium', estimatedCost: '$2000' },
          { title: 'Emergency kit preparation', priority: 'Low', estimatedCost: '$500' }
        ]
      };
    }
    
    console.log('Step 2: Generating PDF...');
    const pdfBuffer = await generatePDFFromHTML(deepseekResult, audit);
    
    console.log('Step 3: Sending response...');
    const filename = `Full_Test_Report_${auditId}_${Date.now()}.pdf`;
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', pdfBuffer.length.toString());
    res.send(pdfBuffer);
    
  } catch (error: any) {
    console.error('Full workflow test error:', error);
    res.status(500).json({ 
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
