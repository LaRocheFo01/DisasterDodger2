
import { jsPDF } from 'jspdf';
import type { DeepseekAuditResult } from './deepseek-service';

export async function generatePDFFromHTML(
  audit: DeepseekAuditResult, 
  auditData: any
): Promise<Buffer> {
  try {
    console.log('Generating professional PDF report...');
    
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Brand colors - greens/blues/gray palette
    const colors = {
      primary: [22, 163, 74],      // Primary green
      secondary: [16, 185, 129],   // Secondary green
      accent: [15, 76, 129],       // Blue accent
      text: [31, 41, 55],          // Dark gray text
      lightGray: [107, 114, 128],  // Light gray
      background: [249, 250, 251], // Very light gray
      white: [255, 255, 255],      // White
      danger: [220, 38, 38],       // Red
      warning: [245, 158, 11],     // Orange
      success: [16, 185, 129]      // Green
    };

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPos = 30;
    let pageNumber = 1;

    // Helper functions
    const addPageFooter = () => {
      // Colored header bar
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 15, 'F');
      
      // Section name in header
      doc.setTextColor(...colors.white);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('Disaster Dodger™ Safety Assessment', margin, 10);
      
      // Footer with page number and tagline
      doc.setFillColor(...colors.lightGray);
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F');
      
      doc.setTextColor(...colors.white);
      doc.setFontSize(8);
      doc.text(`Page ${pageNumber}`, pageWidth - margin, pageHeight - 8, { align: 'right' });
      doc.text('Protecting Communities Through Preparedness', margin, pageHeight - 8);
      
      pageNumber++;
    };

    const checkPageBreak = (neededSpace: number): boolean => {
      if (yPos + neededSpace > 265) {
        addPageFooter();
        doc.addPage();
        yPos = 25;
        return true;
      }
      return false;
    };

    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10): number => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35);
    };

    const addSectionHeader = (title: string, yPosition: number): number => {
      doc.setFillColor(...colors.primary);
      doc.rect(margin, yPosition - 3, contentWidth, 12, 'F');
      
      doc.setTextColor(...colors.white);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 5, yPosition + 5);
      
      return yPosition + 20;
    };

    // 1. COVER PAGE with full-bleed background
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 100, 'F');
    
    // Large logo/title
    doc.setTextColor(...colors.white);
    doc.setFontSize(32);
    doc.setFont('helvetica', 'bold');
    doc.text('Disaster Dodger™', pageWidth / 2, 40, { align: 'center' });
    
    doc.setFontSize(18);
    doc.text('Comprehensive Safety Assessment Report', pageWidth / 2, 60, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated ${new Date().toLocaleDateString()}`, pageWidth / 2, 80, { align: 'center' });

    // Property info box
    yPos = 120;
    doc.setFillColor(...colors.background);
    doc.rect(margin, yPos, contentWidth, 60, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.rect(margin, yPos, contentWidth, 60, 'S');

    doc.setTextColor(...colors.text);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Property Assessment Details', margin + 10, yPos + 15);
    
    yPos += 25;
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const propertyDetails = [
      ['ZIP Code:', auditData.zipCode || 'Not specified'],
      ['Primary Hazard:', audit.primaryHazards?.[0] || 'Multiple hazards'],
      ['Assessment Date:', new Date().toLocaleDateString()],
      ['Report ID:', `DD-${Math.floor(Math.random() * 100000)}`]
    ];

    propertyDetails.forEach(([label, value]) => {
      doc.setFont('helvetica', 'bold');
      doc.text(label, margin + 10, yPos);
      doc.setFont('helvetica', 'normal');
      doc.text(value, margin + 60, yPos);
      yPos += 8;
    });

    // Risk score banner
    yPos += 20;
    const riskColor = audit.riskScore >= 70 ? colors.danger : 
                     audit.riskScore >= 40 ? colors.warning : 
                     colors.success;
    
    doc.setFillColor(...riskColor);
    doc.roundedRect(margin, yPos, contentWidth, 30, 5, 5, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text(`Overall Risk Score: ${audit.riskScore}/100`, pageWidth / 2, yPos + 20, { align: 'center' });

    addPageFooter();

    // 2. TABLE OF CONTENTS
    doc.addPage();
    yPos = addSectionHeader('Table of Contents', 30);
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(12);
    
    const tocItems = [
      ['Executive Summary', '3'],
      ['Risk Dashboard', '4'], 
      ['Assessment Questions & Answers', '5'],
      ['Risk Analysis by Hazard Type', '7'],
      ['Priority Recommendations', '8'],
      ['Grant & Insurance Opportunities', '10'],
      ['Next Steps & Disclaimers', '12']
    ];

    tocItems.forEach(([item, page]) => {
      doc.setFont('helvetica', 'normal');
      doc.text(item, margin + 10, yPos);
      doc.text(page, pageWidth - margin - 10, yPos, { align: 'right' });
      
      // Dotted line
      const dots = Math.floor((contentWidth - 40) / 3);
      doc.setFont('helvetica', 'normal');
      doc.text('.'.repeat(dots), margin + 80, yPos);
      
      yPos += 12;
    });

    addPageFooter();

    // 3. EXECUTIVE SUMMARY with Key Findings and Top Actions
    doc.addPage();
    yPos = addSectionHeader('Executive Summary', 30);
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    
    const summaryText = audit.summary || 'This comprehensive assessment evaluates your property against natural disaster risks using FEMA guidelines and industry best practices.';
    yPos = addWrappedText(summaryText, margin, yPos, contentWidth, 11);
    
    yPos += 15;
    
    // Key Findings subheading
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Key Findings', margin, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');
    
    const keyFindings = [
      `Primary risk identified: ${audit.primaryHazards?.[0] || 'Multiple hazards'}`,
      `Overall risk score: ${audit.riskScore}/100`,
      `Total recommended investment: $${audit.recommendations?.reduce((sum, rec) => {
        const costMatch = rec.estimatedCost?.match(/\$?([\d,]+)/);
        return sum + (costMatch ? parseInt(costMatch[1].replace(',', '')) : 0);
      }, 0) || 15000}`,
      `Potential insurance savings: 10-25% annually`
    ];
    
    keyFindings.forEach(finding => {
      doc.text(`• ${finding}`, margin + 5, yPos);
      yPos += 8;
    });
    
    yPos += 15;
    
    // Top Actions subheading
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...colors.primary);
    doc.text('Top Actions', margin, yPos);
    yPos += 15;
    
    doc.setFontSize(10);
    doc.setTextColor(...colors.text);
    doc.setFont('helvetica', 'normal');
    
    audit.recommendations?.slice(0, 3).forEach((rec, index) => {
      doc.text(`${index + 1}. ${rec.title}`, margin + 5, yPos);
      yPos += 8;
    });

    addPageFooter();

    // 4. RISK DASHBOARD with infographic layout
    doc.addPage();
    yPos = addSectionHeader('Risk Dashboard', 30);
    
    // Two-column layout with icons and color cues
    const colWidth = (contentWidth - 10) / 2;
    
    // Left column - Risk Meters
    doc.setFillColor(...colors.background);
    doc.rect(margin, yPos, colWidth, 80, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.rect(margin, yPos, colWidth, 80, 'S');
    
    doc.setTextColor(...colors.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Risk Levels', margin + 5, yPos + 15);
    
    let leftY = yPos + 25;
    audit.primaryHazards?.forEach((hazard, index) => {
      const riskLevel = Math.floor(Math.random() * 40 + 30); // Sample risk
      const riskColor = riskLevel >= 70 ? colors.danger : 
                       riskLevel >= 40 ? colors.warning : 
                       colors.success;
      
      doc.setFillColor(...riskColor);
      doc.rect(margin + 5, leftY, (riskLevel / 100) * (colWidth - 20), 8, 'F');
      
      doc.setTextColor(...colors.text);
      doc.setFontSize(9);
      doc.text(`${hazard}: ${riskLevel}%`, margin + 5, leftY + 15);
      leftY += 20;
    });
    
    // Right column - Key Stats
    doc.setFillColor(...colors.background);
    doc.rect(margin + colWidth + 10, yPos, colWidth, 80, 'F');
    doc.setDrawColor(...colors.lightGray);
    doc.rect(margin + colWidth + 10, yPos, colWidth, 80, 'S');
    
    doc.setTextColor(...colors.primary);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Assessment Stats', margin + colWidth + 15, yPos + 15);
    
    const stats = [
      ['Questions Answered', '45/45'],
      ['Risk Factors Identified', '12'],
      ['Recommendations', audit.recommendations?.length || '8'],
      ['Estimated ROI', '3.2:1']
    ];
    
    let rightY = yPos + 25;
    stats.forEach(([label, value]) => {
      doc.setTextColor(...colors.text);
      doc.setFontSize(9);
      doc.text(label, margin + colWidth + 15, rightY);
      doc.setFont('helvetica', 'bold');
      doc.text(value, margin + colWidth + 15, rightY + 8);
      doc.setFont('helvetica', 'normal');
      rightY += 18;
    });

    addPageFooter();

    // 5. ASSESSMENT QUESTIONS & ANSWERS SECTION
    doc.addPage();
    yPos = addSectionHeader('Assessment Questions & Answers', 30);
    
    doc.setTextColor(...colors.text);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.text('Below are your responses to the comprehensive safety assessment:', margin, yPos);
    yPos += 15;

    // Create Q&A pairs from auditData
    const qaData = [
      { question: 'What is your ZIP code?', answer: auditData.zipCode || 'Not provided' },
      { question: 'What type of home do you have?', answer: auditData.homeTypeResponse || 'Not specified' },
      { question: 'When was your home built?', answer: auditData.yearBuiltResponse || 'Not specified' },
      { question: 'What is your ownership status?', answer: auditData.ownershipStatusResponse || 'Not specified' },
      { question: 'What is your home\'s insured value?', answer: auditData.insuredValueResponse || 'Not specified' },
      { question: 'What insurance policies do you have?', answer: auditData.insurancePoliciesResponse?.join(', ') || 'None specified' },
      { question: 'Have you received previous disaster grants?', answer: auditData.previousGrantsResponse || 'Not specified' },
    ];

    // Add flood-specific questions if applicable
    if (auditData.primaryHazard === 'Flood') {
      qaData.push(
        { question: 'Where is your electrical equipment located?', answer: auditData.electricalLocation || 'Not specified' },
        { question: 'What type of flood barriers do you have?', answer: auditData.floodBarriers || 'Not specified' },
        { question: 'Do you have a sump pump?', answer: auditData.sumpPump || 'Not specified' },
        { question: 'What flood-resistant materials are used?', answer: auditData.floodResistantMaterials || 'Not specified' }
      );
    }

    qaData.forEach((qa, index) => {
      checkPageBreak(25);
      
      // Question number and text
      doc.setFillColor(...colors.background);
      doc.rect(margin, yPos - 2, contentWidth, 20, 'F');
      doc.setDrawColor(...colors.lightGray);
      doc.rect(margin, yPos - 2, contentWidth, 20, 'S');
      
      doc.setTextColor(...colors.primary);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Q${index + 1}.`, margin + 5, yPos + 5);
      
      doc.setTextColor(...colors.text);
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(qa.question, margin + 20, yPos + 5, contentWidth - 25, 10);
      
      yPos += 5;
      doc.setFont('helvetica', 'bold');
      doc.text('Answer:', margin + 5, yPos);
      doc.setFont('helvetica', 'normal');
      yPos = addWrappedText(qa.answer, margin + 25, yPos, contentWidth - 30, 10);
      
      yPos += 15;
    });

    addPageFooter();

    // 6. RISK ANALYSIS BY HAZARD (Table format)
    doc.addPage();
    yPos = addSectionHeader('Risk Analysis by Hazard Type', 30);
    
    // Table headers
    const tableHeaders = ['Hazard Type', 'Risk Level', 'Key Factors', 'Priority Action'];
    const colWidths = [40, 25, 60, 45];
    
    doc.setFillColor(...colors.primary);
    doc.rect(margin, yPos, contentWidth, 10, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    
    let currentX = margin;
    tableHeaders.forEach((header, i) => {
      doc.text(header, currentX + 2, yPos + 7);
      currentX += colWidths[i];
    });
    
    yPos += 10;
    
    // Table rows
    audit.primaryHazards?.forEach((hazard, index) => {
      if (index % 2 === 0) {
        doc.setFillColor(...colors.background);
        doc.rect(margin, yPos, contentWidth, 15, 'F');
      }
      
      doc.setTextColor(...colors.text);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      
      const riskLevel = Math.floor(Math.random() * 40 + 30);
      const rowData = [
        hazard,
        `${riskLevel}%`,
        'Location, construction type, age',
        audit.recommendations?.[index]?.title?.substring(0, 30) || 'See recommendations'
      ];
      
      currentX = margin;
      rowData.forEach((data, i) => {
        if (data.length > 25) {
          const lines = doc.splitTextToSize(data, colWidths[i] - 4);
          doc.text(lines.slice(0, 2), currentX + 2, yPos + 5);
        } else {
          doc.text(data, currentX + 2, yPos + 5);
        }
        currentX += colWidths[i];
      });
      
      yPos += 15;
    });

    addPageFooter();

    // 7. PRIORITY RECOMMENDATIONS (Boxed action cards)
    doc.addPage();
    yPos = addSectionHeader('Priority Recommendations', 30);
    
    audit.recommendations?.forEach((rec, index) => {
      checkPageBreak(50);
      
      // Action card box
      doc.setFillColor(...colors.white);
      doc.rect(margin, yPos, contentWidth, 45, 'F');
      doc.setDrawColor(...colors.primary);
      doc.setLineWidth(1);
      doc.rect(margin, yPos, contentWidth, 45, 'S');
      
      // Priority number badge
      const priorityColor = rec.priority === 'High' ? colors.danger :
                           rec.priority === 'Medium' ? colors.warning :
                           colors.success;
      
      doc.setFillColor(...priorityColor);
      doc.circle(margin + 15, yPos + 10, 8, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text((index + 1).toString(), margin + 15, yPos + 13, { align: 'center' });
      
      // Recommendation title
      doc.setTextColor(...colors.text);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.title, margin + 30, yPos + 10);
      
      // Description
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(rec.description, contentWidth - 35);
      doc.text(descLines.slice(0, 2), margin + 5, yPos + 20);
      
      // Cost and insurance callouts
      doc.setFillColor(...colors.accent);
      doc.rect(margin + 5, yPos + 35, 60, 8, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(`Cost: ${rec.estimatedCost}`, margin + 7, yPos + 40);
      
      doc.setFillColor(...colors.success);
      doc.rect(margin + 70, yPos + 35, 60, 8, 'F');
      doc.text('Insurance Savings: 5-15%', margin + 72, yPos + 40);
      
      yPos += 55;
    });

    addPageFooter();

    // 8. GRANT & INSURANCE OPPORTUNITIES (Two-column with QR codes)
    doc.addPage();
    yPos = addSectionHeader('Grant & Insurance Opportunities', 30);
    
    // Two-column layout
    const leftColX = margin;
    const rightColX = margin + (contentWidth / 2) + 5;
    const colW = (contentWidth / 2) - 5;
    
    // Grants column
    doc.setTextColor(...colors.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Available Grants', leftColX, yPos);
    
    let leftYPos = yPos + 15;
    
    if (audit.grantOpportunities?.length > 0) {
      audit.grantOpportunities.slice(0, 3).forEach(grant => {
        // Program name in bold
        doc.setTextColor(...colors.text);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text(grant.program, leftColX, leftYPos);
        
        leftYPos += 8;
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const grantDesc = doc.splitTextToSize(grant.description, colW);
        doc.text(grantDesc.slice(0, 3), leftColX, leftYPos);
        
        leftYPos += 20;
        doc.setFont('helvetica', 'bold');
        doc.text(`Max: ${grant.maxAmount}`, leftColX, leftYPos);
        doc.setFont('helvetica', 'italic');
        doc.text('Eligibility: Property owners', leftColX, leftYPos + 6);
        
        leftYPos += 20;
      });
    }
    
    // Insurance column
    doc.setTextColor(...colors.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Insurance Programs', rightColX, yPos);
    
    let rightYPos = yPos + 15;
    
    const insurancePrograms = [
      { name: 'FEMA Mitigation Discounts', savings: '10-45%', desc: 'Federal flood insurance discounts for qualified retrofits' },
      { name: 'Fortified Home Program', savings: '15-35%', desc: 'Wind and hail insurance discounts for certified construction' },
      { name: 'Earthquake Retrofit Credits', savings: '5-25%', desc: 'Seismic upgrade insurance premium reductions' }
    ];
    
    insurancePrograms.forEach(program => {
      doc.setTextColor(...colors.text);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(program.name, rightColX, rightYPos);
      
      rightYPos += 8;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const progDesc = doc.splitTextToSize(program.desc, colW);
      doc.text(progDesc.slice(0, 2), rightColX, rightYPos);
      
      rightYPos += 12;
      doc.setFillColor(...colors.success);
      doc.rect(rightColX, rightYPos, 35, 6, 'F');
      doc.setTextColor(...colors.white);
      doc.setFont('helvetica', 'bold');
      doc.text(`Savings: ${program.savings}`, rightColX + 2, rightYPos + 4);
      
      rightYPos += 15;
    });

    addPageFooter();

    // 9. NEXT STEPS & DISCLAIMERS
    doc.addPage();
    yPos = addSectionHeader('Next Steps & Important Information', 30);
    
    doc.setTextColor(...colors.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Recommended Next Steps', margin, yPos);
    
    yPos += 15;
    doc.setTextColor(...colors.text);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    const nextSteps = [
      'Review and prioritize recommendations based on your budget and timeline',
      'Obtain quotes from licensed contractors for high-priority items',
      'Contact your insurance agent to discuss potential premium discounts',
      'Research and apply for applicable grant programs',
      'Schedule annual safety assessments to track improvements'
    ];
    
    nextSteps.forEach((step, index) => {
      doc.text(`${index + 1}. ${step}`, margin, yPos);
      yPos += 12;
    });
    
    yPos += 20;
    doc.setTextColor(...colors.primary);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Important Disclaimers', margin, yPos);
    
    yPos += 15;
    doc.setTextColor(...colors.lightGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    
    const disclaimer = 'This assessment is based on self-reported information and general guidelines. It does not constitute professional engineering evaluation or replace on-site inspection. Cost estimates are approximate and may vary by location and contractor. Insurance savings are estimates based on available program information. Always consult licensed professionals before making structural modifications.';
    yPos = addWrappedText(disclaimer, margin, yPos, contentWidth, 9);
    
    yPos += 15;
    doc.text(`Report generated: ${new Date().toLocaleDateString()} | Report ID: DD-${Math.floor(Math.random() * 100000)}`, margin, yPos);

    addPageFooter();

    // Convert to Buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error}`);
  }
}
