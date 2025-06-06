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

    console.log(`[Creative Report] Generating for audit ${auditId} using OpenRouter API...`);

    const creativeConcept = generateRandomConcept();
    
    const systemPrompt = `You are a creative disaster preparedness report designer. Generate a comprehensive, visually engaging report that tells a compelling story about home safety.

Create a JSON response with this exact structure:
{
  "id": "creative_report_${auditId}_${Date.now()}",
  "title": "Creative title that's engaging and memorable",
  "subtitle": "Compelling subtitle about home protection",
  "homeAddress": "${audit.zipCode}",
  "generatedDate": "${new Date().toLocaleDateString()}",
  "riskLevel": "HIGH|MEDIUM|LOW|EXTREME",
  "primaryHazard": "${audit.primaryHazard}",
  "sections": [
    {
      "id": "hero",
      "title": "Your Home's Guardian Story",
      "type": "hero",
      "content": "A compelling narrative about this specific home's protection journey",
      "visualElements": {
        "colorTheme": "emerald-blue-gradient",
        "animations": ["fade-in", "slide-up"]
      }
    },
    {
      "id": "current_state",
      "title": "Protection Status Dashboard",
      "type": "scorecard",
      "content": "Current vulnerability analysis with specific insights",
      "visualElements": {
        "charts": [
          {
            "type": "donut",
            "data": {"protected": 65, "vulnerable": 35},
            "title": "Overall Protection Level"
          }
        ]
      }
    },
    {
      "id": "threat_timeline",
      "title": "Disaster Risk Timeline",
      "type": "timeline",
      "content": "Season-by-season risk analysis and preparation schedule",
      "visualElements": {
        "charts": [
          {
            "type": "timeline",
            "data": {"months": ["Jan", "Feb", "Mar"], "risks": [30, 45, 60]},
            "title": "Annual Risk Patterns"
          }
        ]
      }
    },
    {
      "id": "success_story",
      "title": "Your Transformation Journey",
      "type": "story",
      "content": "A personalized story of how implementing recommendations transforms this home",
      "visualElements": {
        "icons": ["home-shield", "family-safe", "money-saved"],
        "colorTheme": "success-green"
      }
    },
    {
      "id": "action_roadmap",
      "title": "90-Day Action Roadmap",
      "type": "action_plan",
      "content": "Specific, prioritized steps with timelines and cost estimates",
      "visualElements": {
        "charts": [
          {
            "type": "bar",
            "data": {"weeks": [1,2,3,4], "progress": [25,50,75,100]},
            "title": "Implementation Progress"
          }
        ]
      }
    },
    {
      "id": "resource_arsenal",
      "title": "Your Emergency Arsenal",
      "type": "resources",
      "content": "Comprehensive resource library with emergency contacts and supplies",
      "visualElements": {
        "icons": ["toolkit", "phone", "first-aid", "documents"]
      }
    }
  ],
  "metadata": {
    "auditScore": 72,
    "preparednessLevel": "Developing Guardian",
    "totalRecommendations": 8,
    "estimatedCost": 4500,
    "potentialSavings": 2800
  }
}

Base the content on these audit responses: ${JSON.stringify(audit.auditResponses || {})}

Make it personal, engaging, and actionable. Use storytelling techniques and specific details about ${audit.primaryHazard} risks in ZIP code ${audit.zipCode}.`;

    const userPrompt = `Generate a creative, magazine-style safety report for a ${audit.primaryHazard} assessment in ZIP ${audit.zipCode}. 

Concept theme: ${creativeConcept}

Make it feel like a premium, personalized consultation rather than a generic report. Include specific insights, local context, and an engaging narrative that makes the homeowner excited about improving their safety.

Focus on ${audit.primaryHazard} hazards and create content that feels authentic and locally relevant.

Return only the JSON object.`;

    const response = await axios.post(
      OPENROUTER_API_URL,
      {
        model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://replit.com',
          'X-Title': 'Creative Home Safety Report'
        },
        timeout: 45000
      }
    );

    console.log('[Creative Report] OpenRouter API response received');

    if (!response.data?.choices?.[0]?.message?.content) {
      throw new Error('Invalid response from OpenRouter API');
    }

    let reportData: CreativeReport;
    try {
      const content = response.data.choices[0].message.content.trim();
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      reportData = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('[Creative Report] JSON parsing failed:', parseError);
      throw new Error('Failed to parse AI response as JSON');
    }

    // Generate the creative HTML template
    const htmlContent = generateCreativeHTML(reportData);
    
    // Generate PDF
    const pdfBuffer = await generatePDFFromHTML(
      {
        id: reportData.id,
        name: reportData.title,
        description: reportData.subtitle,
        sections: [],
        styling: {
          fonts: { primary: 'Poppins', secondary: 'Open Sans', size: { title: 24, header: 18, body: 14, small: 12 } },
          colors: { primary: '#10B981', secondary: '#3B82F6', accent: '#F59E0B', text: '#1F2937', lightGray: '#6B7280', background: '#F9FAFB', white: '#FFFFFF', danger: '#DC2626', warning: '#F59E0B', success: '#10B981' },
          layout: { margins: 40, pageSize: 'A4', spacing: 20 }
        }
      },
      htmlContent
    );

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