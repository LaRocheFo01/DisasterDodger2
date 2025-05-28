
import PDFDocument from "pdfkit";
import { Request, Response } from "express";
import { storage } from "./storage";
import type { Audit } from "@shared/schema";

interface RiskAssessment {
  overallScore: number;
  categoryScores: {
    earthquake: number;
    wildfire: number;
    flood: number;
    hurricane: number;
  };
  riskLevel: string;
  primaryConcerns: string[];
}

interface UpgradePriority {
  category: string;
  priority: 'High' | 'Medium' | 'Low';
  description: string;
  costEstimate: string;
  femaReference: string;
  potentialSavings: string;
}

interface GrantOpportunity {
  program: string;
  agency: string;
  eligibility: string;
  maxAmount: string;
  applicationPeriod: string;
}

function calculateComprehensiveRisk(audit: Audit): RiskAssessment {
  let earthquakeScore = 5;
  let wildfireScore = 5;
  let floodScore = 5;
  let hurricaneScore = 5;

  // Earthquake risk calculation
  if (audit.waterHeaterSecurity === 'Not secured at all') earthquakeScore += 2;
  if (audit.gasShutoffPlan === 'No wrench or plan') earthquakeScore += 2;
  if (audit.foundationWork === 'No work done') earthquakeScore += 2;
  if (audit.cabinetLatches === 'No latches') earthquakeScore += 1;
  if (audit.electronicsStability === 'Unsecured') earthquakeScore += 1;

  // Wildfire risk calculation
  if (audit.defensibleSpaceWidth === '< 10 ft') wildfireScore += 3;
  if (audit.roofMaterial === 'Standard shingles') wildfireScore += 2;
  if (audit.ventProtection === 'None') wildfireScore += 2;
  if (audit.wallCladding === 'Vinyl/wood') wildfireScore += 1;

  // Flood risk calculation
  if (audit.equipmentElevation === 'Below flood level') floodScore += 3;
  if (audit.backflowPrevention === 'None') floodScore += 2;
  if (audit.floodBarriers === 'None') floodScore += 2;
  if (audit.sumpPump === 'None') floodScore += 1;

  // Hurricane risk calculation
  if (audit.windowDoorProtection === 'None') hurricaneScore += 3;
  if (audit.roofInspection === 'Never checked') hurricaneScore += 2;
  if (audit.garageDoorUpgrade === 'None') hurricaneScore += 2;
  if (audit.roofCovering === 'Standard shingles') hurricaneScore += 1;

  const scores = {
    earthquake: Math.min(earthquakeScore, 10),
    wildfire: Math.min(wildfireScore, 10),
    flood: Math.min(floodScore, 10),
    hurricane: Math.min(hurricaneScore, 10)
  };

  const overallScore = Math.round((scores.earthquake + scores.wildfire + scores.flood + scores.hurricane) / 4);
  
  let riskLevel = 'Low';
  if (overallScore >= 8) riskLevel = 'Very High';
  else if (overallScore >= 7) riskLevel = 'High';
  else if (overallScore >= 5) riskLevel = 'Moderate';

  const primaryConcerns = [];
  if (scores.earthquake >= 7) primaryConcerns.push('Earthquake vulnerability');
  if (scores.wildfire >= 7) primaryConcerns.push('Wildfire exposure');
  if (scores.flood >= 7) primaryConcerns.push('Flood susceptibility');
  if (scores.hurricane >= 7) primaryConcerns.push('Wind damage risk');

  return {
    overallScore,
    categoryScores: scores,
    riskLevel,
    primaryConcerns
  };
}

function generateUpgradePriorities(audit: Audit): UpgradePriority[] {
  const priorities: UpgradePriority[] = [];

  // Earthquake priorities
  if (audit.waterHeaterSecurity === 'Not secured at all') {
    priorities.push({
      category: 'Earthquake',
      priority: 'High',
      description: 'Water heater anchoring and flexible gas connections',
      costEstimate: '$200 - $500',
      femaReference: 'FEMA P-530: Earthquake Safety at Home',
      potentialSavings: 'Up to 15% on earthquake insurance premiums'
    });
  }

  if (audit.foundationWork === 'No work done') {
    priorities.push({
      category: 'Earthquake',
      priority: 'High',
      description: 'Foundation bolting and sill plate anchoring',
      costEstimate: '$3,000 - $7,000',
      femaReference: 'FEMA P-737: Homeowner\'s Guide to Retrofitting',
      potentialSavings: 'Up to 25% on earthquake insurance premiums'
    });
  }

  // Wildfire priorities
  if (audit.defensibleSpaceWidth === '< 10 ft') {
    priorities.push({
      category: 'Wildfire',
      priority: 'High',
      description: 'Create 30-100 feet defensible space around home',
      costEstimate: '$1,000 - $3,000',
      femaReference: 'FEMA P-737: Home Builder\'s Guide to Construction in Wildfire Zones',
      potentialSavings: 'Up to 20% on homeowner\'s insurance in high-risk areas'
    });
  }

  if (audit.roofMaterial === 'Standard shingles') {
    priorities.push({
      category: 'Wildfire',
      priority: 'Medium',
      description: 'Upgrade to Class A fire-rated roofing materials',
      costEstimate: '$8,000 - $15,000',
      femaReference: 'FEMA P-737: Wildfire Zone Construction Guide',
      potentialSavings: 'Up to 10% on homeowner\'s insurance'
    });
  }

  // Flood priorities
  if (audit.equipmentElevation === 'Below flood level') {
    priorities.push({
      category: 'Flood',
      priority: 'High',
      description: 'Elevate utilities above base flood elevation',
      costEstimate: '$2,000 - $5,000',
      femaReference: 'FEMA Technical Bulletin P-804',
      potentialSavings: 'Up to 30% on flood insurance premiums'
    });
  }

  if (audit.backflowPrevention === 'None') {
    priorities.push({
      category: 'Flood',
      priority: 'Medium',
      description: 'Install backflow prevention valves',
      costEstimate: '$500 - $1,500',
      femaReference: 'FEMA P-312: Homeowner\'s Guide to Retrofitting',
      potentialSavings: 'Prevents costly sewer backup damage'
    });
  }

  // Hurricane priorities
  if (audit.windowDoorProtection === 'None') {
    priorities.push({
      category: 'Hurricane',
      priority: 'High',
      description: 'Install impact-resistant windows or storm shutters',
      costEstimate: '$5,000 - $15,000',
      femaReference: 'FEMA P-499: Home Builder\'s Guide to Coastal Construction',
      potentialSavings: 'Up to 20% on wind insurance premiums'
    });
  }

  return priorities.sort((a, b) => {
    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
  });
}

function generateGrantOpportunities(audit: Audit): GrantOpportunity[] {
  const grants: GrantOpportunity[] = [
    {
      program: 'Hazard Mitigation Grant Program (HMGP)',
      agency: 'FEMA',
      eligibility: 'Post-disaster declared communities',
      maxAmount: 'Up to 75% of project costs',
      applicationPeriod: 'Following presidential disaster declarations'
    },
    {
      program: 'Pre-Disaster Mitigation Grant Program',
      agency: 'FEMA',
      eligibility: 'All communities with approved mitigation plans',
      maxAmount: 'Up to $3 million per project',
      applicationPeriod: 'Annual application cycles'
    },
    {
      program: 'Flood Mitigation Assistance Program',
      agency: 'FEMA',
      eligibility: 'NFIP participating communities',
      maxAmount: 'Up to $60,000 for individual properties',
      applicationPeriod: 'Annual application cycles'
    }
  ];

  // Add state-specific grants based on ZIP code
  const twoDigitZip = audit.zipCode.substring(0, 2);
  
  if (['90', '91', '92', '93', '94', '95', '96'].includes(twoDigitZip)) {
    grants.push({
      program: 'California Earthquake Brace + Bolt',
      agency: 'California Earthquake Authority',
      eligibility: 'Homes built before 1980',
      maxAmount: 'Up to $3,000',
      applicationPeriod: 'Annual enrollment periods'
    });
  }

  if (['32', '33', '34'].includes(twoDigitZip)) {
    grants.push({
      program: 'My Safe Florida Home',
      agency: 'Florida Division of Emergency Management',
      eligibility: 'Florida homeowners',
      maxAmount: 'Up to $10,000',
      applicationPeriod: 'Year-round applications'
    });
  }

  return grants;
}

function generateUserAnswerAnalysis(audit: Audit): Array<{question: string, answer: string, analysis: string, femaQuote: string}> {
  const analysis = [];

  if (audit.waterHeaterSecurity) {
    let analysisText = '';
    let femaQuote = '';
    
    if (audit.waterHeaterSecurity === 'Not secured at all') {
      analysisText = 'CRITICAL RISK: Your unsecured water heater poses significant earthquake and fire hazards. Water heaters can topple, rupture gas lines, and cause fires.';
      femaQuote = '"Water heaters should be anchored to wall studs and have flexible connections for both gas and water lines." - FEMA P-530';
    } else if (audit.waterHeaterSecurity === 'Strapped to wall only') {
      analysisText = 'MODERATE RISK: While strapped, your water heater lacks flexible connectors which are essential for preventing gas leaks during earthquakes.';
      femaQuote = '"Flexible gas connectors are critical to prevent gas line rupture during seismic movement." - FEMA P-530';
    } else {
      analysisText = 'WELL PROTECTED: Your water heater is properly secured with both strapping and flexible connectors, meeting FEMA recommendations.';
      femaQuote = '"Proper water heater anchoring significantly reduces fire and gas leak risks during earthquakes." - FEMA P-530';
    }

    analysis.push({
      question: 'Water Heater Security',
      answer: audit.waterHeaterSecurity,
      analysis: analysisText,
      femaQuote: femaQuote
    });
  }

  if (audit.defensibleSpaceWidth) {
    let analysisText = '';
    let femaQuote = '';
    
    if (audit.defensibleSpaceWidth === '< 10 ft') {
      analysisText = 'EXTREME RISK: Insufficient defensible space dramatically increases wildfire vulnerability. Immediate action required.';
      femaQuote = '"Defensible space of at least 30 feet is the minimum recommended for wildfire protection." - FEMA P-737';
    } else if (audit.defensibleSpaceWidth === '10 – 30 ft') {
      analysisText = 'MODERATE RISK: Meets minimum requirements but expanding to 100 feet would provide better protection.';
      femaQuote = '"Extended defensible space up to 100 feet provides optimal wildfire protection." - FEMA P-737';
    } else {
      analysisText = 'EXCELLENT PROTECTION: Your defensible space exceeds minimum recommendations and provides strong wildfire protection.';
      femaQuote = '"Adequate defensible space is the most effective wildfire protection measure homeowners can implement." - FEMA P-737';
    }

    analysis.push({
      question: 'Defensible Space Width',
      answer: audit.defensibleSpaceWidth,
      analysis: analysisText,
      femaQuote: femaQuote
    });
  }

  if (audit.equipmentElevation) {
    let analysisText = '';
    let femaQuote = '';
    
    if (audit.equipmentElevation === 'Below flood level') {
      analysisText = 'HIGH RISK: Equipment below flood level faces certain damage and costly replacement during flood events.';
      femaQuote = '"Elevating utilities above the Base Flood Elevation is one of the most cost-effective mitigation measures." - FEMA P-804';
    } else if (audit.equipmentElevation === 'At flood level') {
      analysisText = 'MODERATE RISK: Equipment at flood level remains vulnerable. Elevation above base flood level recommended.';
      femaQuote = '"Equipment should be elevated at least one foot above the Base Flood Elevation for optimal protection." - FEMA P-804';
    } else {
      analysisText = 'WELL PROTECTED: Your elevated equipment positioning provides excellent flood protection and insurance savings.';
      femaQuote = '"Proper equipment elevation can reduce flood insurance premiums by up to 30%." - FEMA P-804';
    }

    analysis.push({
      question: 'Equipment Elevation',
      answer: audit.equipmentElevation,
      analysis: analysisText,
      femaQuote: femaQuote
    });
  }

  return analysis;
}

export async function generatePDFReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Calculate comprehensive risk assessment
    const riskAssessment = calculateComprehensiveRisk(audit);
    const upgradePriorities = generateUpgradePriorities(audit);
    const grantOpportunities = generateGrantOpportunities(audit);
    const userAnalysis = generateUserAnswerAnalysis(audit);

    // Set headers for PDF download
    const filename = `Disaster_Dodger_Comprehensive_Report_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // Create PDF document with custom fonts
    const doc = new PDFDocument({ 
      size: "A4", 
      margin: 40,
      font: 'Helvetica' // Using Helvetica which is similar to homepage font
    });
    doc.pipe(res);

    // Modern color scheme matching homepage
    const colors = {
      primary: "#16A34A",     // disaster-green-600
      secondary: "#10B981",   // disaster-mint-500  
      accent: "#0F4C81",      // Deep blue
      text: "#1F2937",        // Dark gray
      lightGray: "#6B7280",   // Medium gray
      background: "#F9FAFB",  // Light gray background
      white: "#FFFFFF",
      danger: "#DC2626",      // Red for high risk
      warning: "#F59E0B",     // Orange for medium risk
      success: "#10B981"      // Green for low risk
    };

    // Helper function to add section headers
    function addSectionHeader(title: string, y: number) {
      doc.fontSize(18)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(title, 40, y, { width: 515 });
      return y + 30;
    }

    // Helper function to add divider lines
    function addDivider(y: number) {
      doc.strokeColor(colors.lightGray)
         .lineWidth(1)
         .moveTo(40, y)
         .lineTo(555, y)
         .stroke();
      return y + 20;
    }

    // --- COVER PAGE ---
    doc.font('Helvetica-Bold')
       .fontSize(36)
       .fillColor(colors.primary)
       .text("Disaster Dodger™", { align: "center" });
    
    doc.moveDown(0.5);
    doc.fontSize(28)
       .fillColor(colors.text)
       .text("Comprehensive Home Safety Report", { align: "center" });

    doc.moveDown(2);
    
    // Property information box
    doc.rect(100, 200, 395, 120)
       .fillAndStroke(colors.background, colors.lightGray);
    
    doc.fontSize(14)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`Property ZIP Code: ${audit.zipCode}`, 120, 230)
       .text(`Report Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, 120, 250)
       .text(`Audit ID: ${audit.id}`, 120, 270)
       .text(`Primary Hazard: ${audit.primaryHazard || 'Multiple Hazards'}`, 120, 290);

    // Risk score display
    doc.moveDown(3);
    let riskColor = colors.success;
    if (riskAssessment.overallScore >= 8) riskColor = colors.danger;
    else if (riskAssessment.overallScore >= 6) riskColor = colors.warning;

    doc.fontSize(22)
       .fillColor(colors.primary)
       .font('Helvetica-Bold')
       .text("Overall Risk Assessment", { align: "center" });
    
    doc.moveDown(1);
    doc.fontSize(72)
       .fillColor(riskColor)
       .text(`${riskAssessment.overallScore}/10`, { align: "center" });
    
    doc.fontSize(18)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`Risk Level: ${riskAssessment.riskLevel}`, { align: "center" });

    // --- PAGE 2: EXECUTIVE SUMMARY ---
    doc.addPage();
    let currentY = 50;
    
    currentY = addSectionHeader("Executive Summary", currentY);
    
    doc.fontSize(12)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`This comprehensive safety assessment was conducted for the property in ZIP code ${audit.zipCode} on ${new Date().toLocaleDateString()}. Our analysis evaluated ${audit.primaryHazard?.toLowerCase() || 'multiple natural disaster'} risks and identified key vulnerabilities requiring attention.`, 40, currentY, {
         width: 515,
         align: "justify"
       });

    currentY += 60;
    
    doc.text(`Your property received an overall risk score of ${riskAssessment.overallScore} out of 10, indicating ${riskAssessment.riskLevel.toLowerCase()} risk levels. The primary concerns identified include: ${riskAssessment.primaryConcerns.join(', ') || 'general preparedness improvements'}.`, 40, currentY, {
      width: 515,
      align: "justify"
    });

    currentY += 80;
    currentY = addDivider(currentY);

    // Risk breakdown by category
    currentY = addSectionHeader("Risk Breakdown by Category", currentY);
    
    const categories = [
      { name: 'Earthquake', score: riskAssessment.categoryScores.earthquake },
      { name: 'Wildfire', score: riskAssessment.categoryScores.wildfire },
      { name: 'Flood', score: riskAssessment.categoryScores.flood },
      { name: 'Hurricane', score: riskAssessment.categoryScores.hurricane }
    ];

    categories.forEach((category, index) => {
      let categoryColor = colors.success;
      if (category.score >= 8) categoryColor = colors.danger;
      else if (category.score >= 6) categoryColor = colors.warning;

      const y = currentY + (index * 35);
      
      doc.fontSize(12)
         .fillColor(colors.text)
         .font('Helvetica-Bold')
         .text(category.name, 40, y);
      
      // Risk score bar
      doc.rect(150, y - 2, 200, 15)
         .fillAndStroke(colors.background, colors.lightGray);
      
      const barWidth = (category.score / 10) * 200;
      doc.rect(150, y - 2, barWidth, 15)
         .fill(categoryColor);
      
      doc.fontSize(12)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`${category.score}/10`, 370, y);
    });

    // --- PAGE 3: USER ANSWERS ANALYSIS ---
    doc.addPage();
    currentY = 50;
    
    currentY = addSectionHeader("Detailed Answer Analysis", currentY);
    
    userAnalysis.forEach((item, index) => {
      if (currentY > 700) {
        doc.addPage();
        currentY = 50;
      }

      // Question and answer
      doc.fontSize(12)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(`${item.question}:`, 40, currentY);
      
      currentY += 20;
      doc.fontSize(11)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`Your Answer: ${item.answer}`, 40, currentY);
      
      currentY += 25;
      
      // Analysis
      doc.fontSize(11)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(item.analysis, 40, currentY, { width: 515 });
      
      currentY += 40;
      
      // FEMA quote box
      doc.rect(40, currentY, 515, 40)
         .fillAndStroke(colors.background, colors.primary);
      
      doc.fontSize(10)
         .fillColor(colors.accent)
         .font('Helvetica-Oblique')
         .text(item.femaQuote, 50, currentY + 15, { width: 495 });
      
      currentY += 60;
    });

    // --- PAGE 4: PRIORITY UPGRADES ---
    doc.addPage();
    currentY = 50;
    
    currentY = addSectionHeader("Priority Upgrades & Recommendations", currentY);
    
    upgradePriorities.forEach((upgrade, index) => {
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      let priorityColor = colors.success;
      if (upgrade.priority === 'High') priorityColor = colors.danger;
      else if (upgrade.priority === 'Medium') priorityColor = colors.warning;

      // Priority badge
      doc.rect(40, currentY, 60, 20)
         .fill(priorityColor);
      
      doc.fontSize(10)
         .fillColor(colors.white)
         .font('Helvetica-Bold')
         .text(upgrade.priority, 45, currentY + 6);
      
      // Category and description
      doc.fontSize(12)
         .fillColor(colors.text)
         .font('Helvetica-Bold')
         .text(`${upgrade.category}: ${upgrade.description}`, 110, currentY + 5);
      
      currentY += 30;
      
      // Cost and savings
      doc.fontSize(10)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`Estimated Cost: ${upgrade.costEstimate}`, 40, currentY)
         .text(`Potential Savings: ${upgrade.potentialSavings}`, 300, currentY);
      
      currentY += 20;
      
      // FEMA reference
      doc.fontSize(9)
         .fillColor(colors.lightGray)
         .font('Helvetica-Oblique')
         .text(`Reference: ${upgrade.femaReference}`, 40, currentY);
      
      currentY += 35;
    });

    // --- PAGE 5: COST ESTIMATES & GRANTS ---
    doc.addPage();
    currentY = 50;
    
    currentY = addSectionHeader("Cost Estimates & Financial Assistance", currentY);
    
    // Total cost summary
    const totalLowCost = upgradePriorities.reduce((sum, upgrade) => {
      const range = upgrade.costEstimate.match(/\$?([\d,]+)/);
      return sum + (range ? parseInt(range[1].replace(',', '')) : 0);
    }, 0);
    
    doc.fontSize(12)
       .fillColor(colors.text)
       .font('Helvetica')
       .text(`Total Estimated Investment: $${totalLowCost.toLocaleString()} - $${(totalLowCost * 2).toLocaleString()}`, 40, currentY);
    
    currentY += 40;
    currentY = addDivider(currentY);
    
    // Grant opportunities
    currentY = addSectionHeader("Available Grants & Rebates", currentY);
    
    grantOpportunities.forEach((grant, index) => {
      if (currentY > 650) {
        doc.addPage();
        currentY = 50;
      }

      doc.fontSize(12)
         .fillColor(colors.primary)
         .font('Helvetica-Bold')
         .text(grant.program, 40, currentY);
      
      currentY += 20;
      
      doc.fontSize(10)
         .fillColor(colors.text)
         .font('Helvetica')
         .text(`Agency: ${grant.agency}`, 40, currentY)
         .text(`Maximum Amount: ${grant.maxAmount}`, 300, currentY);
      
      currentY += 15;
      
      doc.text(`Eligibility: ${grant.eligibility}`, 40, currentY);
      currentY += 15;
      
      doc.text(`Application Period: ${grant.applicationPeriod}`, 40, currentY);
      currentY += 30;
    });

    // --- FOOTER ON EACH PAGE ---
    const range = doc.bufferedPageRange();
    for (let i = range.start; i < range.start + range.count; i++) {
      doc.switchToPage(i);
      
      doc.fontSize(8)
         .fillColor(colors.lightGray)
         .font('Helvetica')
         .text(`Generated by Disaster Dodger™ - Professional Home Safety Assessment`, 40, 770, {
           width: 515,
           align: "center"
         })
         .text(`Page ${i + 1} of ${range.count}`, 40, 785, {
           width: 515,
           align: "center"
         });
    }

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Finalize PDF
    doc.end();

  } catch (error) {
    console.error("PDF generation error:", error);
    res.status(500).json({ error: "Failed to generate comprehensive PDF report" });
  }
}
