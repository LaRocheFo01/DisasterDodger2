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
  model: string = 'deepseek/deepseek-chat',
  pdfUrls?: string[]
): Promise<DeepseekAuditResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  
  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  const systemPrompt = `You are a professional home safety auditor with expertise in FEMA guidelines and disaster preparedness. Analyze the provided questionnaire responses and generate a comprehensive safety audit report.

Return your analysis as a valid JSON object with this exact structure:
{
  "riskScore": number (0-100),
  "primaryHazards": string[],
  "recommendations": [
    {
      "priority": "High|Medium|Low",
      "title": "Brief title",
      "description": "Detailed description with technical specifics",
      "estimatedCost": "Cost range (e.g., $500-$2,000)",
      "timeframe": "Implementation timeline",
      "femaCitation": "FEMA publication reference if applicable"
    }
  ],
  "grantOpportunities": [
    {
      "program": "Grant program name",
      "description": "Program description",
      "eligibility": "Eligibility requirements",
      "maxAmount": "Maximum grant amount"
    }
  ],
  "insuranceConsiderations": {
    "potentialSavings": "Estimated insurance savings",
    "requirements": ["List of requirements for insurance discounts"],
    "timeline": "When savings might be realized"
  },
  "summary": "Executive summary of findings",
  "nextSteps": ["Prioritized action items"]
}

Base your analysis on established disaster preparedness guidelines, FEMA publications, and regional risk factors. Provide specific, actionable recommendations with cost estimates and implementation guidance.`;

  const userPrompt = `Please analyze this home safety questionnaire and provide a comprehensive audit report:

Questionnaire Responses:
${JSON.stringify(answers, null, 2)}

${pdfUrls ? `Reference Materials: ${pdfUrls.join(', ')}` : ''}

Provide specific recommendations based on the responses, including cost estimates, FEMA citations where applicable, and grant opportunities. Focus on life safety priorities while considering property protection and insurance benefits.`;

  try {
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model,
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
          'HTTP-Referer': 'https://disaster-dodger.replit.app',
          'X-Title': 'Disaster Dodger Safety Audit'
        }
      }
    );

    const content = response.data.choices[0].message.content;
    
    // Parse the JSON response
    let auditResult: DeepseekAuditResult;
    try {
      auditResult = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse Deepseek response as JSON:', content);
      throw new Error('Invalid JSON response from Deepseek API');
    }

    return auditResult;
  } catch (error: any) {
    console.error('Deepseek API error:', error.response?.data || error.message);
    throw new Error(`Deepseek API error: ${error.response?.data?.error?.message || error.message}`);
  }
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