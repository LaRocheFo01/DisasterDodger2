import axios from 'axios';
import { generatePDFFromHTML } from './pdf-generator';
import { Request, Response } from 'express';

interface CreativeReportSection {
  id: string;
  title: string;
  type: 'hero' | 'infographic' | 'timeline' | 'scorecard' | 'story' | 'action_plan' | 'resources';
  content: string;
  visualElements: {
    charts?: Array<{
      type: 'donut' | 'bar' | 'timeline' | 'heatmap';
      data: any;
      title: string;
    }>;
    icons?: string[];
    colorTheme?: string;
    animations?: string[];
  };
}

// Helper functions
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

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function generateCreativeReport(req: Request, res: Response) {
  try {
    const { auditId } = req.params;
    const apiKey = process.env.DEEPSEEK_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ 
        error: 'OpenRouter API key not configured. Please provide the DEEPSEEK_API_KEY.' 
      });
    }

    // Get audit data
    const { storage } = await import('./storage');
    const audit = await storage.getAudit(parseInt(auditId));
    
    if (!audit) {
      return res.status(404).json({ error: 'Audit not found' });
    }

    console.log(`[Creative Report] Generating for audit ${auditId}...`);

    const creativeConcept = generateRandomConcept();
    
    // Generate report data directly instead of using API
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
          content: `Welcome to your personalized ${audit.primaryHazard} protection plan. This comprehensive assessment identifies your home's vulnerabilities and provides actionable solutions to keep your family safe.`,
          visualElements: {
            colorTheme: "emerald-blue-gradient",
            animations: ["fade-in", "slide-up"]
          }
        },
        {
          id: "current_state",
          title: "Current Protection Status",
          type: "scorecard",
          content: `Based on your responses, we've identified key areas for improvement in your ${audit.primaryHazard} preparedness.`,
          visualElements: {
            charts: [{
              type: "donut" as const,
              data: { protected: 65, vulnerable: 35 },
              title: "Overall Protection Level"
            }]
          }
        },
        {
          id: "action_roadmap",
          title: "Your 90-Day Action Plan",
          type: "action_plan",
          content: `Follow this prioritized roadmap to systematically improve your home's protection against ${audit.primaryHazard} disasters.`,
          visualElements: {
            charts: [{
              type: "bar" as const,
              data: { weeks: [1,2,3,4], progress: [25,50,75,100] },
              title: "Implementation Timeline"
            }]
          }
        },
        {
          id: "resource_arsenal",
          title: "Emergency Resources",
          type: "resources",
          content: "Essential contacts, supplies, and documentation to keep your family prepared for any emergency.",
          visualElements: {
            icons: ["toolkit", "phone", "first-aid", "documents"]
          }
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

    // Generate PDF directly with jsPDF for reliability
    const { jsPDF } = require('jspdf');
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Add title page
    doc.setFontSize(24);
    doc.setTextColor(16, 185, 129); // Emerald color
    doc.text(reportData.title, 20, 40);

    doc.setFontSize(16);
    doc.setTextColor(75, 85, 99); // Gray color
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

function generateRandomConcept(): string {
  const concepts = [
    'Home as a Fortress - Medieval castle protection theme',
    'Guardian Angel - Protective spirit watching over the home',
    'Shield of Safety - Superhero protection narrative',
    'Nature\'s Defender - Working with natural forces',
    'Family Legacy - Protecting what matters most',
    'Smart Sanctuary - High-tech home protection',
    'Community Champion - Neighborhood safety leader',
    'Weather Warrior - Battle-ready against disasters'
  ];
  return concepts[Math.floor(Math.random() * concepts.length)];
}

function generateCreativeHTML(report: CreativeReport): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${report.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700&family=Open+Sans:wght@400;600&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        body {
            font-family: 'Open Sans', sans-serif;
            line-height: 1.6;
            color: #1F2937;
            background: linear-gradient(135deg, #10B981 0%, #3B82F6 100%);
        }
        
        .page {
            min-height: 100vh;
            padding: 40px;
            background: white;
            margin: 20px;
            border-radius: 20px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.1);
        }
        
        .hero-section {
            text-align: center;
            padding: 60px 0;
            background: linear-gradient(135deg, #10B981, #059669);
            color: white;
            border-radius: 16px;
            margin-bottom: 40px;
            position: relative;
            overflow: hidden;
        }
        
        .hero-section::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
            opacity: 0.3;
        }
        
        .hero-content {
            position: relative;
            z-index: 1;
        }
        
        .hero-title {
            font-family: 'Poppins', sans-serif;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 16px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .hero-subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
            margin-bottom: 8px;
        }
        
        .hero-meta {
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .risk-badge {
            display: inline-block;
            padding: 8px 20px;
            border-radius: 25px;
            font-weight: 600;
            margin: 20px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        .risk-high { background: #EF4444; color: white; }
        .risk-medium { background: #F59E0B; color: white; }
        .risk-low { background: #10B981; color: white; }
        .risk-extreme { background: #7C2D12; color: white; }
        
        .section {
            margin: 40px 0;
            padding: 30px;
            border-radius: 12px;
            background: #F9FAFB;
            border-left: 5px solid #10B981;
        }
        
        .section-title {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 600;
            color: #1F2937;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
        }
        
        .section-title::before {
            content: '';
            width: 20px;
            height: 20px;
            background: linear-gradient(45deg, #10B981, #059669);
            border-radius: 50%;
            margin-right: 12px;
        }
        
        .scorecard {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .score-item {
            background: white;
            padding: 20px;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            border-top: 4px solid #10B981;
        }
        
        .score-value {
            font-size: 2rem;
            font-weight: 700;
            color: #10B981;
            margin-bottom: 8px;
        }
        
        .score-label {
            font-size: 0.9rem;
            color: #6B7280;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        
        .timeline {
            position: relative;
            padding-left: 40px;
        }
        
        .timeline::before {
            content: '';
            position: absolute;
            left: 20px;
            top: 0;
            bottom: 0;
            width: 2px;
            background: linear-gradient(to bottom, #10B981, #059669);
        }
        
        .timeline-item {
            position: relative;
            margin-bottom: 30px;
            padding: 20px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .timeline-item::before {
            content: '';
            position: absolute;
            left: -28px;
            top: 20px;
            width: 12px;
            height: 12px;
            background: #10B981;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 0 0 3px #10B981;
        }
        
        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin: 20px 0;
        }
        
        .action-card {
            background: white;
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #10B981;
            transition: transform 0.2s;
        }
        
        .action-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        
        .action-title {
            font-weight: 600;
            color: #1F2937;
            margin-bottom: 12px;
        }
        
        .action-cost {
            color: #10B981;
            font-weight: 600;
            font-size: 1.1rem;
        }
        
        .progress-bar {
            width: 100%;
            height: 12px;
            background: #E5E7EB;
            border-radius: 6px;
            overflow: hidden;
            margin: 15px 0;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10B981, #059669);
            border-radius: 6px;
            transition: width 0.3s ease;
        }
        
        .resource-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
        }
        
        .resource-item {
            background: white;
            padding: 20px;
            border-radius: 8px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .resource-icon {
            width: 48px;
            height: 48px;
            background: linear-gradient(45deg, #10B981, #059669);
            border-radius: 50%;
            margin: 0 auto 15px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 20px;
        }
        
        .footer {
            text-align: center;
            padding: 40px 0;
            border-top: 2px solid #E5E7EB;
            margin-top: 40px;
            color: #6B7280;
        }
        
        .footer-logo {
            font-family: 'Poppins', sans-serif;
            font-size: 1.5rem;
            font-weight: 700;
            color: #10B981;
            margin-bottom: 10px;
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="hero-section">
            <div class="hero-content">
                <h1 class="hero-title">${report.title}</h1>
                <p class="hero-subtitle">${report.subtitle}</p>
                <p class="hero-meta">ZIP Code: ${report.homeAddress} | Generated: ${report.generatedDate}</p>
                <div class="risk-badge risk-${report.riskLevel.toLowerCase()}">${report.riskLevel} RISK ZONE</div>
            </div>
        </div>

        ${report.sections.map(section => {
          switch(section.type) {
            case 'scorecard':
              return `
                <div class="section">
                    <h2 class="section-title">${section.title}</h2>
                    <p>${section.content}</p>
                    <div class="scorecard">
                        <div class="score-item">
                            <div class="score-value">${report.metadata.auditScore}</div>
                            <div class="score-label">Safety Score</div>
                        </div>
                        <div class="score-item">
                            <div class="score-value">$${report.metadata.estimatedCost.toLocaleString()}</div>
                            <div class="score-label">Investment Needed</div>
                        </div>
                        <div class="score-item">
                            <div class="score-value">$${report.metadata.potentialSavings.toLocaleString()}</div>
                            <div class="score-label">Annual Savings</div>
                        </div>
                        <div class="score-item">
                            <div class="score-value">${report.metadata.totalRecommendations}</div>
                            <div class="score-label">Recommendations</div>
                        </div>
                    </div>
                </div>`;
            
            case 'timeline':
              return `
                <div class="section">
                    <h2 class="section-title">${section.title}</h2>
                    <p>${section.content}</p>
                    <div class="timeline">
                        <div class="timeline-item">
                            <h3>Immediate Actions (Week 1-2)</h3>
                            <p>Critical safety measures that can be implemented quickly</p>
                        </div>
                        <div class="timeline-item">
                            <h3>Short-term Projects (Month 1-3)</h3>
                            <p>Moderate investments with significant safety improvements</p>
                        </div>
                        <div class="timeline-item">
                            <h3>Long-term Upgrades (Month 3-12)</h3>
                            <p>Major structural improvements for maximum protection</p>
                        </div>
                    </div>
                </div>`;
            
            case 'action_plan':
              return `
                <div class="section">
                    <h2 class="section-title">${section.title}</h2>
                    <p>${section.content}</p>
                    <div class="action-grid">
                        <div class="action-card">
                            <h3 class="action-title">Priority 1: Foundation Securing</h3>
                            <p>Anchor your home's foundation against ${report.primaryHazard} forces</p>
                            <div class="action-cost">$2,500 - $5,000</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="action-card">
                            <h3 class="action-title">Priority 2: Emergency Systems</h3>
                            <p>Install early warning and emergency response systems</p>
                            <div class="action-cost">$800 - $1,500</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                        <div class="action-card">
                            <h3 class="action-title">Priority 3: Structural Upgrades</h3>
                            <p>Reinforce weak points identified in your assessment</p>
                            <div class="action-cost">$1,200 - $3,000</div>
                            <div class="progress-bar">
                                <div class="progress-fill" style="width: 0%"></div>
                            </div>
                        </div>
                    </div>
                </div>`;
            
            case 'resources':
              return `
                <div class="section">
                    <h2 class="section-title">${section.title}</h2>
                    <p>${section.content}</p>
                    <div class="resource-grid">
                        <div class="resource-item">
                            <div class="resource-icon">🛠️</div>
                            <h3>Emergency Toolkit</h3>
                            <p>Essential tools and supplies for immediate response</p>
                        </div>
                        <div class="resource-item">
                            <div class="resource-icon">📞</div>
                            <h3>Emergency Contacts</h3>
                            <p>Local emergency services and utility companies</p>
                        </div>
                        <div class="resource-item">
                            <div class="resource-icon">🏥</div>
                            <h3>First Aid Guide</h3>
                            <p>Medical response procedures for common injuries</p>
                        </div>
                        <div class="resource-item">
                            <div class="resource-icon">📋</div>
                            <h3>Documentation</h3>
                            <p>Important papers and insurance information</p>
                        </div>
                    </div>
                </div>`;
            
            default:
              return `
                <div class="section">
                    <h2 class="section-title">${section.title}</h2>
                    <p>${section.content}</p>
                </div>`;
          }
        }).join('')}

        <div class="footer">
            <div class="footer-logo">Disaster Dodger™</div>
            <p>Professional Home Safety Assessment & Planning</p>
            <p>Report ID: ${report.id}</p>
        </div>
    </div>
</body>
</html>`;
}