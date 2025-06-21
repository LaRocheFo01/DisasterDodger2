# Disaster Dodger™ - Home Disaster Preparedness Audit Platform

## Overview

Disaster Dodger™ is a comprehensive home disaster preparedness audit platform that provides personalized safety assessments and automated report generation. The application helps homeowners evaluate their disaster readiness and provides actionable recommendations with cost estimates, insurance savings calculations, and FEMA-backed guidance.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI with shadcn/ui design system
- **Styling**: Tailwind CSS with custom disaster-themed color palette
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript (ESM modules)
- **Database**: PostgreSQL with Drizzle ORM
- **PDF Generation**: jsPDF and PDFKit for report generation
- **Payment Processing**: Stripe integration
- **AI Integration**: DeepSeek API via OpenRouter for intelligent report generation

### Key Components

#### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Connection**: Neon serverless PostgreSQL via @neondatabase/serverless
- **Schema**: Comprehensive audit data model with hazard-specific fields
- **Migrations**: Database migration system with versioning

#### Report Generation System
- **Automated Reports**: Machine-readable retrofit recommendation library
- **Creative Reports**: AI-powered personalized safety narratives
- **PDF Generation**: Multiple PDF generation strategies (jsPDF, PDFKit)
- **Template System**: Configurable report templates and styling

#### Payment Integration
- **Provider**: Stripe with secure payment intent flow
- **Pricing**: $29 audit fee with potential for tiered pricing
- **Security**: Server-side payment validation and webhook handling

#### Hazard Assessment Engine
- **Coverage**: Earthquake, Hurricane/Wind, Flood, Wildfire
- **ZIP Code Mapping**: Comprehensive nationwide hazard risk mapping
- **Risk Scoring**: Multi-factor risk assessment algorithm
- **Recommendations**: Hazard-specific retrofit and preparedness guidance

## Data Flow

1. **User Onboarding**: ZIP code entry → hazard identification → audit creation
2. **Payment Processing**: Stripe payment intent → payment confirmation → audit activation
3. **Questionnaire Flow**: Progressive multi-section questionnaire with conditional logic
4. **Report Generation**: 
   - Audit data collection → AI analysis → PDF generation → delivery
   - Both automated (rule-based) and creative (AI-powered) report types
5. **Insurance Calculator**: Cost-benefit analysis with premium savings estimation

## External Dependencies

### Payment Services
- **Stripe**: Payment processing with webhook validation
- **Configuration**: Requires STRIPE_SECRET_KEY environment variable

### AI Services
- **DeepSeek API**: Accessed via OpenRouter for intelligent report generation
- **Configuration**: Requires DEEPSEEK_API_KEY environment variable
- **Model**: deepseek/deepseek-r1-0528-qwen3-8b:free

### Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Configuration**: Requires DATABASE_URL environment variable
- **Connection**: WebSocket-based connection with connection pooling

### Infrastructure Dependencies
- **Node.js 20**: Runtime environment
- **PostgreSQL 16**: Database server
- **Replit Environment**: Development and deployment platform

## Deployment Strategy

### Development Environment
- **Platform**: Replit with integrated development environment
- **Database**: Neon PostgreSQL serverless
- **Port Configuration**: Application runs on port 5000
- **Hot Reload**: Vite development server with HMR

### Production Deployment
- **Build Process**: Vite frontend build + esbuild server bundle
- **Static Files**: Frontend assets served from dist/public
- **Server**: Express server serving API and static files
- **Environment**: Production NODE_ENV with optimized builds

### Configuration Management
- **Environment Variables**: .env file for development, Replit secrets for production
- **Required Variables**: DATABASE_URL, STRIPE_SECRET_KEY, DEEPSEEK_API_KEY, NODE_ENV
- **Validation**: Startup environment variable validation with helpful error messages

## Changelog

- June 21, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.