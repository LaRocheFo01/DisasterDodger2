
import OpenAI from "openai";
import { google } from "googleapis";
import { Request, Response } from "express";
import { storage } from "./storage";
import type { Audit } from "@shared/schema";

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Google Slides template ID - replace with your actual template ID
const SLIDES_TEMPLATE_ID = process.env.SLIDES_TEMPLATE_ID || "YOUR_SLIDES_TEMPLATE_ID";

interface OpenAIReportResponse {
  executiveSummary: string;
  overallRiskScore: number;
  riskLevel: string;
  primaryConcerns: string[];
  categoryScores: {
    earthquake: number;
    wildfire: number;
    flood: number;
    hurricane: number;
  };
  priorityUpgrades: Array<{
    category: string;
    priority: string;
    description: string;
    costEstimate: string;
    potentialSavings: string;
  }>;
  grantOpportunities: Array<{
    program: string;
    agency: string;
    maxAmount: string;
    eligibility: string;
  }>;
  femaQuotes: string[];
}

async function analyzeAuditWithOpenAI(audit: Audit): Promise<OpenAIReportResponse> {
  const prompt = `
You are a FEMA-certified disaster preparedness expert analyzing a home safety audit. 

AUDIT DATA:
- ZIP Code: ${audit.zipCode}
- Primary Hazard: ${audit.primaryHazard}
- Water Heater Security: ${audit.waterHeaterSecurity}
- Defensible Space: ${audit.defensibleSpaceWidth}
- Equipment Elevation: ${audit.equipmentElevation}
- Foundation Work: ${audit.foundationWork}
- Window/Door Protection: ${audit.windowDoorProtection}
- Roof Material: ${audit.roofMaterial}
- Gas Shutoff Plan: ${audit.gasShutoffPlan}
- Cabinet Latches: ${audit.cabinetLatches}
- Electronics Stability: ${audit.electronicsStability}
- Vent Protection: ${audit.ventProtection}
- Wall Cladding: ${audit.wallCladding}
- Backflow Prevention: ${audit.backflowPrevention}
- Flood Barriers: ${audit.floodBarriers}
- Sump Pump: ${audit.sumpPump}
- Roof Inspection: ${audit.roofInspection}
- Garage Door Upgrade: ${audit.garageDoorUpgrade}
- Roof Covering: ${audit.roofCovering}

Please analyze this data and provide a comprehensive assessment in the following JSON format:

{
  "executiveSummary": "2-3 sentences summarizing the property's overall risk and key findings",
  "overallRiskScore": number from 1-10,
  "riskLevel": "Low|Moderate|High|Very High",
  "primaryConcerns": ["array of main vulnerability areas"],
  "categoryScores": {
    "earthquake": score 1-10,
    "wildfire": score 1-10,
    "flood": score 1-10,
    "hurricane": score 1-10
  },
  "priorityUpgrades": [
    {
      "category": "hazard type",
      "priority": "High|Medium|Low",
      "description": "specific upgrade recommendation",
      "costEstimate": "dollar range",
      "potentialSavings": "insurance savings description"
    }
  ],
  "grantOpportunities": [
    {
      "program": "grant program name",
      "agency": "issuing agency", 
      "maxAmount": "funding amount",
      "eligibility": "eligibility criteria"
    }
  ],
  "femaQuotes": ["array of relevant FEMA guidance quotes with citations"]
}

Base your analysis on FEMA standards and provide actionable recommendations.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: "You are a FEMA-certified disaster preparedness expert. Provide detailed, accurate assessments based on official FEMA guidelines. Always respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }

    return JSON.parse(response);
  } catch (error) {
    console.error("OpenAI analysis error:", error);
    throw new Error("Failed to analyze audit with AI");
  }
}

async function generateSlidesReport(audit: Audit, aiAnalysis: OpenAIReportResponse): Promise<Buffer> {
  try {
    // Initialize Google APIs
    const auth = new google.auth.GoogleAuth({
      scopes: [
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/drive'
      ]
    });

    const slides = google.slides({ version: 'v1', auth });
    const drive = google.drive({ version: 'v3', auth });

    // Create a copy of the template
    const copyResponse = await drive.files.copy({
      fileId: SLIDES_TEMPLATE_ID,
      requestBody: {
        name: `Disaster_Dodger_Report_${audit.zipCode}_${Date.now()}`
      }
    });

    const newPresentationId = copyResponse.data.id;
    if (!newPresentationId) {
      throw new Error("Failed to create presentation copy");
    }

    // Prepare batch update requests for placeholder replacement
    const requests = [
      // Basic audit info
      {
        replaceAllText: {
          containsText: { text: '{{ZIP_CODE}}' },
          replaceText: audit.zipCode
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{PRIMARY_HAZARD}}' },
          replaceText: audit.primaryHazard || 'Multiple Hazards'
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{REPORT_DATE}}' },
          replaceText: new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })
        }
      },
      
      // AI Analysis results
      {
        replaceAllText: {
          containsText: { text: '{{EXECUTIVE_SUMMARY}}' },
          replaceText: aiAnalysis.executiveSummary
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{OVERALL_RISK_SCORE}}' },
          replaceText: aiAnalysis.overallRiskScore.toString()
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{RISK_LEVEL}}' },
          replaceText: aiAnalysis.riskLevel
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{PRIMARY_CONCERNS}}' },
          replaceText: aiAnalysis.primaryConcerns.join(', ')
        }
      },
      
      // Category scores
      {
        replaceAllText: {
          containsText: { text: '{{EARTHQUAKE_SCORE}}' },
          replaceText: aiAnalysis.categoryScores.earthquake.toString()
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{WILDFIRE_SCORE}}' },
          replaceText: aiAnalysis.categoryScores.wildfire.toString()
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{FLOOD_SCORE}}' },
          replaceText: aiAnalysis.categoryScores.flood.toString()
        }
      },
      {
        replaceAllText: {
          containsText: { text: '{{HURRICANE_SCORE}}' },
          replaceText: aiAnalysis.categoryScores.hurricane.toString()
        }
      },
      
      // Priority upgrades (first 3)
      ...aiAnalysis.priorityUpgrades.slice(0, 3).map((upgrade, index) => [
        {
          replaceAllText: {
            containsText: { text: `{{UPGRADE_${index + 1}_DESCRIPTION}}` },
            replaceText: upgrade.description
          }
        },
        {
          replaceAllText: {
            containsText: { text: `{{UPGRADE_${index + 1}_COST}}` },
            replaceText: upgrade.costEstimate
          }
        },
        {
          replaceAllText: {
            containsText: { text: `{{UPGRADE_${index + 1}_SAVINGS}}` },
            replaceText: upgrade.potentialSavings
          }
        }
      ]).flat(),
      
      // Grant opportunities (first 2)
      ...aiAnalysis.grantOpportunities.slice(0, 2).map((grant, index) => [
        {
          replaceAllText: {
            containsText: { text: `{{GRANT_${index + 1}_PROGRAM}}` },
            replaceText: grant.program
          }
        },
        {
          replaceAllText: {
            containsText: { text: `{{GRANT_${index + 1}_AGENCY}}` },
            replaceText: grant.agency
          }
        },
        {
          replaceAllText: {
            containsText: { text: `{{GRANT_${index + 1}_AMOUNT}}` },
            replaceText: grant.maxAmount
          }
        }
      ]).flat(),
      
      // FEMA quotes (first 2)
      ...aiAnalysis.femaQuotes.slice(0, 2).map((quote, index) => ({
        replaceAllText: {
          containsText: { text: `{{FEMA_QUOTE_${index + 1}}}` },
          replaceText: quote
        }
      }))
    ];

    // Apply all replacements
    await slides.presentations.batchUpdate({
      presentationId: newPresentationId,
      requestBody: { requests }
    });

    // Export as PDF
    const pdfResponse = await drive.files.export({
      fileId: newPresentationId,
      mimeType: 'application/pdf'
    }, {
      responseType: 'arraybuffer'
    });

    // Clean up the temporary presentation
    await drive.files.delete({ fileId: newPresentationId });

    return Buffer.from(pdfResponse.data as ArrayBuffer);

  } catch (error) {
    console.error("Google Slides generation error:", error);
    throw new Error("Failed to generate slides report");
  }
}

export async function generateAIReport(req: Request, res: Response) {
  try {
    const auditId = parseInt(req.params.id);
    const audit = await storage.getAudit(auditId);
    
    if (!audit) {
      return res.status(404).json({ message: "Audit not found" });
    }

    // Check if required environment variables are present
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({ 
        message: "OpenAI API key not configured" 
      });
    }

    if (!process.env.GOOGLE_SERVICE_ACCOUNT || SLIDES_TEMPLATE_ID === "YOUR_SLIDES_TEMPLATE_ID") {
      return res.status(500).json({ 
        message: "Google Slides integration not configured" 
      });
    }

    // Step 1: Analyze audit with OpenAI
    console.log(`Analyzing audit ${auditId} with OpenAI...`);
    const aiAnalysis = await analyzeAuditWithOpenAI(audit);

    // Step 2: Generate PDF using Google Slides
    console.log(`Generating slides report for audit ${auditId}...`);
    const pdfBuffer = await generateSlidesReport(audit, aiAnalysis);

    // Step 3: Set headers and stream PDF back
    const filename = `Disaster_Dodger_AI_Report_${audit.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    res.setHeader("Content-Length", pdfBuffer.length);

    // Mark audit as completed
    await storage.updateAudit(auditId, { completed: true });

    // Stream the PDF buffer
    res.end(pdfBuffer);

  } catch (error) {
    console.error("AI report generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate AI-powered report",
      details: error.message 
    });
  }
}
