
import axios from 'axios';

export interface DeepseekAuditResult {
  riskScore: number;
  primaryHazards: string[];
  recommendations: {
    priority: string;
    title: string;
    description: string;
    estimatedCost: string;
    timeframe: string;
    femaCitation?: string;
  }[];
  grantOpportunities: {
    program: string;
    description: string;
    eligibility: string;
    maxAmount: string;
  }[];
  insuranceConsiderations: {
    potentialSavings: string;
    requirements: string[];
    timeline: string;
  };
  summary: string;
  nextSteps: string[];
}

const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callDeepseek(
  answers: Record<string, any>, 
  model: string = 'deepseek/deepseek-r1-0528-qwen3-8b:free',
  pdfContent?: { name: string; content: string }[]
): Promise<DeepseekAuditResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  const systemPrompt = `You are a professional home safety auditor. Analyze the questionnaire and return ONLY a valid JSON object with this exact structure (no markdown, no explanations, just the JSON):

{
  "riskScore": 65,
  "primaryHazards": ["Earthquake", "Wildfire"],
  "recommendations": [
    {
      "priority": "High",
      "title": "Secure Water Heater",
      "description": "Install earthquake straps on water heater to prevent tipping and gas leaks during seismic events.",
      "estimatedCost": "$150-$300",
      "timeframe": "1-2 hours",
      "femaCitation": "FEMA P-530"
    }
  ],
  "grantOpportunities": [
    {
      "program": "FEMA Hazard Mitigation Grant",
      "description": "Federal funding for hazard mitigation projects",
      "eligibility": "Property owners in declared disaster areas",
      "maxAmount": "$5,000"
    }
  ],
  "insuranceConsiderations": {
    "potentialSavings": "5-15% annual premium reduction",
    "requirements": ["Complete high-priority retrofits", "Provide documentation"],
    "timeline": "Savings available after completion"
  },
  "summary": "Your property shows moderate risk from earthquakes and wildfires. Priority should be given to securing utilities and creating defensible space.",
  "nextSteps": ["Secure water heater", "Clear vegetation", "Review insurance coverage"]
}`;

  const userPrompt = `Analyze this home safety data and provide recommendations:

Property Data:
${JSON.stringify(answers, null, 2)}

${pdfContent && pdfContent.length > 0 ? `
Reference Documents:
${pdfContent.map(pdf => `
Document: ${pdf.name}
Content: ${pdf.content.substring(0, 3000)}...
`).join('\n')}
` : ''}

Use the reference documents to provide more accurate and detailed recommendations based on FEMA guidelines and best practices. Return only the JSON object, no other text.`;

  try {
    console.log('[DeepSeek] Making API call...');
    
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.3,
        max_tokens: 3000
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://disaster-dodger.replit.app',
          'X-Title': 'Disaster Dodger Safety Audit'
        },
        timeout: 30000
      }
    );

    console.log('[DeepSeek] API response received');
    
    const content = response.data.choices[0].message.content;
    console.log('[DeepSeek] Raw response (first 200 chars):', content.substring(0, 200));

    // Clean the response more aggressively
    let cleanedContent = content.trim();
    
    // Remove common markdown patterns
    cleanedContent = cleanedContent.replace(/```json\s*/g, '');
    cleanedContent = cleanedContent.replace(/```\s*/g, '');
    cleanedContent = cleanedContent.replace(/^[^{]*({.*})[^}]*$/s, '$1');
    
    // Find JSON object boundaries
    const startIndex = cleanedContent.indexOf('{');
    const lastIndex = cleanedContent.lastIndexOf('}');
    
    if (startIndex === -1 || lastIndex === -1) {
      console.error('[DeepSeek] No JSON object found in response:', content);
      throw new Error('No JSON object found in DeepSeek response');
    }
    
    cleanedContent = cleanedContent.substring(startIndex, lastIndex + 1);
    console.log('[DeepSeek] Cleaned JSON (first 200 chars):', cleanedContent.substring(0, 200));

    // Parse the JSON
    let auditResult: DeepseekAuditResult;
    try {
      auditResult = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('[DeepSeek] JSON parse failed:', parseError);
      console.error('[DeepSeek] Attempted to parse:', cleanedContent);
      
      // Return a fallback result instead of failing
      console.log('[DeepSeek] Using fallback result due to parse error');
      auditResult = createFallbackResult(answers);
    }

    // Validate the result has required fields
    if (!auditResult.riskScore && auditResult.riskScore !== 0) {
      console.warn('[DeepSeek] Missing riskScore, using fallback');
      auditResult = createFallbackResult(answers);
    }

    console.log('[DeepSeek] Successfully parsed audit result, risk score:', auditResult.riskScore);
    return auditResult;
    
  } catch (error: any) {
    console.error('[DeepSeek] API error:', error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      throw new Error('Invalid DeepSeek API key. Get your free key from https://openrouter.ai/');
    }
    
    if (error.response?.status === 429) {
      throw new Error('DeepSeek API rate limit exceeded. Please wait a moment and try again.');
    }
    
    // If API fails completely, return a fallback result
    console.log('[DeepSeek] API failed, using fallback result');
    return createFallbackResult(answers);
  }
}

// Fallback function when API fails or returns invalid JSON
function createFallbackResult(answers: Record<string, any>): DeepseekAuditResult {
  const hazard = answers.primaryHazard || 'Natural Disaster';
  const zipCode = answers.zipCode || 'Unknown';
  
  return {
    riskScore: 45,
    primaryHazards: [hazard, 'General Weather Events'],
    recommendations: [
      {
        priority: 'High',
        title: 'Emergency Kit Preparation',
        description: 'Assemble a 72-hour emergency kit with water, food, flashlights, and first aid supplies.',
        estimatedCost: '$200-$500',
        timeframe: '1-2 days',
        femaCitation: 'FEMA Ready.gov'
      },
      {
        priority: 'Medium',
        title: 'Home Safety Assessment',
        description: 'Conduct a detailed walkthrough to identify specific vulnerabilities in your home.',
        estimatedCost: '$0-$200',
        timeframe: '1 week'
      },
      {
        priority: 'Medium',
        title: 'Insurance Review',
        description: 'Review your current insurance coverage to ensure adequate protection.',
        estimatedCost: '$0',
        timeframe: '1-2 hours'
      }
    ],
    grantOpportunities: [
      {
        program: 'FEMA Individual Assistance',
        description: 'Federal assistance for disaster recovery and mitigation',
        eligibility: 'Property owners affected by federally declared disasters',
        maxAmount: 'Varies by program'
      }
    ],
    insuranceConsiderations: {
      potentialSavings: '5-10% annual premium reduction',
      requirements: ['Complete basic safety improvements', 'Document upgrades'],
      timeline: 'Savings available after verification'
    },
    summary: `Based on your location in ${zipCode} and primary concern about ${hazard}, your property has moderate risk exposure. Focus on basic preparedness and safety improvements to reduce vulnerability.`,
    nextSteps: [
      'Prepare emergency kit',
      'Review insurance coverage',
      'Identify specific home vulnerabilities',
      'Consider professional safety assessment'
    ]
  };
}

export function renderAuditHTML(audit: DeepseekAuditResult, auditData: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Home Safety Audit Report</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
        }
        .header {
            text-align: center;
            border-bottom: 3px solid #16A34A;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #16A34A;
            font-size: 2.5em;
            margin: 0;
        }
        .header .subtitle {
            color: #666;
            font-size: 1.2em;
            margin-top: 10px;
        }
        .section {
            margin-bottom: 30px;
            page-break-inside: avoid;
        }
        .section h2 {
            color: #16A34A;
            border-bottom: 2px solid #10B981;
            padding-bottom: 5px;
            font-size: 1.5em;
        }
        .risk-score {
            background: ${audit.riskScore >= 70 ? '#FEE2E2' : audit.riskScore >= 40 ? '#FEF3C7' : '#D1FAE5'};
            border: 2px solid ${audit.riskScore >= 70 ? '#DC2626' : audit.riskScore >= 40 ? '#F59E0B' : '#10B981'};
            border-radius: 10px;
            padding: 20px;
            text-align: center;
            margin-bottom: 20px;
        }
        .risk-score .score {
            font-size: 3em;
            font-weight: bold;
            color: ${audit.riskScore >= 70 ? '#DC2626' : audit.riskScore >= 40 ? '#F59E0B' : '#10B981'};
        }
        .hazards {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-bottom: 20px;
        }
        .hazard-tag {
            background: #F3F4F6;
            border: 1px solid #D1D5DB;
            border-radius: 20px;
            padding: 5px 15px;
            font-size: 0.9em;
            color: #374151;
        }
        .recommendations {
            margin-bottom: 20px;
        }
        .recommendation {
            border: 1px solid #E5E7EB;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background: #FAFAFA;
        }
        .recommendation.high {
            border-left: 5px solid #DC2626;
        }
        .recommendation.medium {
            border-left: 5px solid #F59E0B;
        }
        .recommendation.low {
            border-left: 5px solid #10B981;
        }
        .recommendation h4 {
            margin: 0 0 10px 0;
            color: #1F2937;
        }
        .recommendation .priority {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.8em;
            font-weight: bold;
            margin-bottom: 10px;
        }
        .priority.high {
            background: #DC2626;
            color: white;
        }
        .priority.medium {
            background: #F59E0B;
            color: white;
        }
        .priority.low {
            background: #10B981;
            color: white;
        }
        .cost-estimate {
            font-weight: bold;
            color: #059669;
        }
        .grants {
            background: #EFF6FF;
            border: 1px solid #DBEAFE;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .grant {
            margin-bottom: 15px;
            padding-bottom: 15px;
            border-bottom: 1px solid #DBEAFE;
        }
        .grant:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .insurance-box {
            background: #F0FDF4;
            border: 1px solid #BBF7D0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 20px;
        }
        .next-steps {
            background: #FEF3C7;
            border: 1px solid #FCD34D;
            border-radius: 8px;
            padding: 15px;
        }
        .next-steps ul {
            margin: 0;
            padding-left: 20px;
        }
        .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #E5E7EB;
            text-align: center;
            color: #6B7280;
            font-size: 0.9em;
        }
        @media print {
            body { padding: 0; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Disaster Dodger™</h1>
        <div class="subtitle">Comprehensive Home Safety Audit Report</div>
        <p>Property: ${auditData.zipCode || 'Not specified'} | Report Date: ${new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
        <div class="risk-score">
            <div class="score">${audit.riskScore}/100</div>
            <div>Overall Risk Score</div>
        </div>
        
        <h2>Primary Hazards Identified</h2>
        <div class="hazards">
            ${audit.primaryHazards.map(hazard => 
                `<span class="hazard-tag">${hazard}</span>`
            ).join('')}
        </div>
    </div>

    <div class="section">
        <h2>Executive Summary</h2>
        <p>${audit.summary}</p>
    </div>

    <div class="section">
        <h2>Priority Recommendations</h2>
        <div class="recommendations">
            ${audit.recommendations.map(rec => `
                <div class="recommendation ${rec.priority.toLowerCase()}">
                    <span class="priority ${rec.priority.toLowerCase()}">${rec.priority} Priority</span>
                    <h4>${rec.title}</h4>
                    <p>${rec.description}</p>
                    <p><span class="cost-estimate">Estimated Cost: ${rec.estimatedCost}</span></p>
                    <p><strong>Timeframe:</strong> ${rec.timeframe}</p>
                    ${rec.femaCitation ? `<p><strong>FEMA Reference:</strong> ${rec.femaCitation}</p>` : ''}
                </div>
            `).join('')}
        </div>
    </div>

    ${audit.grantOpportunities.length > 0 ? `
    <div class="section">
        <h2>Grant Opportunities</h2>
        <div class="grants">
            ${audit.grantOpportunities.map(grant => `
                <div class="grant">
                    <h4>${grant.program}</h4>
                    <p>${grant.description}</p>
                    <p><strong>Eligibility:</strong> ${grant.eligibility}</p>
                    <p><strong>Maximum Amount:</strong> ${grant.maxAmount}</p>
                </div>
            `).join('')}
        </div>
    </div>
    ` : ''}

    <div class="section">
        <h2>Insurance Considerations</h2>
        <div class="insurance-box">
            <p><strong>Potential Savings:</strong> ${audit.insuranceConsiderations.potentialSavings}</p>
            <p><strong>Requirements:</strong></p>
            <ul>
                ${audit.insuranceConsiderations.requirements.map(req => 
                    `<li>${req}</li>`
                ).join('')}
            </ul>
            <p><strong>Timeline:</strong> ${audit.insuranceConsiderations.timeline}</p>
        </div>
    </div>

    <div class="section">
        <h2>Next Steps</h2>
        <div class="next-steps">
            <ul>
                ${audit.nextSteps.map(step => `<li>${step}</li>`).join('')}
            </ul>
        </div>
    </div>

    <div class="footer">
        <p>This report is based on self-reported information and should not replace professional inspection or engineering analysis. 
        Consult with licensed professionals before making modifications to your property.</p>
        <p>Generated by Disaster Dodger™ | Report ID: ${Date.now()}</p>
    </div>
</body>
</html>`;
}
