// ping-slides.js
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Debug environment variables
    console.log('Environment check:');
    console.log('SLIDES_TEMPLATE_ID:', process.env.SLIDES_TEMPLATE_ID ? 'SET' : 'NOT SET');
    console.log('GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'SET' : 'NOT SET');
    console.log('GOOGLE_SERVICE_ACCOUNT:', process.env.GOOGLE_SERVICE_ACCOUNT ? 'SET' : 'NOT SET');
    console.log('OPENAI_API_KEY:', process.env.OPENAI_API_KEY ? 'SET' : 'NOT SET');

    // Check if the template ID is set
    const presentationId = process.env.SLIDES_TEMPLATE_ID;

    if (!presentationId) {
      console.log('❌ Please set SLIDES_TEMPLATE_ID environment variable with your Google Slides template ID');
      process.exit(1);
    }

    console.log('Using template ID:', presentationId);

    // Auth with service account
    const auth = new google.auth.GoogleAuth({
      keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
      scopes: [
        'https://www.googleapis.com/auth/presentations',
        'https://www.googleapis.com/auth/drive'
      ]
    });

    const slides = google.slides({ version: 'v1', auth });

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
    if (error.message.includes('404')) {
      console.log('💡 Check that the SLIDES_TEMPLATE_ID is correct and the document exists');
    }
    process.exit(1);
  }
}

main();