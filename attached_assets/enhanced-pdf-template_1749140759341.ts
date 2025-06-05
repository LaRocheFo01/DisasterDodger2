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

    // Modern color palette - deep blues and vibrant accents
    const colors = {
      primary: [14, 42, 71],        // Deep navy blue
      secondary: [29, 78, 216],     // Royal blue  
      accent: [16, 185, 129],       // Emerald green
      warning: [251, 146, 60],      // Orange
      danger: [239, 68, 68],        // Red
      success: [34, 197, 94],       // Green
      neutral: [71, 85, 105],       // Slate gray
      lightGray: [148, 163, 184],   // Light slate
      background: [248, 250, 252],  // Very light blue-gray
      white: [255, 255, 255],       // Pure white
      darkText: [15, 23, 42],       // Almost black
      lightText: [100, 116, 139]    // Medium gray
    };

    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - (2 * margin);
    let yPos = 30;
    let pageNumber = 1;

    // Enhanced helper functions
    const addModernHeader = () => {
      // Gradient-style header with geometric accent
      doc.setFillColor(...colors.primary);
      doc.rect(0, 0, pageWidth, 12, 'F');
      
      // Accent stripe
      doc.setFillColor(...colors.accent);
      doc.rect(0, 12, pageWidth, 3, 'F');
      
      // Logo/Brand area
      doc.setTextColor(...colors.white);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text('DISASTER DODGER™', margin, 9);
      
      // Section indicator
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Professional Safety Assessment', pageWidth - margin, 9, { align: 'right' });
    };

    const addModernFooter = () => {
      const footerY = pageHeight - 15;
      
      // Footer background
      doc.setFillColor(...colors.background);
      doc.rect(0, footerY, pageWidth, 15, 'F');
      
      // Accent line
      doc.setFillColor(...colors.accent);
      doc.rect(0, footerY, pageWidth, 1, 'F');
      
      // Footer content
      doc.setTextColor(...colors.lightText);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('Protecting Communities Through Preparedness', margin, footerY + 8);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${pageNumber}`, pageWidth - margin, footerY + 8, { align: 'right' });
      
      pageNumber++;
    };

    const checkPageBreak = (neededSpace: number): boolean => {
      if (yPos + neededSpace > 260) {
        addModernFooter();
        doc.addPage();
        addModernHeader();
        yPos = 25;
        return true;
      }
      return false;
    };

    const addStyledText = (text: string, x: number, y: number, maxWidth: number, options: {
      fontSize?: number;
      fontStyle?: 'normal' | 'bold' | 'italic';
      color?: number[];
      lineHeight?: number;
    } = {}): number => {
      const { fontSize = 10, fontStyle = 'normal', color = colors.darkText, lineHeight = 1.4 } = options;
      
      doc.setFontSize(fontSize);
      doc.setFont('helvetica', fontStyle);
      doc.setTextColor(...color);
      
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * 0.35 * lineHeight);
    };

    const addSectionHeader = (title: string, yPosition: number, options: {
      subtitle?: string;
      icon?: string;
      color?: number[];
    } = {}): number => {
      const { subtitle, color = colors.primary } = options;
      
      // Section background with subtle gradient effect
      doc.setFillColor(...colors.background);
      doc.rect(margin - 5, yPosition - 8, contentWidth + 10, subtitle ? 25 : 18, 'F');
      
      // Left accent bar
      doc.setFillColor(...color);
      doc.rect(margin - 5, yPosition - 8, 4, subtitle ? 25 : 18, 'F');
      
      // Main title
      doc.setTextColor(...color);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 5, yPosition + 2);
      
      // Subtitle if provided
      if (subtitle) {
        doc.setTextColor(...colors.lightText);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text(subtitle, margin + 5, yPosition + 12);
        return yPosition + 35;
      }
      
      return yPosition + 28;
    };

    const addInfoCard = (title: string, content: string, yPosition: number, options: {
      width?: number;
      height?: number;
      color?: number[];
      textColor?: number[];
    } = {}): number => {
      const { width = contentWidth, height = 40, color = colors.white, textColor = colors.darkText } = options;
      
      // Card shadow effect
      doc.setFillColor(200, 200, 200);
      doc.rect(margin + 2, yPosition + 2, width, height, 'F');
      
      // Main card
      doc.setFillColor(...color);
      doc.rect(margin, yPosition, width, height, 'F');
      
      // Card border
      doc.setDrawColor(...colors.lightGray);
      doc.setLineWidth(0.5);
      doc.rect(margin, yPosition, width, height, 'S');
      
      // Title
      doc.setTextColor(...colors.primary);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(title, margin + 8, yPosition + 12);
      
      // Content
      doc.setTextColor(...textColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const lines = doc.splitTextToSize(content, width - 16);
      doc.text(lines, margin + 8, yPosition + 22);
      
      return yPosition + height + 10;
    };

    const addRiskMeter = (label: string, value: number, x: number, y: number, width: number = 80): void => {
      const meterHeight = 8;
      const riskColor = value >= 70 ? colors.danger : value >= 40 ? colors.warning : colors.success;
      
      // Background bar
      doc.setFillColor(...colors.background);
      doc.rect(x, y, width, meterHeight, 'F');
      
      // Risk bar
      doc.setFillColor(...riskColor);
      doc.rect(x, y, (value / 100) * width, meterHeight, 'F');
      
      // Border
      doc.setDrawColor(...colors.lightGray);
      doc.rect(x, y, width, meterHeight, 'S');
      
      // Label and value
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(label, x, y - 3);
      
      doc.setFont('helvetica', 'bold');
      doc.text(`${value}%`, x + width + 5, y + 6);
    };

    // 1. STUNNING COVER PAGE
    // Hero background with gradient effect
    doc.setFillColor(...colors.primary);
    doc.rect(0, 0, pageWidth, 120, 'F');
    
    // Accent geometric shapes
    doc.setFillColor(...colors.secondary);
    doc.triangle(pageWidth - 40, 0, pageWidth, 0, pageWidth, 40);
    
    doc.setFillColor(...colors.accent);
    doc.circle(30, 30, 15, 'F');
    doc.setFillColor(...colors.primary);
    doc.circle(30, 30, 10, 'F');
    
    // Main title with hierarchy
    doc.setTextColor(...colors.white);
    doc.setFontSize(36);
    doc.setFont('helvetica', 'bold');
    doc.text('DISASTER', pageWidth / 2, 45, { align: 'center' });
    
    doc.setTextColor(...colors.accent);
    doc.setFontSize(36);
    doc.text('DODGER™', pageWidth / 2, 65, { align: 'center' });
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Comprehensive Safety Assessment Report', pageWidth / 2, 85, { align: 'center' });
    
    doc.setFontSize(11);
    doc.text(`Generated on ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, pageWidth / 2, 100, { align: 'center' });

    // Property information panel
    yPos = 135;
    doc.setFillColor(...colors.white);
    doc.rect(margin, yPos, contentWidth, 70, 'F');
    
    // Panel header
    doc.setFillColor(...colors.secondary);
    doc.rect(margin, yPos, contentWidth, 15, 'F');
    doc.setTextColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('PROPERTY ASSESSMENT DETAILS', margin + 10, yPos + 10);
    
    // Property details in two columns
    yPos += 25;
    const leftCol = margin + 10;
    const rightCol = margin + (contentWidth / 2) + 10;
    
    const propertyInfo = [
      { label: 'ZIP Code', value: auditData.zipCode || 'Not specified' },
      { label: 'Primary Hazard', value: audit.primaryHazards?.[0] || 'Multiple hazards' },
      { label: 'Assessment Date', value: new Date().toLocaleDateString() },
      { label: 'Report ID', value: `DD-${Date.now().toString().slice(-6)}` }
    ];

    propertyInfo.forEach((info, index) => {
      const x = index % 2 === 0 ? leftCol : rightCol;
      const y = yPos + Math.floor(index / 2) * 15;
      
      doc.setTextColor(...colors.lightText);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(info.label.toUpperCase(), x, y);
      
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(info.value, x, y + 8);
    });

    // Risk score spotlight
    yPos = 225;
    const riskScoreColor = audit.riskScore >= 70 ? colors.danger : 
                          audit.riskScore >= 40 ? colors.warning : 
                          colors.success;
    
    // Risk score card with shadow
    doc.setFillColor(220, 220, 220);
    doc.roundedRect(margin + 5, yPos + 5, contentWidth - 10, 35, 8, 8, 'F');
    
    doc.setFillColor(...riskScoreColor);
    doc.roundedRect(margin, yPos, contentWidth - 10, 35, 8, 8, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text('OVERALL RISK SCORE', pageWidth / 2, yPos + 12, { align: 'center' });
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text(`${audit.riskScore}/100`, pageWidth / 2, yPos + 28, { align: 'center' });

    addModernFooter();

    // 2. EXECUTIVE DASHBOARD
    doc.addPage();
    addModernHeader();
    yPos = addSectionHeader('Executive Dashboard', 30, { 
      subtitle: 'Key insights and immediate actions',
      color: colors.secondary 
    });

    // Key metrics in cards
    const cardWidth = (contentWidth - 20) / 3;
    const metrics = [
      { title: 'Risk Level', value: audit.riskScore >= 70 ? 'HIGH' : audit.riskScore >= 40 ? 'MEDIUM' : 'LOW', color: audit.riskScore >= 70 ? colors.danger : audit.riskScore >= 40 ? colors.warning : colors.success },
      { title: 'Primary Threat', value: audit.primaryHazards?.[0] || 'Multiple', color: colors.secondary },
      { title: 'Actions Needed', value: audit.recommendations?.length || '8', color: colors.accent }
    ];

    metrics.forEach((metric, index) => {
      const x = margin + (index * (cardWidth + 10));
      
      // Card background
      doc.setFillColor(...colors.white);
      doc.rect(x, yPos, cardWidth, 45, 'F');
      
      // Top accent bar
      doc.setFillColor(...metric.color);
      doc.rect(x, yPos, cardWidth, 4, 'F');
      
      // Border
      doc.setDrawColor(...colors.lightGray);
      doc.rect(x, yPos, cardWidth, 45, 'S');
      
      // Content
      doc.setTextColor(...colors.lightText);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text(metric.title.toUpperCase(), x + 8, yPos + 18);
      
      doc.setTextColor(...metric.color);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(metric.value, x + 8, yPos + 32);
    });

    yPos += 65;

    // Risk breakdown chart
    yPos = addSectionHeader('Risk Analysis by Category', yPos, { color: colors.primary });
    
    if (audit.primaryHazards && audit.primaryHazards.length > 0) {
      audit.primaryHazards.slice(0, 5).forEach((hazard, index) => {
        const riskValue = Math.floor(Math.random() * 40 + 30); // Sample risk values
        addRiskMeter(hazard, riskValue, margin, yPos, contentWidth - 60);
        yPos += 20;
      });
    }

    yPos += 20;

    // Priority actions preview
    yPos = addSectionHeader('Top Priority Actions', yPos, { color: colors.accent });
    
    audit.recommendations?.slice(0, 3).forEach((rec, index) => {
      const priorityColor = rec.priority === 'High' ? colors.danger :
                           rec.priority === 'Medium' ? colors.warning :
                           colors.success;
      
      // Action item
      doc.setFillColor(...colors.background);
      doc.rect(margin, yPos, contentWidth, 25, 'F');
      
      // Priority indicator
      doc.setFillColor(...priorityColor);
      doc.circle(margin + 12, yPos + 12, 6, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text((index + 1).toString(), margin + 12, yPos + 15, { align: 'center' });
      
      // Action text
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.title, margin + 25, yPos + 10);
      
      doc.setTextColor(...colors.lightText);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(`Cost: ${rec.estimatedCost} • Priority: ${rec.priority}`, margin + 25, yPos + 18);
      
      yPos += 30;
    });

    addModernFooter();

    // 3. DETAILED ASSESSMENT
    doc.addPage();
    addModernHeader();
    yPos = addSectionHeader('Assessment Questions & Responses', 30, { 
      subtitle: 'Your complete safety evaluation questionnaire',
      color: colors.primary 
    });

    const qaData = [
      { question: 'Property Location', answer: `ZIP Code: ${auditData.zipCode || 'Not provided'}` },
      { question: 'Home Characteristics', answer: `${auditData.homeTypeResponse || 'Not specified'} • Built: ${auditData.yearBuiltResponse || 'Unknown'}` },
      { question: 'Ownership Status', answer: auditData.ownershipStatusResponse || 'Not specified' },
      { question: 'Property Value', answer: auditData.insuredValueResponse || 'Not specified' },
      { question: 'Current Insurance', answer: auditData.insurancePoliciesResponse?.join(', ') || 'None specified' },
      { question: 'Previous Grant History', answer: auditData.previousGrantsResponse || 'Not specified' }
    ];

    // Add hazard-specific questions
    if (audit.primaryHazards?.includes('Flood')) {
      qaData.push(
        { question: 'Electrical System Location', answer: auditData.electricalLocation || 'Not specified' },
        { question: 'Flood Protection Measures', answer: auditData.floodBarriers || 'Not specified' },
        { question: 'Water Management Systems', answer: auditData.sumpPump || 'Not specified' }
      );
    }

    qaData.forEach((qa, index) => {
      checkPageBreak(35);
      
      // Question card
      doc.setFillColor(...colors.white);
      doc.rect(margin, yPos, contentWidth, 30, 'F');
      
      // Question number badge
      doc.setFillColor(...colors.secondary);
      doc.circle(margin + 15, yPos + 15, 8, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text((index + 1).toString(), margin + 15, yPos + 18, { align: 'center' });
      
      // Question and answer
      doc.setTextColor(...colors.primary);
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.text(qa.question, margin + 30, yPos + 10);
      
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const answerLines = doc.splitTextToSize(qa.answer, contentWidth - 40);
      doc.text(answerLines, margin + 30, yPos + 20);
      
      // Border
      doc.setDrawColor(...colors.lightGray);
      doc.rect(margin, yPos, contentWidth, 30, 'S');
      
      yPos += 35;
    });

    addModernFooter();

    // 4. RECOMMENDATIONS
    doc.addPage();
    addModernHeader();
    yPos = addSectionHeader('Detailed Recommendations', 30, { 
      subtitle: 'Prioritized action plan for enhanced safety',
      color: colors.accent 
    });

    audit.recommendations?.forEach((rec, index) => {
      checkPageBreak(70);
      
      const priorityColor = rec.priority === 'High' ? colors.danger :
                           rec.priority === 'Medium' ? colors.warning :
                           colors.success;
      
      // Recommendation card with enhanced styling
      doc.setFillColor(245, 245, 245);
      doc.rect(margin + 3, yPos + 3, contentWidth, 60, 'F'); // Shadow
      
      doc.setFillColor(...colors.white);
      doc.rect(margin, yPos, contentWidth, 60, 'F');
      
      // Priority stripe
      doc.setFillColor(...priorityColor);
      doc.rect(margin, yPos, 6, 60, 'F');
      
      // Header section
      doc.setFillColor(...colors.background);
      doc.rect(margin + 6, yPos, contentWidth - 6, 20, 'F');
      
      // Priority badge
      doc.setFillColor(...priorityColor);
      doc.roundedRect(margin + 15, yPos + 5, 25, 10, 2, 2, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.priority.toUpperCase(), margin + 27, yPos + 12, { align: 'center' });
      
      // Title
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.title, margin + 50, yPos + 12);
      
      // Description
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      const descLines = doc.splitTextToSize(rec.description, contentWidth - 20);
      doc.text(descLines.slice(0, 3), margin + 15, yPos + 30);
      
      // Cost and benefit tags
      doc.setFillColor(...colors.secondary);
      doc.roundedRect(margin + 15, yPos + 48, 40, 8, 2, 2, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text(rec.estimatedCost, margin + 17, yPos + 53);
      
      doc.setFillColor(...colors.success);
      doc.roundedRect(margin + 60, yPos + 48, 50, 8, 2, 2, 'F');
      doc.text('Insurance Savings: 5-15%', margin + 62, yPos + 53);
      
      // Border
      doc.setDrawColor(...colors.lightGray);
      doc.rect(margin, yPos, contentWidth, 60, 'S');
      
      yPos += 70;
    });

    addModernFooter();

    // 5. FUNDING OPPORTUNITIES
    doc.addPage();
    addModernHeader();
    yPos = addSectionHeader('Funding & Insurance Opportunities', 30, { 
      subtitle: 'Available programs to support your safety investments',
      color: colors.success 
    });

    // Split into two columns
    const colWidth = (contentWidth - 15) / 2;
    
    // Grants section
    doc.setTextColor(...colors.success);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Available Grants', margin, yPos);
    
    let leftY = yPos + 20;
    
    if (audit.grantOpportunities?.length > 0) {
      audit.grantOpportunities.slice(0, 3).forEach(grant => {
        // Grant card
        doc.setFillColor(...colors.white);
        doc.rect(margin, leftY, colWidth, 50, 'F');
        
        doc.setFillColor(...colors.success);
        doc.rect(margin, leftY, colWidth, 6, 'F');
        
        doc.setTextColor(...colors.darkText);
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.text(grant.program, margin + 8, leftY + 18);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        const grantDesc = doc.splitTextToSize(grant.description, colWidth - 16);
        doc.text(grantDesc.slice(0, 2), margin + 8, leftY + 28);
        
        doc.setTextColor(...colors.success);
        doc.setFont('helvetica', 'bold');
        doc.text(`Maximum: ${grant.maxAmount}`, margin + 8, leftY + 42);
        
        doc.setDrawColor(...colors.lightGray);
        doc.rect(margin, leftY, colWidth, 50, 'S');
        
        leftY += 60;
      });
    }
    
    // Insurance programs section
    const rightX = margin + colWidth + 15;
    doc.setTextColor(...colors.secondary);
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Insurance Programs', rightX, yPos);
    
    let rightY = yPos + 20;
    
    const insurancePrograms = [
      { name: 'FEMA Mitigation Discounts', savings: '10-45%', desc: 'Federal flood insurance premium reductions for qualified home improvements' },
      { name: 'Fortified Home Certification', savings: '15-35%', desc: 'Wind and hail insurance discounts for certified construction standards' },
      { name: 'Earthquake Retrofit Program', savings: '5-25%', desc: 'Seismic upgrade insurance premium credits and state incentives' }
    ];
    
    insurancePrograms.forEach(program => {
      // Insurance card
      doc.setFillColor(...colors.white);
      doc.rect(rightX, rightY, colWidth, 50, 'F');
      
      doc.setFillColor(...colors.secondary);
      doc.rect(rightX, rightY, colWidth, 6, 'F');
      
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text(program.name, rightX + 8, rightY + 18);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      const progDesc = doc.splitTextToSize(program.desc, colWidth - 16);
      doc.text(progDesc.slice(0, 2), rightX + 8, rightY + 28);
      
      doc.setTextColor(...colors.secondary);
      doc.setFont('helvetica', 'bold');
      doc.text(`Savings: ${program.savings}`, rightX + 8, rightY + 42);
      
      doc.setDrawColor(...colors.lightGray);
      doc.rect(rightX, rightY, colWidth, 50, 'S');
      
      rightY += 60;
    });

    addModernFooter();

    // 6. ACTION PLAN & CLOSING
    doc.addPage();
    addModernHeader();
    yPos = addSectionHeader('Your Action Plan', 30, { 
      subtitle: 'Next steps to enhance your property\'s resilience',
      color: colors.primary 
    });

    // Implementation timeline
    const timelineSteps = [
      { phase: 'Immediate (0-30 days)', actions: ['Review priority recommendations', 'Contact insurance agent', 'Research local contractors'] },
      { phase: 'Short-term (1-6 months)', actions: ['Implement high-priority measures', 'Apply for applicable grants', 'Schedule professional inspections'] },
      { phase: 'Long-term (6+ months)', actions: ['Complete structural improvements', 'Annual safety reassessment', 'Update insurance coverage'] }
    ];

    timelineSteps.forEach((step, index) => {
      checkPageBreak(45);
      
      // Timeline card
      doc.setFillColor(...colors.background);
      doc.rect(margin, yPos, contentWidth, 40, 'F');
      
      // Phase indicator
      doc.setFillColor(index === 0 ? colors.danger : index === 1 ? colors.warning : colors.success);
      doc.circle(margin + 15, yPos + 20, 8, 'F');
      doc.setTextColor(...colors.white);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text((index + 1).toString(), margin + 15, yPos + 23, { align: 'center' });
      
      // Phase title
      doc.setTextColor(...colors.primary);
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text(step.phase, margin + 30, yPos + 15);
      
      // Actions
      doc.setTextColor(...colors.darkText);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      step.actions.forEach((action, actionIndex) => {
        doc.text(`• ${action}`, margin + 30, yPos + 25 + (actionIndex * 6));
      });
      
      doc.setDrawColor(...colors.lightGray);
      doc.rect(margin, yPos, contentWidth, 40, 'S');
      
      yPos += 50;
    });

    yPos += 20;

    // Important disclaimers with better formatting
    yPos = addSectionHeader('Important Information', yPos, { color: colors.neutral });
    
    const disclaimerText = 'This assessment is based on self-reported information and general safety guidelines. It does not constitute professional engineering evaluation or replace on-site inspection by qualified professionals. Cost estimates are approximate and may vary significantly by location, contractor, and specific property conditions. Insurance savings estimates are based on available program information and actual savings may vary. Always consult licensed professionals before making structural modifications or safety improvements.';
    
    doc.setFillColor(...colors.background);
    doc.rect(margin, yPos, contentWidth, 35, 'F');
    
    doc.setTextColor(...colors.lightText);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    addStyledText(disclaimerText, margin + 8, yPos + 8, contentWidth - 16, {
      fontSize: 9,
      color: colors.lightText,
      lineHeight: 1.3
    });
    
    yPos += 45;
    
    // Report metadata and contact info
    doc.setFillColor(...colors.primary);
    doc.rect(margin, yPos, contentWidth, 25, 'F');
    
    doc.setTextColor(...colors.white);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('REPORT INFORMATION', margin + 8, yPos + 8);
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const reportId = `DD-${Date.now().toString().slice(-6)}`;
    const reportDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    doc.text(`Report ID: ${reportId} • Generated: ${reportDate}`, margin + 8, yPos + 16);
    doc.text('For questions or support, visit DisasterDodger.com', margin + 8, yPos + 22);

    addModernFooter();

    // Convert to Buffer
    const pdfOutput = doc.output('arraybuffer');
    return Buffer.from(pdfOutput);
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error}`);
  }
}