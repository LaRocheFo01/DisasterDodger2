
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';

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

async function extractTextFromPDF(filePath: string): Promise<string> {
  try {
    const data = new Uint8Array(fs.readFileSync(filePath));
    const pdf = await pdfjsLib.getDocument({ data }).promise;
    let text = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      text += content.items.map((item: any) => item.str).join(' ') + '\n';
    }
    return text;
  } catch (error) {
    console.error(`Failed to extract text from PDF ${filePath}:`, error);
    return '';
  }
}

async function loadAttachedPDFs(): Promise<{ name: string; content: string }[]> {
  const dir = path.join(process.cwd(), 'attached_assets');
  let results: { name: string; content: string }[] = [];
  
  try {
    if (!fs.existsSync(dir)) {
      console.log('[DeepSeek] attached_assets folder not found');
      return results;
    }

    const files = fs.readdirSync(dir);
    console.log(`[DeepSeek] Found ${files.length} files in attached_assets`);
    
    for (const f of files) {
      if (f.toLowerCase().endsWith('.pdf')) {
        console.log(`[DeepSeek] Processing PDF: ${f}`);
        try {
          const content = await extractTextFromPDF(path.join(dir, f));
          if (content.trim()) {
            results.push({ name: f, content });
            console.log(`[DeepSeek] Successfully loaded PDF: ${f} (${content.length} chars)`);
          }
        } catch (err) {
          console.error('[DeepSeek] Failed to read PDF', f, err);
        }
      }
    }
  } catch (err) {
    console.error('[DeepSeek] Error reading attached_assets folder', err);
  }
  
  console.log(`[DeepSeek] Loaded ${results.length} PDFs from attached_assets`);
  return results;
}

export async function callDeepseek(
  answers: Record<string, any>,
  model: string = 'deepseek/deepseek-r1-0528-qwen3-8b:free',
  pdfContent?: { name: string; content: string }[]
): Promise<DeepseekAuditResult> {
  const apiKey = process.env.DEEPSEEK_API_KEY;

  if (!apiKey) {
    throw new Error('DEEPSEEK_API_KEY environment variable is required');
  }

  // Load PDFs from attached_assets automatically
  const backendPDFs = await loadAttachedPDFs();
  const combinedPDFs = [...backendPDFs, ...(pdfContent || [])];

  const systemPrompt = `You are a professional home safety auditor with access to FEMA guidelines and disaster preparedness documentation. Analyze the questionnaire and reference documents to return ONLY a valid JSON object with this exact structure (no markdown, no explanations, just the JSON):

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

${combinedPDFs.length > 0 ? `
Reference Documents (${combinedPDFs.length} documents loaded):
${combinedPDFs.map(pdf => `
Document: ${pdf.name}
Content: ${pdf.content.substring(0, 2000)}...
`).join('\n')}
` : 'No reference documents available.'}

Use the reference documents to provide accurate and detailed recommendations based on FEMA guidelines and best practices. Return only the JSON object, no other text.`;

  try {
    console.log('[DeepSeek] Making API call with', combinedPDFs.length, 'PDF documents...');
    
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
        },
        timeout: 30000
      }
    );

    console.log('[DeepSeek] API response received');
    const content = response.data.choices[0]?.message?.content;
    
    if (!content) {
      throw new Error('No content received from DeepSeek API');
    }

    // Clean the response to extract JSON
    let jsonContent = content.trim();
    
    // Remove markdown code blocks if present
    if (jsonContent.startsWith('```json')) {
      jsonContent = jsonContent.replace(/```json\n?/, '').replace(/\n?```$/, '');
    } else if (jsonContent.startsWith('```')) {
      jsonContent = jsonContent.replace(/```\n?/, '').replace(/\n?```$/, '');
    }

    // Parse the JSON
    try {
      const result = JSON.parse(jsonContent);
      console.log('[DeepSeek] Successfully parsed JSON response');
      return result;
    } catch (parseError) {
      console.error('[DeepSeek] JSON parse error:', parseError);
      console.error('[DeepSeek] Raw content:', content);
      
      // Return a fallback response
      return {
        riskScore: 60,
        primaryHazards: ['General Risk'],
        recommendations: [
          {
            priority: 'High',
            title: 'Emergency Preparedness Kit',
            description: 'Assemble a comprehensive emergency kit with water, food, and essential supplies.',
            estimatedCost: '$200-$500',
            timeframe: '1-2 days'
          }
        ],
        grantOpportunities: [
          {
            program: 'FEMA Individual Assistance',
            description: 'Federal assistance for disaster recovery',
            eligibility: 'Disaster declaration required',
            maxAmount: 'Varies'
          }
        ],
        insuranceConsiderations: {
          potentialSavings: 'Contact your insurance provider',
          requirements: ['Mitigation measures'],
          timeline: 'After completion'
        },
        summary: 'Basic risk assessment completed. Consider implementing emergency preparedness measures.',
        nextSteps: ['Create emergency plan', 'Assemble emergency kit', 'Review insurance coverage']
      };
    }

  } catch (error: any) {
    console.error('[DeepSeek] API call failed:', error.message);
    
    if (error.response) {
      console.error('[DeepSeek] API Error Response:', error.response.data);
    }
    
    // Return a fallback response instead of throwing
    return {
      riskScore: 50,
      primaryHazards: ['Assessment Unavailable'],
      recommendations: [
        {
          priority: 'High',
          title: 'Manual Assessment Required',
          description: 'Please consult with a local emergency management professional for detailed recommendations.',
          estimatedCost: 'Contact professional',
          timeframe: 'Schedule consultation'
        }
      ],
      grantOpportunities: [
        {
          program: 'Local Emergency Management',
          description: 'Contact your local emergency management office',
          eligibility: 'All residents',
          maxAmount: 'Varies'
        }
      ],
      insuranceConsiderations: {
        potentialSavings: 'Contact insurance provider',
        requirements: ['Professional assessment'],
        timeline: 'After consultation'
      },
      summary: 'Automated analysis temporarily unavailable. Manual assessment recommended.',
      nextSteps: ['Contact local emergency management', 'Schedule professional assessment', 'Review current insurance']
    };
  }
}
