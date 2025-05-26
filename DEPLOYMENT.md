# Deployment Guide

This document provides instructions for deploying the GoViral Instagram Trial application to Vercel.

## Environment Variables

Make sure to configure the following environment variables in your Vercel project settings:

### Core API Keys

- `BLOB_READ_WRITE_TOKEN`: Your Vercel Blob Storage read-write token
- `SHOPIFY_ADMIN_API_TOKEN`: Your Shopify Admin API token
- `JUST_ANOTHER_PANEL_API_KEY`: Your API key for the JustAnotherPanel service

### Email Configuration

The application uses SMTP to send verification emails. Configure these variables for email delivery:

- `EMAIL_FROM`: The sender email address (e.g., "soporte@goviral.es")
- `EMAIL_HOST`: SMTP server hostname (e.g., "smtp.office365.com")
- `EMAIL_PORT`: SMTP server port (typically "587")
- `EMAIL_SECURE`: Whether to use secure connection ("true" or "false")
- `EMAIL_USER`: SMTP username (typically your email address)
- `EMAIL_PASSWORD`: SMTP password

#### Troubleshooting Email in Production

If you experience issues with email delivery in production:

1. **Office 365 specific issues**:
   - Make sure 2FA is not enabled for the email account, or use an App Password instead
   - Verify that SMTP is enabled for your Office 365 account
   - Check if there are any IP restrictions that might prevent Vercel from connecting

2. **Alternative email provider**:
   You can use SendGrid as a fallback by configuring:
   - `SENDGRID_API_KEY`: Your SendGrid API key

## Vercel Project Settings

### Build and Development Settings

- **Framework Preset**: Next.js
- **Build Command**: `next build`
- **Output Directory**: `.next`
- **Development Command**: `next dev`

### Environment Variable Setup

1. Go to your Vercel project dashboard
2. Navigate to the "Settings" tab
3. Select "Environment Variables" 
4. Add each of the environment variables listed above
5. Make sure to select the appropriate environments (Production, Preview, Development)

## Vercel Blob Storage

This application uses Vercel Blob Storage for data persistence. Ensure your Blob Storage is correctly configured:

1. In the Vercel dashboard, go to "Storage"
2. Select "Blob"
3. Create a new store if you don't have one already
4. Copy the store ID and read-write token to your environment variables

## Deployment Steps

1. Push your code to your GitHub repository
2. Connect your repository to Vercel if you haven't already
3. Configure all environment variables in Vercel
4. Deploy the application

## Post-Deployment Verification

After deployment, verify that:

1. The application loads correctly
2. The trial form functions properly
3. Email verification codes are being sent (test with a real email)
4. Verifications are being processed correctly
5. Shopify customer creation is working

## Monitoring Production Issues

To monitor email sending issues in production:

1. Check Vercel logs for any error messages related to email sending
2. Verify that the correct email credentials are being used
3. Test sending emails directly from your SMTP server to confirm it's functioning

If emails are consistently failing in production, consider switching to a more reliable email service like SendGrid by configuring the `SENDGRID_API_KEY` environment variable. 