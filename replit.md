# SafeHaven - Disaster Preparedness Application

## Project Overview
SafeHaven is a comprehensive disaster preparedness application that helps homeowners assess their disaster readiness and generate detailed safety reports. The app provides personalized recommendations based on location-specific hazards and home characteristics.

## Recent Changes
- **2025-01-24**: Successfully migrated from Replit Agent to standard Replit environment
- **2025-01-24**: Configured PostgreSQL database with all required tables
- **2025-01-24**: Set up API integrations for Stripe payments and DeepSeek AI analysis
- **2025-01-24**: Verified email signup functionality and emergency kit download feature

## Project Architecture

### Technology Stack
- **Frontend**: React with Vite, TypeScript, Tailwind CSS
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL (Neon) with Drizzle ORM
- **External APIs**: Stripe for payments, DeepSeek for AI analysis
- **PDF Generation**: jsPDF with custom templates

### Key Features
1. **Home Safety Audits**: Comprehensive questionnaires for different disaster types
2. **AI-Powered Analysis**: DeepSeek integration for intelligent safety recommendations
3. **PDF Report Generation**: Professional safety reports with actionable insights
4. **Emergency Kit Downloads**: Free emergency preparedness resources
5. **Premium Features**: Advanced analysis and detailed reports via Stripe integration

### Database Schema
- `audits`: Stores home safety assessment data
- `email_signups`: Tracks user engagement and kit downloads
- `users`: User authentication and profile management

### External Integrations
- **Facebook Page**: https://www.facebook.com/people/Disaster-Dodger/61577011420592/
- **Stripe**: Payment processing for premium features
- **DeepSeek**: AI-powered safety analysis and recommendations

## Environment Configuration
- **NODE_ENV**: Set to development/production
- **DATABASE_URL**: PostgreSQL connection string
- **STRIPE_SECRET_KEY**: Stripe payment processing
- **DEEPSEEK_API_KEY**: AI analysis capabilities

## User Preferences
- Focus on core functionality: email signup and emergency kit downloads
- No Stripe payment integration needed for now
- No DeepSeek AI analysis required currently
- Prioritize Facebook page integration for updates

## Deployment Status
Application is successfully running on port 5000 in the Replit environment with all features functional.