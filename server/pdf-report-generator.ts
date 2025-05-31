
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export interface AIAnalysis {
  executiveSummary: string;
  riskScore: number;
  priorityRecommendations: Array<{
    category: string;
    priority: 'high' | 'medium' | 'low';
    recommendation: string;
    reasoning: string;
    estimatedCost: string;
    potentialSavings: string;
    femaReference?: string;
  }>;
  vulnerabilityAnalysis: {
    structural: string;
    preparedness: string;
    recovery: string;
  };
  actionPlan: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  customInsights: string[];
}

interface ReportData extends AIAnalysis {
  homeInfo: {
    zipCode: string;
    primaryHazard: string;
    homeType?: string;
    yearBuilt?: string;
    address?: string;
  };
  generatedDate: string;
  reportId: string;
}

export class PDFReportGenerator {
  private doc: PDFKit.PDFDocument;
  private pageMargin = 50;
  private pageWidth = 595.28; // A4 width in points
  private pageHeight = 841.89; // A4 height in points
  private colors = {
    primary: '#16a34a', // disaster-green-600
    secondary: '#4ade80', // disaster-mint-500
    accent: '#dc2626', // red-600
    text: '#1f2937', // gray-800
    textLight: '#6b7280', // gray-500
    background: '#f9fafb', // gray-50
  };

  constructor() {
    this.doc = new PDFDocument({
      size: 'A4',
      margins: { top: this.pageMargin, bottom: this.pageMargin, left: this.pageMargin, right: this.pageMargin }
    });
  }

  async generateReport(reportData: ReportData): Promise<Buffer> {
    // Title Page
    this.createTitlePage(reportData);
    
    // Executive Summary
    this.addPage();
    this.createExecutiveSummary(reportData);
    
    // Risk Assessment
    this.addPage();
    this.createRiskAssessment(reportData);
    
    // Detailed Recommendations
    this.addPage();
    this.createRecommendations(reportData);
    
    // Action Plan
    this.addPage();
    this.createActionPlan(reportData);
    
    // Cost-Benefit Analysis
    this.addPage();
    this.createCostBenefitAnalysis(reportData);
    
    // Resources & References
    this.addPage();
    this.createResourcesPage(reportData);

    this.doc.end();
    
    return new Promise((resolve, reject) => {
      const buffers: Buffer[] = [];
      this.doc.on('data', buffers.push.bind(buffers));
      this.doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      this.doc.on('error', reject);
    });
  }

  private createTitlePage(reportData: ReportData) {
    // Header with logo area
    this.doc
      .rect(0, 0, this.pageWidth, 120)
      .fill(this.colors.primary);

    // Title
    this.doc
      .fillColor('white')
      .fontSize(32)
      .font('Helvetica-Bold')
      .text('DISASTER PREPAREDNESS', this.pageMargin, 30)
      .text('AUDIT REPORT', this.pageMargin, 70);

    // Home Information Box
    const boxY = 180;
    this.doc
      .rect(this.pageMargin, boxY, this.pageWidth - 2 * this.pageMargin, 120)
      .fillAndStroke(this.colors.background, this.colors.primary);

    this.doc
      .fillColor(this.colors.text)
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Property Assessment', this.pageMargin + 20, boxY + 20);

    this.doc
      .fontSize(12)
      .font('Helvetica')
      .fillColor(this.colors.textLight)
      .text(`ZIP Code: ${reportData.homeInfo.zipCode}`, this.pageMargin + 20, boxY + 45)
      .text(`Primary Hazard: ${reportData.homeInfo.primaryHazard}`, this.pageMargin + 20, boxY + 65)
      .text(`Home Type: ${reportData.homeInfo.homeType || 'Not specified'}`, this.pageMargin + 20, boxY + 85);

    // Risk Score Circle
    const circleX = this.pageWidth - 150;
    const circleY = boxY + 60;
    this.drawRiskScoreCircle(circleX, circleY, reportData.riskScore);

    // Report Details
    this.doc
      .fontSize(10)
      .fillColor(this.colors.textLight)
      .text(`Report ID: ${reportData.reportId}`, this.pageMargin, 350)
      .text(`Generated: ${reportData.generatedDate}`, this.pageMargin, 365)
      .text('Prepared by: Disaster Dodger™ AI Analysis', this.pageMargin, 380);

    // Key Highlights Box
    const highlightsY = 420;
    this.doc
      .rect(this.pageMargin, highlightsY, this.pageWidth - 2 * this.pageMargin, 200)
      .fillAndStroke('#fef3c7', '#f59e0b');

    this.doc
      .fillColor(this.colors.text)
      .fontSize(14)
      .font('Helvetica-Bold')
      .text('🎯 KEY HIGHLIGHTS', this.pageMargin + 20, highlightsY + 20);

    const highlights = [
      `${reportData.priorityRecommendations.filter(r => r.priority === 'high').length} High-Priority Recommendations`,
      `Potential Insurance Savings: Up to 25%`,
      `${reportData.actionPlan.immediate.length} Immediate Actions Required`,
      `Comprehensive ${reportData.homeInfo.primaryHazard} Protection Plan`
    ];

    highlights.forEach((highlight, index) => {
      this.doc
        .fontSize(11)
        .font('Helvetica')
        .fillColor(this.colors.text)
        .text(`• ${highlight}`, this.pageMargin + 30, highlightsY + 50 + (index * 25));
    });

    // Footer
    this.doc
      .fontSize(8)
      .fillColor(this.colors.textLight)
      .text('This report is based on FEMA guidelines and industry best practices. Professional consultation recommended for implementation.',
        this.pageMargin, this.pageHeight - 80, {
          width: this.pageWidth - 2 * this.pageMargin,
          align: 'center'
        });
  }

  private createExecutiveSummary(reportData: ReportData) {
    this.addSectionHeader('EXECUTIVE SUMMARY');

    // Risk Level Banner
    const riskLevel = this.getRiskLevel(reportData.riskScore);
    const riskColor = this.getRiskColor(reportData.riskScore);
    
    this.doc
      .rect(this.pageMargin, this.doc.y + 10, this.pageWidth - 2 * this.pageMargin, 40)
      .fill(riskColor);

    this.doc
      .fillColor('white')
      .fontSize(14)
      .font('Helvetica-Bold')
      .text(`RISK LEVEL: ${riskLevel.toUpperCase()}`, this.pageMargin + 20, this.doc.y - 25);

    this.doc.moveDown(2);

    // Summary text
    this.doc
      .fillColor(this.colors.text)
      .fontSize(11)
      .font('Helvetica')
      .text(
        `Your home in ZIP code ${reportData.homeInfo.zipCode} faces ${reportData.homeInfo.primaryHazard.toLowerCase()} risks that require attention. This comprehensive assessment identifies ${reportData.priorityRecommendations.length} specific recommendations to enhance your disaster preparedness and potentially reduce insurance costs.`,
        { align: 'justify' }
      );

    this.doc.moveDown();

    // Vulnerability Analysis
    this.addSubsectionHeader('Vulnerability Analysis');
    
    const analyses = [
      { title: 'Structural', content: reportData.vulnerabilityAnalysis.structural },
      { title: 'Preparedness', content: reportData.vulnerabilityAnalysis.preparedness },
      { title: 'Recovery', content: reportData.vulnerabilityAnalysis.recovery }
    ];

    analyses.forEach(analysis => {
      this.doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .fillColor(this.colors.primary)
        .text(`${analysis.title}:`, { continued: true })
        .font('Helvetica')
        .fillColor(this.colors.text)
        .text(` ${analysis.content}`, { paragraphGap: 8 });
    });

    // Custom Insights
    if (reportData.customInsights.length > 0) {
      this.doc.moveDown();
      this.addSubsectionHeader('Key Insights');
      
      reportData.customInsights.forEach(insight => {
        this.doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor(this.colors.text)
          .text(`• ${insight}`, { paragraphGap: 5 });
      });
    }
  }

  private createRiskAssessment(reportData: ReportData) {
    this.addSectionHeader('DETAILED RISK ASSESSMENT');

    // Risk Score Visualization
    this.drawRiskScoreCircle(this.pageWidth - 120, this.doc.y + 20, reportData.riskScore);

    const riskFactors = [
      { factor: 'Geographic Location', score: this.calculateLocationRisk(reportData.homeInfo.primaryHazard) },
      { factor: 'Building Age', score: this.calculateAgeRisk(reportData.homeInfo.yearBuilt) },
      { factor: 'Preparedness Level', score: this.calculatePreparednessRisk(reportData) },
      { factor: 'Structural Integrity', score: this.calculateStructuralRisk(reportData) }
    ];

    this.doc.moveDown();
    this.addSubsectionHeader('Risk Factors Breakdown');

    riskFactors.forEach(factor => {
      const barWidth = (factor.score / 100) * 200;
      const barColor = this.getRiskColor(factor.score);

      this.doc
        .fontSize(10)
        .font('Helvetica')
        .fillColor(this.colors.text)
        .text(factor.factor, this.pageMargin, this.doc.y + 5);

      // Risk bar
      this.doc
        .rect(this.pageMargin + 150, this.doc.y - 8, 200, 12)
        .stroke(this.colors.textLight);

      this.doc
        .rect(this.pageMargin + 150, this.doc.y - 8, barWidth, 12)
        .fill(barColor);

      this.doc
        .fillColor(this.colors.text)
        .text(`${factor.score}/100`, this.pageMargin + 360, this.doc.y - 15);

      this.doc.moveDown(0.5);
    });
  }

  private createRecommendations(reportData: ReportData) {
    this.addSectionHeader('PRIORITY RECOMMENDATIONS');

    const priorityOrder = { high: 1, medium: 2, low: 3 };
    const sortedRecommendations = reportData.priorityRecommendations.sort(
      (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
    );

    sortedRecommendations.forEach((rec, index) => {
      if (this.doc.y > 700) this.addPage();

      // Priority Badge
      const priorityColor = rec.priority === 'high' ? '#dc2626' : 
                           rec.priority === 'medium' ? '#f59e0b' : '#10b981';

      this.doc
        .rect(this.pageMargin, this.doc.y, 60, 20)
        .fill(priorityColor);

      this.doc
        .fillColor('white')
        .fontSize(8)
        .font('Helvetica-Bold')
        .text(rec.priority.toUpperCase(), this.pageMargin + 15, this.doc.y - 15);

      // Category
      this.doc
        .fillColor(this.colors.primary)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text(rec.category, this.pageMargin + 80, this.doc.y - 20);

      this.doc.moveDown(0.5);

      // Recommendation
      this.doc
        .fillColor(this.colors.text)
        .fontSize(11)
        .font('Helvetica-Bold')
        .text(rec.recommendation, { paragraphGap: 5 });

      // Reasoning
      this.doc
        .fontSize(10)
        .font('Helvetica')
        .text(rec.reasoning, { paragraphGap: 8 });

      // Cost and Savings
      this.doc
        .fontSize(9)
        .fillColor(this.colors.textLight)
        .text(`Estimated Cost: ${rec.estimatedCost} | Potential Savings: ${rec.potentialSavings}`, 
               { paragraphGap: 8 });

      if (rec.femaReference) {
        this.doc
          .fontSize(8)
          .fillColor(this.colors.primary)
          .text(`FEMA Reference: ${rec.femaReference}`, { paragraphGap: 5 });
      }

      this.doc.moveDown();
      
      // Separator line
      this.doc
        .moveTo(this.pageMargin, this.doc.y)
        .lineTo(this.pageWidth - this.pageMargin, this.doc.y)
        .stroke(this.colors.background);

      this.doc.moveDown(0.5);
    });
  }

  private createActionPlan(reportData: ReportData) {
    this.addSectionHeader('IMPLEMENTATION ACTION PLAN');

    const actionSections = [
      { title: 'Immediate Actions (This Week)', items: reportData.actionPlan.immediate, color: '#dc2626' },
      { title: 'Short-term Actions (1-3 Months)', items: reportData.actionPlan.shortTerm, color: '#f59e0b' },
      { title: 'Long-term Actions (6-12 Months)', items: reportData.actionPlan.longTerm, color: '#10b981' }
    ];

    actionSections.forEach(section => {
      if (this.doc.y > 650) this.addPage();

      // Section header with colored line
      this.doc
        .moveTo(this.pageMargin, this.doc.y + 10)
        .lineTo(this.pageWidth - this.pageMargin, this.doc.y + 10)
        .lineWidth(3)
        .stroke(section.color);

      this.doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor(this.colors.text)
        .text(section.title, this.pageMargin, this.doc.y + 20);

      this.doc.moveDown();

      section.items.forEach((item, index) => {
        this.doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor(this.colors.text)
          .text(`${index + 1}. ${item}`, this.pageMargin + 20, undefined, { paragraphGap: 8 });
      });

      this.doc.moveDown();
    });
  }

  private createCostBenefitAnalysis(reportData: ReportData) {
    this.addSectionHeader('COST-BENEFIT ANALYSIS');

    // Calculate totals
    const totalCosts = this.calculateTotalCosts(reportData.priorityRecommendations);
    const totalSavings = this.calculateTotalSavings(reportData.priorityRecommendations);

    // Summary boxes
    const boxWidth = (this.pageWidth - 3 * this.pageMargin) / 2;
    
    // Investment box
    this.doc
      .rect(this.pageMargin, this.doc.y + 10, boxWidth, 80)
      .fillAndStroke('#fef3c7', '#f59e0b');

    this.doc
      .fillColor(this.colors.text)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Total Investment', this.pageMargin + 20, this.doc.y - 60)
      .fontSize(20)
      .text(totalCosts, this.pageMargin + 20, this.doc.y + 10);

    // Savings box
    this.doc
      .rect(this.pageMargin + boxWidth + 20, this.doc.y - 70, boxWidth, 80)
      .fillAndStroke('#dcfce7', '#16a34a');

    this.doc
      .fillColor(this.colors.text)
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Potential Savings', this.pageMargin + boxWidth + 40, this.doc.y - 60)
      .fontSize(20)
      .text(totalSavings, this.pageMargin + boxWidth + 40, this.doc.y + 10);

    this.doc.moveDown(4);

    // ROI Calculation
    this.addSubsectionHeader('Return on Investment');
    this.doc
      .fontSize(11)
      .font('Helvetica')
      .fillColor(this.colors.text)
      .text('Based on industry data and insurance company statistics:', { paragraphGap: 8 });

    const roiPoints = [
      'Insurance premium reductions typically pay for mitigation measures within 3-7 years',
      'Homes with disaster preparedness measures experience 40-60% less damage during events',
      'Emergency preparedness reduces post-disaster recovery time by an average of 50%',
      'Property values increase 3-5% with documented disaster preparedness measures'
    ];

    roiPoints.forEach(point => {
      this.doc
        .fontSize(10)
        .text(`• ${point}`, this.pageMargin + 20, undefined, { paragraphGap: 5 });
    });
  }

  private createResourcesPage(reportData: ReportData) {
    this.addSectionHeader('RESOURCES & NEXT STEPS');

    const resources = [
      {
        category: 'Emergency Management',
        items: [
          'FEMA.gov - Federal Emergency Management Agency',
          'Ready.gov - National preparedness information',
          'Local Emergency Management Office'
        ]
      },
      {
        category: 'Insurance Resources',
        items: [
          'Your insurance agent for coverage review',
          'FAIR Plan (high-risk areas)',
          'Flood insurance through NFIP'
        ]
      },
      {
        category: 'Professional Services',
        items: [
          'Certified home inspectors',
          'Licensed contractors for improvements',
          'Emergency preparedness consultants'
        ]
      }
    ];

    resources.forEach(section => {
      this.addSubsectionHeader(section.category);
      section.items.forEach(item => {
        this.doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor(this.colors.text)
          .text(`• ${item}`, this.pageMargin + 20, undefined, { paragraphGap: 5 });
      });
      this.doc.moveDown();
    });

    // Contact Information
    this.doc.moveDown(2);
    this.doc
      .rect(this.pageMargin, this.doc.y, this.pageWidth - 2 * this.pageMargin, 60)
      .fill(this.colors.primary);

    this.doc
      .fillColor('white')
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('Need Help Implementing These Recommendations?', this.pageMargin + 20, this.doc.y - 40)
      .fontSize(10)
      .font('Helvetica')
      .text('Contact Disaster Dodger™ for expert consultation and implementation support', this.pageMargin + 20, this.doc.y + 5)
      .text('Email: support@disasterdodger.com | Web: disasterdodger.com', this.pageMargin + 20, this.doc.y + 5);
  }

  // Helper methods
  private addPage() {
    this.doc.addPage();
  }

  private addSectionHeader(title: string) {
    this.doc
      .fontSize(18)
      .font('Helvetica-Bold')
      .fillColor(this.colors.primary)
      .text(title, this.pageMargin, this.doc.y + 10);
    
    this.doc
      .moveTo(this.pageMargin, this.doc.y + 5)
      .lineTo(this.pageWidth - this.pageMargin, this.doc.y + 5)
      .lineWidth(2)
      .stroke(this.colors.primary);

    this.doc.moveDown(1);
  }

  private addSubsectionHeader(title: string) {
    this.doc
      .fontSize(14)
      .font('Helvetica-Bold')
      .fillColor(this.colors.text)
      .text(title, this.pageMargin, this.doc.y + 5);

    this.doc.moveDown(0.5);
  }

  private drawRiskScoreCircle(x: number, y: number, score: number) {
    const radius = 30;
    const riskColor = this.getRiskColor(score);

    // Outer circle
    this.doc
      .circle(x, y, radius)
      .fillAndStroke(riskColor, this.colors.text);

    // Score text
    this.doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .fillColor('white')
      .text(score.toString(), x - 10, y - 8);

    this.doc
      .fontSize(8)
      .text('RISK', x - 10, y + 8);
  }

  private getRiskLevel(score: number): string {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'High';
    if (score >= 40) return 'Moderate';
    if (score >= 20) return 'Low';
    return 'Very Low';
  }

  private getRiskColor(score: number): string {
    if (score >= 80) return '#dc2626'; // red-600
    if (score >= 60) return '#ea580c'; // orange-600
    if (score >= 40) return '#f59e0b'; // amber-500
    if (score >= 20) return '#eab308'; // yellow-500
    return '#16a34a'; // green-600
  }

  private calculateLocationRisk(hazard: string): number {
    const hazardRiskMap: { [key: string]: number } = {
      'earthquake': 75,
      'wildfire': 70,
      'flood': 65,
      'hurricane': 80,
      'tornado': 85
    };
    return hazardRiskMap[hazard.toLowerCase()] || 50;
  }

  private calculateAgeRisk(yearBuilt?: string): number {
    if (!yearBuilt) return 50;
    const age = new Date().getFullYear() - parseInt(yearBuilt);
    if (age > 50) return 80;
    if (age > 30) return 60;
    if (age > 15) return 40;
    return 20;
  }

  private calculatePreparednessRisk(data: ReportData): number {
    const actionCount = data.actionPlan.immediate.length + data.actionPlan.shortTerm.length;
    if (actionCount > 10) return 80;
    if (actionCount > 5) return 60;
    if (actionCount > 2) return 40;
    return 20;
  }

  private calculateStructuralRisk(data: ReportData): number {
    const highPriorityCount = data.priorityRecommendations.filter(r => r.priority === 'high').length;
    if (highPriorityCount > 5) return 85;
    if (highPriorityCount > 3) return 65;
    if (highPriorityCount > 1) return 45;
    return 25;
  }

  private calculateTotalCosts(recommendations: any[]): string {
    // Simplified cost calculation
    const totalCost = recommendations.reduce((total, rec) => {
      const costStr = rec.estimatedCost.replace(/[^0-9]/g, '');
      return total + (parseInt(costStr) || 0);
    }, 0);
    
    return `$${totalCost.toLocaleString()}`;
  }

  private calculateTotalSavings(recommendations: any[]): string {
    // Simplified savings calculation
    return 'Up to 25% annually';
  }
}
