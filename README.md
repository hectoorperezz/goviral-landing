# GoViral Instagram Reels Trial

A Next.js application that allows users to try GoViral's Instagram reel view service with email verification and promotional discount codes.

## Features

- **Instagram Reels Trial**: Users can try 500 free views on their Instagram reels
- **Email Verification**: Secure verification system ensures valid email addresses
- **Discount Code System**: Users receive a promotional discount code ("PRUEBAREEL50") after completing the trial
- **Shopify Integration**: Customer information is saved to Shopify for marketing purposes
- **Anti-Abuse Measures**: Prevents duplicate trial requests from the same email or Instagram reel
- **Responsive Design**: Works seamlessly across all devices

## Tech Stack

- **Framework**: Next.js 15.3.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Storage**: Vercel Blob Storage with file-based fallback for development
- **Email**: Nodemailer with SMTP configuration
- **APIs**: Integration with JustAnotherPanel for Instagram views and Shopify Admin API for customer management

## Setup

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Vercel account (for deployment and Blob Storage)
- Shopify store with Admin API access
- SMTP email account (Office 365 recommended)

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```
# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token

# JustAnotherPanel API
JUST_ANOTHER_PANEL_API_KEY=your_api_key

# Shopify API
SHOPIFY_STORE_URL=your-store.myshopify.com
SHOPIFY_API_VERSION=2023-07
SHOPIFY_ADMIN_API_TOKEN=your_admin_api_token

# Email Configuration
EMAIL_FROM=soporte@yourdomain.com
EMAIL_HOST=smtp.office365.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=soporte@yourdomain.com
EMAIL_PASSWORD=your_email_password

# Development Options (optional)
USE_TEST_ACCOUNT=false
MOCK_EMAILS=false
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/gvsocial.git
cd gvsocial
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

- **src/app**: Next.js app router pages and API routes
- **src/components**: React components including Instagram reel trial form
- **src/lib**: Utility functions for API integrations, storage, and email
- **scripts**: Migration and utility scripts
- **data**: Local storage for development fallback

## API Endpoints

- **POST /api/reel-trial/request**: Create a new trial request and send verification email
- **POST /api/reel-trial/verify**: Verify email with code and process the trial
- **POST /api/reel-trial/direct-process**: Direct processing endpoint (admin use only)

## Deployment

Refer to the [Deployment Guide](DEPLOYMENT.md) for detailed instructions on deploying to Vercel.

## License

Proprietary - All rights reserved 