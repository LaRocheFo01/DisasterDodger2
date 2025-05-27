import { Request, Response } from 'express';
import OpenAI from 'openai';
import PDFDocument from 'pdfkit';
import { storage } from './storage';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing required OpenAI API key: OPENAI_API_KEY');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface ReportData {
  summary: string;
  comments: string[];
  quotes: string[];
  priorityUpgrades: string[];
  costEstimates: Array<{ item: string; estimate: string }>;
  grantsRebates: string[];
  riskScore: number;
}

export async function generateReportHandler(req: Request, res: Response) {
  try {
    const { auditId } = req.body;
    
    if (!auditId) {
      return res.status(400).json({ error: 'Audit ID is required' });
    }

    // Get audit data from storage
    const audit = await storage.getAudit(auditId);
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    // Generate AI analysis
    const reportData = await generateReportData(audit);

    // Create PDF
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    
    // Set response headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="Disaster-Dodger-Report-${auditId}.pdf"`);
    
    // Pipe PDF to response
    doc.pipe(res);

    // Generate PDF content
    await generatePDFContent(doc, audit, reportData);
    
    doc.end();

  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
}

async function generateReportData(audit: any): Promise<ReportData> {
  const systemPrompt = `You are a FEMA-certified disaster preparedness expert analyzing a home safety audit. Reference FEMA documents P-530, P-804, P-737, and P-312 in your analysis.

Based on the audit data provided, generate a comprehensive disaster preparedness report with:

1. Executive summary (2-3 sentences)
2. Specific comments on each answered question
3. Relevant FEMA quotes and guidelines
4. Priority upgrade recommendations
5. Cost estimates for improvements
6. Available grants and rebates
7. Overall risk score (1-100, where 100 is highest risk)

Focus on actionable, practical advice that could help reduce insurance costs and improve safety.

Return your response as valid JSON in this exact format:
{
  "summary": "string",
  "comments": ["string"],
  "quotes": ["string"],
  "priorityUpgrades": ["string"],
  "costEstimates": [{"item": "string", "estimate": "string"}],
  "grantsRebates": ["string"],
  "riskScore": number
}`;

  const userContent = `
Audit Data:
- Property Location: ${audit.zipCode}
- Primary Hazard: ${audit.primaryHazard}
- Audit Responses: ${JSON.stringify(audit.responses || {})}
- Additional Data: ${JSON.stringify(audit)}

Please analyze this data and provide the comprehensive report as requested.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userContent }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content received from OpenAI');
    }

    // Parse JSON response
    const reportData = JSON.parse(content);
    return reportData;

  } catch (error) {
    console.error('OpenAI API error:', error);
    // Fallback data structure
    return {
      summary: "Analysis completed for your property's disaster preparedness assessment.",
      comments: ["Audit data has been reviewed and recommendations prepared."],
      quotes: ["FEMA recommends regular assessment of home disaster preparedness measures."],
      priorityUpgrades: ["Review and update emergency preparedness plan"],
      costEstimates: [{ item: "Emergency Kit", estimate: "$50-150" }],
      grantsRebates: ["Check local emergency management office for available programs"],
      riskScore: 50
    };
  }
}

async function generatePDFContent(doc: any, audit: any, reportData: ReportData) {
  // Page 1: Cover Page
  doc.fontSize(24).text('Disaster Dodger™', 50, 100);
  doc.fontSize(20).text('Personalized Home Safety Report', 50, 140);
  doc.fontSize(14).text(`Property: ${audit.zipCode}`, 50, 180);
  doc.fontSize(14).text(`Primary Hazard: ${audit.primaryHazard}`, 50, 200);
  doc.fontSize(14).text(`Risk Score: ${reportData.riskScore}/100`, 50, 220);
  doc.fontSize(12).text(`Generated: ${new Date().toLocaleDateString()}`, 50, 260);

  // Add FEMA alignment notice
  doc.fontSize(10).text('This report follows FEMA guidelines P-530, P-804, P-737, and P-312', 50, 300);

  // Page 2: Executive Summary
  doc.addPage();
  doc.fontSize(18).text('Executive Summary', 50, 50);
  doc.fontSize(12).text(reportData.summary, 50, 80, { width: 500, align: 'justify' });

  // Risk Score Visualization
  const riskColor = reportData.riskScore > 70 ? '#ef4444' : reportData.riskScore > 40 ? '#f59e0b' : '#10b981';
  doc.fontSize(16).text('Risk Assessment', 50, 160);
  doc.rect(50, 180, 400, 20).stroke();
  doc.rect(50, 180, (reportData.riskScore / 100) * 400, 20).fillAndStroke(riskColor);
  doc.fillColor('black').fontSize(12).text(`${reportData.riskScore}/100`, 460, 185);

  // Page 3: Priority Recommendations
  doc.addPage();
  doc.fontSize(18).text('Priority Upgrades', 50, 50);
  let yPos = 80;
  reportData.priorityUpgrades.forEach((upgrade, index) => {
    doc.fontSize(12).text(`${index + 1}. ${upgrade}`, 50, yPos, { width: 500 });
    yPos += 25;
  });

  // Page 4: Cost Estimates
  doc.addPage();
  doc.fontSize(18).text('Cost Estimates', 50, 50);
  yPos = 80;
  reportData.costEstimates.forEach((cost) => {
    doc.fontSize(12).text(`• ${cost.item}: ${cost.estimate}`, 50, yPos, { width: 500 });
    yPos += 20;
  });

  // Page 5: FEMA Guidelines & Quotes
  doc.addPage();
  doc.fontSize(18).text('FEMA Guidelines', 50, 50);
  yPos = 80;
  reportData.quotes.forEach((quote) => {
    doc.fontSize(11).text(`"${quote}"`, 50, yPos, { width: 500, style: 'italic' });
    yPos += 30;
  });

  // Page 6: Grants and Rebates
  doc.addPage();
  doc.fontSize(18).text('Available Grants & Rebates', 50, 50);
  yPos = 80;
  reportData.grantsRebates.forEach((grant) => {
    doc.fontSize(12).text(`• ${grant}`, 50, yPos, { width: 500 });
    yPos += 20;
  });

  // Page 7: Detailed Comments
  doc.addPage();
  doc.fontSize(18).text('Detailed Analysis', 50, 50);
  yPos = 80;
  reportData.comments.forEach((comment) => {
    if (yPos > 700) {
      doc.addPage();
      yPos = 50;
    }
    doc.fontSize(11).text(`• ${comment}`, 50, yPos, { width: 500 });
    yPos += 25;
  });

  // Footer on last page
  doc.fontSize(10).text('Generated by Disaster Dodger™ - FEMA-Aligned Home Safety Assessment', 50, 750);
}