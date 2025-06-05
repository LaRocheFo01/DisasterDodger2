import axios from 'axios';

export interface ReportSection {
  id: string;
  title: string;
  type: 'cover' | 'summary' | 'analysis' | 'recommendations' | 'costs' | 'grants' | 'custom';
  enabled: boolean;
  order: number;
  customContent?: string;
}

export interface ReportStyling {
  fonts: {
    primary: string;
    secondary: string;
    size: {
      title: number;
      header: number;
      body: number;
      small: number;
    };
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    lightGray: string;
    background: string;
    white: string;
    danger: string;
    warning: string;
    success: string;
  };
  layout: {
    margins: number;
    pageSize: string;
    spacing: number;
  };
}

export interface DeepseekAuditResult {
  id: string;
  name: string;
  description: string;
  sections: ReportSection[];
  styling: ReportStyling;
}

const DEEPSEEK_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

export async function callDeepseek(
  answers: Record<string, any>,
  model: string = 'deepseek/deepseek-r1-0528-qwen3-8b:free',
  templateId: string = 'comprehensive',
  zipCode: string = '',
  primaryHazard: string = 'earthquake'
): Promise<DeepseekAuditResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  const timestamp = new Date().toISOString();
  
  const systemPrompt = `You are a report-generation assistant. Your job is to produce a JSON object that exactly matches the TypeScript interface ReportTemplate. Do not output any extra text or explanation—only the JSON. Use UTF-8 encoding, double-quotes, and valid JSON syntax.

Always start with:
{
  "id": string,
  "name": string,
  "description": string,
  "sections": [...],
  "styling": {...}
}

For each element of sections, produce:
{
  "id": one of ["cover","summary","analysis","recommendations","costs","grants"],
  "title": the human-readable heading,
  "type": one of ["cover","summary","analysis","recommendations","costs","grants"],
  "enabled": true if the section is required (otherwise false),
  "order": integer (1-6) indicating its position,
  "customContent": string // the actual text for that section
}

Template definitions for ${templateId}:
- comprehensive: Cover Page, Executive Summary, Detailed Answer Analysis, Priority Upgrades & Recommendations, Cost Estimates & Financial Assistance
- executive: Cover Page, Executive Summary, Priority Recommendations  
- detailed: Cover Page, Executive Summary, Detailed Answer Analysis, Priority Upgrades & Recommendations, Cost Estimates & Financial Assistance, Grant Opportunities

Always include styling with these exact values:
{
  "fonts": {
    "primary": "Helvetica",
    "secondary": "Helvetica-Bold", 
    "size": {"title": 36, "header": 18, "body": 12, "small": 10}
  },
  "colors": {
    "primary": "#16A34A", "secondary": "#10B981", "accent": "#0F4C81",
    "text": "#1F2937", "lightGray": "#6B7280", "background": "#F9FAFB",
    "white": "#FFFFFF", "danger": "#DC2626", "warning": "#F59E0B", "success": "#10B981"
  },
  "layout": {"margins": 40, "pageSize": "A4", "spacing": 20}
}`;

  const userPrompt = `Generate a safety report with these parameters:
- templateId: "${templateId}"
- zipCode: "${zipCode}"
- primaryHazard: "${primaryHazard}"
- answers: ${JSON.stringify(answers, null, 2)}

Fill:
- id with: "report_${zipCode}_${templateId}_${timestamp}"
- name with: "Safety Report for ${zipCode}"
- description with: "Generated on ${timestamp} for ZIP ${zipCode}, hazard: ${primaryHazard}"

For each sections entry, generate customContent using the user's answers to explain hazards, analyze risks, and give recommendations. Tailor each section's text to the ${primaryHazard} hazard and to the answers provided.

Return only the JSON object, no other text.`;

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
      const content = response.data.choices[0].message.content;
      console.log('[DeepSeek] Raw response:', content);

      // Clean up the response to extract just the JSON
      let jsonString = content.trim();
      
      // Remove markdown code blocks if present
      if (jsonString.startsWith('```')) {
        jsonString = jsonString.replace(/^```[a-z]*\n?/i, '').replace(/\n?```$/i, '');
      }
      
      // Find the JSON object boundaries
      const startIndex = jsonString.indexOf('{');
      const lastIndex = jsonString.lastIndexOf('}');
      
      if (startIndex !== -1 && lastIndex !== -1 && lastIndex > startIndex) {
        jsonString = jsonString.substring(startIndex, lastIndex + 1);
      }

      let auditResult: DeepseekAuditResult;
      try {
        auditResult = JSON.parse(jsonString);
      } catch (parseError) {
        console.error('[DeepSeek] JSON parse error:', parseError);
        console.error('[DeepSeek] Raw content:', content);
        throw new Error(`Failed to parse JSON response: ${parseError}`);
      }

      // Validate the structure
      if (!auditResult.id || !auditResult.name || !auditResult.sections || !auditResult.styling) {
        throw new Error('Invalid response structure from DeepSeek API - missing required fields');
      }

      return auditResult;
    } else {
      throw new Error('Invalid response format from DeepSeek API');
    }
  } catch (error: any) {
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
      <title>${audit.name}</title>
      <style>
        body {
          font-family: ${audit.styling.fonts.primary}, sans-serif;
          line-height: 1.6;
          color: ${audit.styling.colors.text};
          max-width: 800px;
          margin: 0 auto;
          padding: ${audit.styling.layout.margins}px;
          background: ${audit.styling.colors.background};
        }
        .header {
          background: linear-gradient(135deg, ${audit.styling.colors.primary} 0%, ${audit.styling.colors.secondary} 100%);
          color: ${audit.styling.colors.white};
          padding: 2rem;
          border-radius: 10px;
          text-align: center;
          margin-bottom: 2rem;
        }
        .header h1 {
          margin: 0;
          font-size: ${audit.styling.fonts.size.title}px;
          font-weight: 300;
        }
        .header p {
          margin: 0.5rem 0 0 0;
          opacity: 0.9;
          font-size: ${audit.styling.fonts.size.header}px;
        }
        .section {
          background: ${audit.styling.colors.white};
          margin-bottom: 2rem;
          padding: 2rem;
          border-radius: 10px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .section h2 {
          color: ${audit.styling.colors.primary};
          border-bottom: 2px solid ${audit.styling.colors.primary};
          padding-bottom: 0.5rem;
          margin-bottom: 1.5rem;
          font-size: ${audit.styling.fonts.size.header}px;
        }
        .content {
          font-size: ${audit.styling.fonts.size.body}px;
          line-height: 1.8;
          white-space: pre-wrap;
        }
        .footer {
          text-align: center;
          color: ${audit.styling.colors.lightGray};
          font-size: ${audit.styling.fonts.size.small}px;
          margin-top: 2rem;
          padding: 1rem;
          border-top: 1px solid ${audit.styling.colors.lightGray};
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${audit.name}</h1>
        <p>Property: ${zipCode} | Type: ${homeType} | Built: ${yearBuilt}</p>
        <p>${audit.description}</p>
      </div>

      ${audit.sections.filter(section => section.enabled).sort((a, b) => a.order - b.order).map(section => `
        <div class="section">
          <h2>${section.title}</h2>
          <div class="content">${section.customContent || ''}</div>
        </div>
      `).join('')}

      <div class="footer">
        <p>This report was generated using advanced AI analysis and FEMA guidelines.</p>
        <p>For questions or clarifications, please consult with a qualified home safety professional.</p>
      </div>
    </body>
    </html>
  `;
}