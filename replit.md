# Disaster Dodger™ - Home Disaster Preparedness Audit Platform

## Overview

Disaster Dodger™ is a comprehensive web application that provides personalized home disaster preparedness audits. The platform allows users to complete questionnaires based on their location and primary hazards, then generates detailed PDF reports with FEMA-cited recommendations, cost estimates, and insurance savings calculations. The system integrates with Stripe for payment processing and uses AI-powered report generation through DeepSeek API.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query (React Query) for server state
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon (serverless PostgreSQL)
- **Payment Processing**: Stripe integration
- **PDF Generation**: jsPDF and custom HTML-to-PDF pipeline
- **AI Integration**: DeepSeek API via OpenRouter for intelligent report generation

### Key Components

#### Database Layer
- **ORM**: Drizzle with PostgreSQL dialect
- **Schema**: Comprehensive audit tracking with hazard-specific fields
- **Migrations**: Automated database migration system
- **Indexing**: Performance-optimized indexes for common queries

#### Authentication & Payments
- **Payment Gateway**: Stripe for secure payment processing
- **Session Management**: Built-in session handling
- **Environment-based Configuration**: Separate dev/production settings

#### Report Generation System
- **Automated Reports**: Comprehensive recommendation engine with FEMA citations
- **AI-Enhanced Reports**: DeepSeek integration for creative, personalized reports
- **PDF Pipeline**: Multi-format PDF generation (professional and creative templates)
- **Insurance Calculator**: Real-time premium savings calculations

#### Questionnaire Engine
- **Dynamic Forms**: Hazard-specific question sets
- **Progress Tracking**: Multi-step wizard with validation
- **Data Persistence**: Auto-save functionality
- **Conditional Logic**: Smart question flow based on previous answers

## Data Flow

1. **User Registration**: ZIP code collection and hazard identification
2. **Payment Processing**: Stripe integration for audit fees
3. **Questionnaire Completion**: Progressive form with section-based organization
4. **Data Analysis**: AI-powered analysis of responses and local hazard data
5. **Report Generation**: Multiple format options (standard, creative, insurance-focused)
6. **Delivery**: PDF download with email backup option

## External Dependencies

### Core Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting
- **Stripe**: Payment processing and subscription management
- **OpenRouter/DeepSeek**: AI-powered content generation

### Development Tools
- **Replit**: Primary development environment
- **Vite**: Build tooling and development server
- **TypeScript**: Type safety across frontend and backend

### UI/UX Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Lucide React**: Icon library
- **jsPDF**: Client-side PDF generation

## Deployment Strategy

### Production Environment
- **Platform**: Replit autoscale deployment
- **Build Process**: Vite production build with esbuild server bundling
- **Static Assets**: Served from dist/public directory
- **Environment Variables**: Secure configuration management

### Development Workflow
- **Hot Reload**: Vite HMR for rapid development
- **Type Checking**: Real-time TypeScript validation
- **Database**: Automatic migration system
- **Testing**: Built-in error overlay and debugging tools

## Changelog

Changelog:
- June 24, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.