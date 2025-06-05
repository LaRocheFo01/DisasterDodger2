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

Use FEMA guidelines and best practices to provide accurate recommendations. Return only the JSON object, no other text.`;

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
          'HTTP-Referer': 'https://replit.com',
          'X-Title': 'Home Safety Audit'
        },
        timeout: 30000
      }
    );

    console.log('[DeepSeek] API response received');

    if (response.data && response.data.choices && response.data.choices[0]) {
      const result = response.data.choices[0].message.content;
    console.log("Raw Deepseek response:", result);

    // Parse the JSON response
    const jsonMatch = result.match(/```json\s*([\s\S]*?)\s*```/);
    if (!jsonMatch) {
      console.error("ERROR: No JSON found in Deepseek response");
      console.error("Full response:", result);
      throw new Error("No JSON found in Deepseek response");
    }

    const jsonContent = jsonMatch[1];
    console.log("Extracted JSON content:", jsonContent);

    const auditResult = JSON.parse(jsonContent);
    console.log("=== DEEPSEEK PARSED RESULT ===");
    console.log("Parsed audit result:", JSON.stringify(auditResult, null, 2));
    console.log("Result type checks:");
    console.log("- riskScore:", typeof auditResult.riskScore, auditResult.riskScore);
    console.log("- primaryHazards:", Array.isArray(auditResult.primaryHazards), auditResult.primaryHazards);
    console.log("- recommendations:", Array.isArray(auditResult.recommendations), auditResult.recommendations?.length);
    console.log("- vulnerabilities:", Array.isArray(auditResult.vulnerabilities), auditResult.vulnerabilities?.length);
    console.log("================================");

    return auditResult;
  } catch (error) {
    console.error('Deepseek API error:', error.response?.data || error.message);
    throw new Error(`Deepseek API error: ${error.response?.data?.error?.message || error.message}`);
  }
}

export function renderAuditHTML(audit: DeepseekAuditResult, auditData: any): string {
  const zipCode = auditData.zipCode || 'Unknown';
  const homeType = auditData.homeType || 'Unknown';
  const yearBuilt = auditData.yearBuilt || 'Unknown';

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Home Safety Audit Report - ${zipCode}</title>
      <style>
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #f9f9f9;
        }
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 2rem;
        }
        .header h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 300;
        }
        .header p {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          font-size: 1.1rem;
        }
        .section {
          background: white;
          margin-bottom: 2rem;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h2 {
          color: #667eea;
          border-bottom: 2px solid #667eea;
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .risk-score {
          font-size: 3rem;
          font-weight: bold;
          text-align: center;
          color: ${audit.riskScore > 70 ? '#e74c3c' : audit.riskScore > 40 ? '#f39c12' : '#27ae60'};
          margin: 1rem 0;
        }
        .hazards {
          display: flex;
          flex-wrap: wrap;
          gap: 1rem;
          margin: 1rem 0;
        }
        .hazard-tag {
          background: #667eea;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 25px;
          font-weight: 500;
        }
        .recommendation {
          border-left: 4px solid #667eea;
          padding: 1rem;
          margin: 1rem 0;
          background: #f8f9ff;
          border-radius: 0 5px 5px 0;
        }
        .recommendation h3 {
          margin: 0 0 0.5rem 0;
          color: #667eea;
        }
        .recommendation .priority {
          display: inline-block;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          font-size: 0.8rem;
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
        .priority.High { background: #e74c3c; color: white; }
        .priority.Medium { background: #f39c12; color: white; }
        .priority.Low { background: #27ae60; color: white; }
        .grant {
          background: #e8f5e8;
          border: 1px solid #27ae60;
          padding: 1rem;
          margin: 1rem 0;
          border-radius: 5px;
        }
        .grant h3 {
          color: #27ae60;
          margin: 0 0 0.5rem 0;
        }
        .insurance {
          background: #e3f2fd;
          border: 1px solid #2196f3;
          padding: 1rem;
          border-radius: 5px;
        }
        .next-steps {
          background: #fff3e0;
          border: 1px solid #ff9800;
          padding: 1rem;
          border-radius: 5px;
        }
        .next-steps ul {
          margin: 0.5rem 0 0 0;
          padding-left: 1.5rem;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 0.9rem;
          margin-top: 2rem;
          padding: 1rem;
          border-top: 1px solid #eee;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Home Safety Audit Report</h1>
        <p>Property: ${zipCode} | Type: ${homeType} | Built: ${yearBuilt}</p>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>Risk Assessment</h2>
        <div class="risk-score">${audit.riskScore}/100</div>
        <p><strong>Primary Hazards:</strong></p>
        <div class="hazards">
          ${audit.primaryHazards.map(hazard => `<span class="hazard-tag">${hazard}</span>`).join('')}
        </div>
      </div>

      <div class="section">
        <h2>Executive Summary</h2>
        <p>${audit.summary}</p>
      </div>

      <div class="section">
        <h2>Recommendations</h2>
        ${audit.recommendations.map(rec => `
          <div class="recommendation">
            <span class="priority ${rec.priority}">${rec.priority} Priority</span>
            <h3>${rec.title}</h3>
            <p>${rec.description}</p>
            <p><strong>Estimated Cost:</strong> ${rec.estimatedCost}</p>
            <p><strong>Timeframe:</strong> ${rec.timeframe}</p>
            ${rec.femaCitation ? `<p><strong>FEMA Reference:</strong> ${rec.femaCitation}</p>` : ''}
          </div>
        `).join('')}
      </div>

      ${audit.grantOpportunities.length > 0 ? `
      <div class="section">
        <h2>Grant Opportunities</h2>
        ${audit.grantOpportunities.map(grant => `
          <div class="grant">
            <h3>${grant.program}</h3>
            <p>${grant.description}</p>
            <p><strong>Eligibility:</strong> ${grant.eligibility}</p>
            <p><strong>Maximum Amount:</strong> ${grant.maxAmount}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <div class="section">
        <h2>Insurance Considerations</h2>
        <div class="insurance">
          <p><strong>Potential Savings:</strong> ${audit.insuranceConsiderations.potentialSavings}</p>
          <p><strong>Requirements:</strong></p>
          <ul>
            ${audit.insuranceConsiderations.requirements.map(req => `<li>${req}</li>`).join('')}
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
        <p>This report was generated using advanced AI analysis and FEMA guidelines.</p>
        <p>For questions or clarifications, please consult with a qualified home safety professional.</p>
      </div>
    </body>
    </html>
  `;
}