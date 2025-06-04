diff --git a/server/deepseek-service.ts b/server/deepseek-service.ts
index ad6dffdc4033d7fb9f748d1df7085e2dba509804..2e3962b61beafe351db5a4545fb55dd2d7658052 100644
--- a/server/deepseek-service.ts
+++ b/server/deepseek-service.ts
@@ -1,107 +1,146 @@
 
 import axios from 'axios';
+import fs from 'fs';
+import path from 'path';
+import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js';
 
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
 
+async function extractTextFromPDF(filePath: string): Promise<string> {
+  const data = new Uint8Array(fs.readFileSync(filePath));
+  const pdf = await pdfjsLib.getDocument({ data }).promise;
+  let text = '';
+  for (let i = 1; i <= pdf.numPages; i++) {
+    const page = await pdf.getPage(i);
+    const content = await page.getTextContent();
+    text += content.items.map((item: any) => item.str).join(' ') + '\n';
+  }
+  return text;
+}
+
+async function loadAttachedPDFs(): Promise<{ name: string; content: string }[]> {
+  const dir = path.join(process.cwd(), 'attached_assets');
+  let results: { name: string; content: string }[] = [];
+  try {
+    const files = fs.readdirSync(dir);
+    for (const f of files) {
+      if (f.toLowerCase().endsWith('.pdf')) {
+        try {
+          const content = await extractTextFromPDF(path.join(dir, f));
+          results.push({ name: f, content });
+        } catch (err) {
+          console.error('[DeepSeek] Failed to read PDF', f, err);
+        }
+      }
+    }
+  } catch (err) {
+    console.error('[DeepSeek] Error reading attached_assets folder', err);
+  }
+  return results;
+}
+
 export async function callDeepseek(
-  answers: Record<string, any>, 
+  answers: Record<string, any>,
   model: string = 'deepseek/deepseek-r1-0528-qwen3-8b:free',
   pdfContent?: { name: string; content: string }[]
 ): Promise<DeepseekAuditResult> {
   const apiKey = process.env.DEEPSEEK_API_KEY;
-  
+
   if (!apiKey) {
     throw new Error('DEEPSEEK_API_KEY environment variable is required');
   }
 
+  const backendPDFs = await loadAttachedPDFs();
+  const combinedPDFs = [...backendPDFs, ...(pdfContent || [])];
+
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
 
-${pdfContent && pdfContent.length > 0 ? `
+${combinedPDFs.length > 0 ? `
 Reference Documents:
-${pdfContent.map(pdf => `
+${combinedPDFs.map(pdf => `
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
