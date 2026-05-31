# Arihant Dashboard - Enterprise Security Setup Guide

This document outlines the manual infrastructure and configuration steps required to achieve the highest level of security for the Arihant Dashboard. Code-level protections (Helmet, Rate Limiting, DOMPurify, Session Inactivity Timeout) have already been implemented in the codebase.

## 1. Supabase Security Configuration

Since Supabase acts as your PostgreSQL database and Authentication provider, you must configure it properly to ensure enterprise-grade security.

### Row Level Security (RLS) - **CRITICAL**
By default, newly created tables in Supabase might be public. You must enable RLS.
1. Go to your Supabase Dashboard > **Authentication** > **Policies**.
2. For **every table** (`admin_users`, `orders`, `products`, etc.), click **Enable RLS**.
3. Create policies restricting access. Example for `admin_users`:
   - Name: `Admins can view all`
   - Allowed operation: `SELECT`
   - Target roles: `authenticated`
   - USING expression: `auth.uid() IN (SELECT user_id FROM admin_users)`

### Multi-Factor Authentication (MFA)
1. Go to Supabase Dashboard > **Authentication** > **Providers**.
2. Scroll to **Multi-Factor Authentication (MFA)** and enable it.
3. Users can now enroll in TOTP (Authenticator App) based MFA via the Supabase Auth UI or API.

### Database Encryption
- Supabase automatically encrypts all data at rest using AES-256. 
- Ensure you enable **Point-in-Time Recovery (PITR)** or Daily Backups in your Supabase Database settings for Disaster Recovery.

## 2. Network Security (Cloudflare WAF)

To protect your Express backend and React frontend against DDoS attacks and malicious bots, we recommend placing Cloudflare in front of your domains.

1. **Change Nameservers**: Point your domain's DNS to Cloudflare.
2. **Enable HTTPS/TLS 1.3**:
   - Go to SSL/TLS > Edge Certificates.
   - Set Minimum TLS Version to **TLS 1.3**.
   - Enable **Always Use HTTPS** and **HTTP Strict Transport Security (HSTS)**.
3. **Web Application Firewall (WAF)**:
   - Go to Security > WAF.
   - Enable the Cloudflare Managed Ruleset.
   - If you detect a DDoS attack, turn on **Under Attack Mode** in the Overview tab.

## 3. Environment Variables (Secrets Management)

Ensure your production `.env` files are strictly protected and NEVER committed to version control.

Required variables:
```env
VITE_SUPABASE_URL="your-supabase-url"
VITE_SUPABASE_ANON_KEY="your-anon-key"
FRONTEND_URL="https://admin.arihant.in" # Used for Strict CORS
```

## 4. Backend Deployment (Node.js)

When deploying `server.js`:
1. Do NOT run as `root`.
2. Ensure you have a process manager like `PM2` set up to automatically restart the application.
3. Set the environment variable `NODE_ENV=production`.
