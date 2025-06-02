import puppeteer from 'puppeteer';
import type { DeepseekAuditResult } from './deepseek-service';
import { renderAuditHTML } from './deepseek-service';

export async function generatePDFFromHTML(
  audit: DeepseekAuditResult, 
  auditData: any
): Promise<Buffer> {
  let browser;
  
  try {
    // Launch Puppeteer browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Generate HTML content
    const finalHTML = renderAuditHTML(audit, auditData);
    
    // Set content and wait for it to load
    await page.setContent(finalHTML, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    
    // Generate PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm'
      },
      printBackground: true,
      preferCSSPageSize: true
    });
    
    return pdfBuffer as Buffer;
    
  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error(`Failed to generate PDF: ${error}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}