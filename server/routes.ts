diff --git a/server/routes.ts b/server/routes.ts
index 8a00167e85278fa53565349872a1a6c7a2ac4d71..e8d8b23660da654c94c9eb72ca805620f77957e6 100644
--- a/server/routes.ts
+++ b/server/routes.ts
@@ -260,51 +260,51 @@ export async function registerRoutes(app: Express): Promise<Server> {
   app.post("/api/audits/:id/generate-pdf", generatePDFReport);

   // New Deepseek AI workflow endpoint
   app.post("/api/audit", async (req, res) => {
     try {
       const { answers } = req.body;

       if (!answers || typeof answers !== 'object') {
         return res.status(400).json({ 
           message: "Questionnaire answers are required" 
         });
       }

       console.log("Processing audit with Deepseek AI...");

       // Step 1: Call Deepseek with questionnaire answers and PDF content
       const pdfContent = answers.pdfContent || [];
       const auditResult = await callDeepseek(answers, 'deepseek/deepseek-r1-0528-qwen3-8b:free', pdfContent);

       // Step 2: Generate HTML from audit result
       const auditData = {
         zipCode: answers.zipCode || 'Not specified',
         ...answers
       };

-      // Step 3: Generate PDF using Puppeteer
+      // Step 3: Generate PDF using jsPDF
       const pdfBuffer = await generatePDFFromHTML(auditResult, auditData);

       // Step 4: Send PDF to browser
       const filename = `Disaster_Dodger_AI_Report_${auditData.zipCode}_${new Date().toISOString().split('T')[0]}.pdf`;

       res.setHeader("Content-Type", "application/pdf");
       res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
       res.setHeader("Content-Length", pdfBuffer.length.toString());

       res.send(pdfBuffer);

     } catch (error: any) {
       console.error("Deepseek audit workflow error:", error);
       res.status(500).json({ 
         message: "Error generating AI audit report: " + error.message 
       });
     }
   });

   // Stripe webhook for payment confirmation
   app.post("/api/webhook", async (req, res) => {
     try {
       const event = req.body;

       if (event.type === 'payment_intent.succeeded') {
