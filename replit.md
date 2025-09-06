# KU-ONLINE Marketplace - Replit Configuration

## Project Overview
KU-ONLINE is a modern marketplace application built with Next.js 15, featuring Supabase integration for authentication and database functionality. The application serves as a multi-vendor local marketplace for the Kurdistan region.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **UI Components**: ShadCN UI with Radix components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Backend**: Supabase (authentication, database, real-time)
- **Deployment**: Configured for Replit autoscale

## Current Setup Status
✅ Dependencies installed and configured
✅ Next.js configured for Replit environment
✅ Development server running on port 5000
✅ Supabase client integration working
✅ Authentication pages functional
✅ Deployment configuration set up

## Environment Configuration
- Development server: `npm run dev -- --port 5000 --hostname 0.0.0.0`
- Supabase URL and keys configured via environment variables (.env.local)
- Cross-origin requests handled for Replit proxy

## Recent Changes (September 2025)
- Fixed module resolution for Supabase client imports
- Configured Next.js for Replit environment with proper host settings
- Set up development workflow on port 5000 with webview output
- Configured autoscale deployment target for production

## Known Issues
- Minor database schema warnings (products.created_at column reference)
- Some unused session variables (development-only issue)
- Hydration warnings in development (expected for client-side auth)

## Architecture Notes
- Uses Next.js App Router with client components for auth
- Supabase configured with both client-side and server-side helpers
- Responsive design with mobile navigation
- Product listing with real-time updates capability

## User Preferences
- Production-ready marketplace focus
- Maintained existing Supabase configuration
- Preserved UI component structure and styling