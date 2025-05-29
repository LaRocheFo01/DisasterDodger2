
// ping-slides.js
import { google } from 'googleapis';

async function main() {
  try {
    // Auth with the env var we just set
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/presentations.readonly']
    });

    const slides = google.slides({ version: 'v1', auth });
    
    // Check if the template ID is set
    const presentationId = process.env.SLIDES_TEMPLATE_ID;
    
    if (!presentationId) {
      console.log('❌ Please set SLIDES_TEMPLATE_ID environment variable with your Google Slides template ID');
      process.exit(1);
    }
    
    const res = await slides.presentations.get({
      presentationId: presentationId,
    });
    
    console.log('✅ Slide deck title is:', res.data.title);
    console.log('✅ Service account authentication successful!');
    console.log('Slide count:', res.data.slides?.length || 0);
    
  } catch (error) {
    console.error('❌ Auth/test failed:', error.message);
    if (error.message.includes('403')) {
      console.log('💡 Make sure your service account has access to the Google Slides document');
      console.log('💡 Share the document with: audit-generator-bot@my-free-slides-api.iam.gserviceaccount.com');
    }
    process.exit(1);
  }
}

main();
