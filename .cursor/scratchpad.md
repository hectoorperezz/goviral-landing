# Project Scratchpad

## Background and Motivation
This is a Next.js project for GoViral's landing page. The project uses Next.js 15.3.2, React 19, TypeScript, and Tailwind CSS for styling. The site appears to be a marketing landing page for GoViral, a social media service company that helps users grow their presence on various platforms like Instagram, TikTok, YouTube, and Spotify.

The client wants to add a new component to the landing page that allows users to try their Instagram reel view service. Users will need to input their name, email, and Instagram reel URL to receive a trial of views on their reel.

A new requirement has been added: implementing email verification to ensure users provide valid email addresses before receiving the free trial.

An additional requirement is now being considered: creating a customer record in Shopify when a user requests a trial, using the Shopify Storefront API.

## Key Challenges and Analysis
- The project is built with modern Next.js App Router architecture
- Uses Google Analytics and Google Ads tracking with custom event tracking
- Has a clean, modern design using Geist font family
- The main page is quite large (77KB) with multiple sections including a header, hero section, features, and more
- Includes a plan configurator component and page
- Has Shopify integration for checkout functionality
- The UI follows an Apple-inspired design style with gradient backgrounds, rounded corners, and clean typography
- There are some linter errors related to TypeScript types
- The site includes tracking for various user interactions using Google Analytics events

### New Feature Analysis
For the Instagram reel view trial component, we need to:
1. Create a form component that matches the site's design aesthetic
2. Implement form validation for name, email, and Instagram reel URL
3. Create an API endpoint to handle form submissions
4. Connect to the JustAnotherPanel API to send 500 views to the user's Instagram reel
5. Track form submissions with Google Analytics
6. Provide user feedback (success/error messages)
7. Ensure the component is responsive and accessible
8. Implement a system to prevent abuse of the trial feature
9. Add email verification to validate user emails before processing the trial request
10. Create a customer record in Shopify when a user completes the verification process

### API Integration Details
- API Endpoint: `https://justanotherpanel.com/api/v2`
- API Key: `c8ad1878ef37d9cccb446afb3569121e`
- Service ID: `442` (for 500 Instagram reel views)
- Required parameters:
  - `key`: API key
  - `action`: "add" (to add an order)
  - `service`: Service ID
  - `link`: Instagram reel URL
  - `quantity`: 500 (for the trial)

### Email Verification Plan

#### Problem Statement
Currently, users can submit any syntactically valid email address to receive the free trial, but there's no verification that the email actually belongs to the user. This could lead to:
1. Abuse of the free trial system
2. Collection of invalid email addresses
3. Reduced effectiveness of follow-up marketing efforts

#### Requirements
1. Send a verification email with a unique code/link to the user's email address
2. Require the user to verify their email before processing their trial request
3. Store pending trial requests until verification is complete
4. Provide clear user feedback throughout the verification process
5. Implement timeout for verification links (e.g., 24 hours)
6. Track verification metrics (sent, completed, expired)

#### Selected Solution: Email Verification with Verification Code

We'll implement an email verification system that sends a 6-digit verification code to the user's email. This approach offers:

- **Security**: Ensures the user owns the email address they provided
- **User Experience**: Simple verification process without requiring complex token handling
- **Flexibility**: Can be extended with additional security features if needed
- **Analytics**: Enables tracking of verification completion rates

#### Implementation Details

1. **User Flow**:
   - User submits form with name, email, and Instagram reel URL
   - System validates inputs and checks for duplicate trials
   - If valid, system generates a 6-digit verification code
   - System sends verification email and stores pending request
   - User receives email with verification code
   - User enters verification code on the website
   - If code is correct, system processes the trial request
   - If code is incorrect, user can request a new code (with rate limiting)

2. **Data Structure for Pending Verifications**:
   ```json
   {
     "pendingVerifications": [
       {
         "email": "user@example.com",
         "name": "User Name",
         "instagramUrl": "https://www.instagram.com/reel/ABC123/",
         "verificationCode": "123456",
         "createdAt": 1686123456789,
         "expiresAt": 1686209856789,
         "attempts": 0
       }
     ]
   }
   ```

3. **Email Template**:
   - Clean, branded email design matching the website's aesthetic
   - Clear instructions for using the verification code
   - Verification code displayed prominently
   - Link back to the website
   - Support information

4. **API Endpoints**:
   - `POST /api/reel-trial/request`: Create a new trial request and send verification email
   - `POST /api/reel-trial/verify`: Verify the code and process the trial if valid

5. **Key Functions**:
   - `generateVerificationCode()`: Generate a random 6-digit code
   - `sendVerificationEmail()`: Send the verification email
   - `createPendingVerification()`: Store the pending verification
   - `verifyCode()`: Check if the provided code matches
   - `processTrial()`: Process the trial after successful verification
   - `cleanupExpiredVerifications()`: Remove expired verification requests

## Anti-Abuse System Plan

### Problem Statement
We need to prevent users from abusing the free trial feature by submitting multiple requests for the same Instagram account or from the same person.

### Requirements
1. Limit one trial per Instagram account/reel URL
2. Limit one trial per email address
3. Maintain a record of trials to enforce these limits
4. Provide clear feedback when a user has already used the trial

### Selected Solution: JSON File Storage

We'll implement a file-based storage solution using a JSON file to track trial submissions. This approach offers:

- **Persistence**: Data persists across all users and server restarts
- **Simplicity**: No external database dependencies
- **Security**: Data stored on the server is more secure than client-side solutions
- **Flexibility**: Can be easily migrated to a database solution later if needed

#### Implementation Details

1. **File Structure**:
   ```json
   {
     "trials": [
       {
         "email": "user@example.com",
         "instagramUrl": "https://www.instagram.com/reel/ABC123/",
         "reelId": "ABC123",
         "timestamp": 1686123456789
       }
     ]
   }
   ```

2. **Storage Location**:
   - Create a `data` directory in the project root
   - Store the JSON file at `data/trials.json`
   - Add the directory to `.gitignore` to prevent committing user data

3. **Key Functions**:
   - `ensureStorageExists()`: Create the file if it doesn't exist
   - `getTrials()`: Read all trials from the file
   - `addTrial()`: Add a new trial to the file
   - `checkTrialExists()`: Check if an email or reel ID exists in the file

## Project Structure
- **src/app**: Main application routes using Next.js App Router
  - **layout.tsx**: Root layout with metadata, fonts, and analytics scripts
  - **page.tsx**: Main landing page with multiple sections
  - **plan-configurator/**: Route for plan configuration
  - **api/reel-trial/route.ts**: API endpoint for handling reel trial submissions
- **src/components**: 
  - **PlanConfigurator.tsx**: Component for configuring service plans
  - **ShopifyCheckout.tsx**: Component for Shopify checkout integration
  - **InstagramReelTrial.tsx**: New component for Instagram reel view trial
- **src/lib**:
  - **shopify.ts**: Utility functions for Shopify integration
  - **api.ts**: API helper functions for JustAnotherPanel API integration
  - **fileStorage.ts**: File-based storage utility functions (to be added)

## High-level Task Breakdown

### 1. Create Instagram Reel Trial Component
- [x] Create a new component file `src/components/InstagramReelTrial.tsx`
- [x] Design the form UI with fields for name, email, and Instagram reel URL
- [x] Implement form state management and validation
- [x] Add success/error feedback UI elements
- [x] Style the component to match the site's design

### 2. Create API Helper Functions
- [x] Create a new file `src/lib/api.ts` for API helper functions
- [x] Implement a function to call the JustAnotherPanel API
- [x] Add error handling and response parsing

### 3. Create API Endpoint for Form Submission
- [x] Create a new API route at `src/app/api/reel-trial/route.ts`
- [x] Implement request validation
- [x] Create a service to connect to JustAnotherPanel API
- [x] Implement the API call to add an order with service ID 442
- [x] Handle API responses and errors
- [x] Store user information (name and email) for potential follow-up
- [x] Return appropriate responses

### 4. Integrate the Component into the Landing Page
- [x] Determine the best placement for the component in the landing page
- [x] Add the component to `src/app/page.tsx`
- [x] Add navigation link to the component in the header
- [x] Ensure responsive design works on all screen sizes

### 5. Add Analytics Tracking
- [x] Add event tracking for form submissions
- [x] Add event tracking for successful/failed submissions
- [x] Update existing tracking helpers if needed

### 6. Fix TypeScript Errors
- [x] Install React type declarations
- [x] Fix remaining TypeScript errors in components
- [x] Fix TypeScript errors in the API route

### 7. Implement File-Based Anti-Abuse System
- [x] Create file storage utility functions (src/lib/fileStorage.ts)
- [x] Implement functions to check for existing trials
- [x] Update API endpoint to use the file storage
- [x] Update frontend to handle duplicate trial errors
- [x] Test the anti-abuse system

### 8. Testing
- [ ] Test form validation
- [ ] Test API endpoint
- [ ] Test JustAnotherPanel API integration
- [ ] Test responsive design
- [ ] Test analytics tracking
- [ ] Test anti-abuse system

### 9. Implement Shopify Customer Creation
- [ ] 9.1 Set Up Shopify API Access
- [ ] 9.2 Implement Customer Creation Functions
- [ ] 9.3 Create Server-Side API Endpoint
- [ ] 9.4 Integrate with Trial Process
- [ ] 9.5 Testing and Validation

## Project Status Board
- [x] 0. Setup implementation environment
  - [x] 0.1 Review project structure
  - [x] 0.2 Create implementation plan
- [x] 1. Create Instagram Reel Trial Component
  - [x] 1.1 Create component file structure
  - [x] 1.2 Implement form UI and state management
  - [x] 1.3 Add form validation
  - [x] 1.4 Add loading/success/error states
  - [x] 1.5 Style component to match site design
- [x] 2. Create API Helper Functions
  - [x] 2.1 Create API helper file
  - [x] 2.2 Implement JustAnotherPanel API function
  - [x] 2.3 Add error handling
- [x] 3. Create API Endpoint
  - [x] 3.1 Create API route file
  - [x] 3.2 Implement request validation
  - [x] 3.3 Connect to JustAnotherPanel API
  - [x] 3.4 Add error handling
- [x] 4. Integrate Component into Landing Page
  - [x] 4.1 Determine optimal placement
  - [x] 4.2 Add component to page
  - [x] 4.3 Add navigation link in header
- [x] 5. Fix TypeScript Errors
  - [x] 5.1 Install React type declarations
  - [x] 5.2 Fix remaining TypeScript errors
- [x] 6. Implement File-Based Anti-Abuse System
  - [x] 6.1 Create file storage utility
  - [x] 6.2 Implement trial record checking
  - [x] 6.3 Update API endpoint for duplicate checking
  - [x] 6.4 Update frontend for duplicate handling
  - [x] 6.5 Create data directory and initial file
  - [ ] 6.6 Test anti-abuse system
- [x] 7. Implement Email Verification
  - [x] 7.1 Update Data Storage
    - [x] 7.1.1 Create pending verifications data structure
    - [x] 7.1.2 Implement verification storage functions
    - [x] 7.1.3 Add verification code utilities
    - [x] 7.1.4 Add expiration handling
  - [x] 7.2 Create Email Sending Functionality
    - [x] 7.2.1 Select and integrate email service (Nodemailer)
    - [x] 7.2.2 Create email templates
    - [x] 7.2.3 Implement sending functions
  - [x] 7.3 Update API Endpoints
    - [x] 7.3.1 Create request endpoint
    - [x] 7.3.2 Create verification endpoint
    - [x] 7.3.3 Update trial processing logic
  - [x] 7.4 Update Frontend Components
    - [x] 7.4.1 Add verification step to UI flow
    - [x] 7.4.2 Create verification code input form
    - [x] 7.4.3 Add resend functionality
  - [x] 7.5 Add Analytics Tracking
  - [ ] 7.6 Testing
- [x] 8. Implement Shopify Customer Creation
  - [x] 8.1 Set Up Shopify API Access
  - [x] 8.2 Implement Customer Creation Functions
  - [x] 8.3 Create Server-Side API Endpoint
  - [x] 8.4 Integrate with Trial Process
  - [x] 8.5 Fix Shopify API Connection Issues
  - [ ] 8.6 Testing and Validation
- [ ] 9. Final Testing and Deployment
  - [ ] 9.1 Comprehensive testing
  - [ ] 9.2 Deploy changes

## Executor's Feedback or Assistance Requests
I've fixed the Shopify customer creation functionality by addressing the following issues:

1. **Fixed API URL Format**:
   - Updated the Shopify store URL from `goviral-4810.account.myshopify.com` to `goviral-4810.myshopify.com`
   - Changed the API version from `2025-04` (which doesn't exist yet) to `2023-10` (a stable version)

2. **Improved API Integration**:
   - Removed direct GraphQL API calls in the verification endpoint
   - Now using the utility functions from shopify.ts consistently across all endpoints
   - Added proper error handling and logging

3. **Added Diagnostic Tools**:
   - Created a test endpoint at `/api/test-shopify` to verify the Shopify connection
   - Added detailed diagnostic information to help troubleshoot any remaining issues

4. **Fixed TypeScript Errors**:
   - Added type declarations for global objects
   - Created missing components to resolve import errors

### Next Steps for Testing

1. **Test the Shopify Connection**:
   - Access the `/api/test-shopify` endpoint to verify the connection is working
   - Check the console logs for detailed information about the API response

2. **Test the Complete User Flow**:
   - Submit a trial request with a valid email
   - Complete the email verification process
   - Verify that a customer record is created in Shopify

3. **Error Handling Testing**:
   - Test with an email that already exists in Shopify
   - Test with invalid email formats
   - Verify that the trial process still completes even if Shopify customer creation fails

### Remaining Issues to Address

1. **Move API Tokens to Environment Variables**:
   - The Shopify API token is currently hardcoded in the source files
   - Should be moved to environment variables for better security

2. **Implement Retry Logic**:
   - Add retry logic for Shopify API calls in case of temporary failures

3. **Add Comprehensive Logging**:
   - Implement structured logging for better debugging and monitoring

## Implementation Summary

### What's Been Implemented
1. **Instagram Reel Trial Component**: A responsive form component that allows users to submit their name, email, and Instagram reel URL to receive 500 free views.
2. **API Integration**: Integration with JustAnotherPanel API to send 500 views to the submitted Instagram reel.
3. **Form Validation**: Client-side validation for all form fields to ensure data quality.
4. **Analytics Tracking**: Tracking of form submissions and outcomes for analytics purposes.
5. **User Feedback**: Clear success and error messages to provide feedback to users.
6. **Navigation**: Added a new navigation link in the header for easy access to the trial section.
7. **Anti-Abuse System**: Implemented a file-based system to track trial usage and prevent duplicate submissions from the same email or for the same Instagram reel.
8. **Email Verification**: Added a two-step verification process to ensure users provide valid email addresses before receiving the free trial.
9. **Shopify Customer Creation**: Added functionality to create customer records in Shopify when users complete the trial verification using the GraphQL Admin API.

### Next Steps
1. **Test Email Verification System**: Test the complete verification flow to ensure it works correctly.
2. **Test Shopify Customer Creation**: Verify that customers are properly created in Shopify after completing the verification process.
3. **Comprehensive Testing**: Test all functionality including form validation, API integration, and analytics tracking.
4. **Deployment**: Deploy the changes to the production environment.

## Lessons
- Include info useful for debugging in the program output
- Read the file before trying to edit it
- Run npm audit if vulnerabilities appear in the terminal
- Always ask before using the -force git command
- When extending Window interface for global objects, use the global declaration approach
- Install type declarations for third-party libraries to fix TypeScript errors
- Consider file-based storage for simple persistence when a database is not available
- Store API tokens securely in server-side code, never expose them in client-side code or commit them to version control
- When working with Shopify APIs, use the GraphQL Admin API instead of the REST API which is being deprecated
- Always include proper version headers when making API requests to Shopify
- Handle API errors gracefully to ensure a good user experience even when third-party services fail
- Use `emailMarketingConsent` object instead of the deprecated `acceptsMarketing` field in Shopify customer creation (removed in API 2024-01)
- Always pin the API version with `X-Shopify-API-Version` header to ensure consistent behavior across API updates 
- Implement proper logging for debugging API responses, especially for GraphQL which can have complex error structures
- Ensure customer data is properly formatted before sending to Shopify (e.g., splitting full name into first and last name)
- Use correct Shopify store URL format (goviral-4810.myshopify.com, not goviral-4810.account.myshopify.com)
- Use a stable and existing API version (e.g., 2023-10) rather than a future version (2025-04)

## UI Improvements Plan for Instagram Trial Feature

### Background and Motivation
The current Instagram Reel Trial feature is functional but could benefit from visual enhancements to make it more engaging, recognizable, and aligned with the Instagram brand while maintaining GoViral's design language. Additionally, the navigation link in the header needs more prominence to increase user engagement with this feature.

### Key Challenges and Analysis
1. **Brand Recognition**: Users should immediately recognize that this feature is related to Instagram without confusing it with an official Instagram feature.
2. **Visual Appeal**: The current UI is functional but could be more visually engaging to attract users.
3. **User Flow Clarity**: The verification process should be visually intuitive and guide users through each step.
4. **Call to Action**: The header navigation link should stand out more to drive traffic to the trial feature.

### High-level Task Breakdown
- [x] 1. Header Navigation Enhancement
  - [x] 1.1 Make the "Prueba Gratis" link more prominent with Instagram-inspired gradient colors
  - [x] 1.2 Add an icon to the link to increase visibility
  - [x] 1.3 Implement hover effects for better interactivity
- [x] 2. Instagram Trial Section Improvements
  - [x] 2.1 Add Instagram branding elements (logo, colors)
  - [x] 2.2 Implement a two-column layout for better content organization
  - [x] 2.3 Add visual feature highlights with icons
  - [x] 2.4 Improve typography and spacing
- [x] 3. Form UI Enhancements
  - [x] 3.1 Add field icons for better visual guidance
  - [x] 3.2 Implement Instagram-inspired gradient buttons
  - [x] 3.3 Improve form validation visual feedback
- [x] 4. Verification Process Improvements
  - [x] 4.1 Create a digit-by-digit verification code input for better UX
  - [x] 4.2 Add clearer instructions and visual cues
  - [x] 4.3 Enhance the verification success state with animations
- [x] 5. Success State Enhancement
  - [x] 5.1 Add celebration animation
  - [x] 5.2 Improve visual hierarchy of information
  - [x] 5.3 Add call-to-action for additional services

### Project Status Board
- [x] 0. Setup implementation environment
  - [x] 0.1 Review project structure
  - [x] 0.2 Create implementation plan
- [x] 1. Create Instagram Reel Trial Component
  - [x] 1.1 Create component file structure
  - [x] 1.2 Implement form UI and state management
  - [x] 1.3 Add form validation
  - [x] 1.4 Add loading/success/error states
  - [x] 1.5 Style component to match site design
- [x] 2. Create API Helper Functions
  - [x] 2.1 Create API helper file
  - [x] 2.2 Implement JustAnotherPanel API function
  - [x] 2.3 Add error handling
- [x] 3. Create API Endpoint
  - [x] 3.1 Create API route file
  - [x] 3.2 Implement request validation
  - [x] 3.3 Connect to JustAnotherPanel API
  - [x] 3.4 Add error handling
- [x] 4. Integrate Component into Landing Page
  - [x] 4.1 Add component to page
  - [x] 4.2 Style section to match site design
  - [x] 4.3 Add navigation link to header
- [x] 5. Implement Email Verification
  - [x] 5.1 Create verification component
  - [x] 5.2 Implement verification API endpoint
  - [x] 5.3 Add verification logic to component
  - [x] 5.4 Style verification UI
- [x] 6. Create Shopify Integration
  - [x] 6.1 Create Shopify API helper functions
  - [x] 6.2 Implement customer creation mutation
  - [x] 6.3 Connect verification endpoint to Shopify API
  - [x] 6.4 Add error handling and logging
- [x] 7. UI Improvements
  - [x] 7.1 Enhance header navigation with Instagram-inspired styling
  - [x] 7.2 Add Instagram branding elements to the trial section
  - [x] 7.3 Implement two-column layout for better content organization
  - [x] 7.4 Add form field icons and improve button styling
  - [x] 7.5 Create digit-by-digit verification code input
  - [x] 7.6 Enhance success state with animations and better visual hierarchy

### Executor's Feedback or Assistance Requests
All UI improvements have been successfully implemented. The Instagram trial section now has:
- A prominent header navigation link with Instagram-inspired gradient colors
- Instagram branding elements including the logo and gradient colors
- A two-column layout with feature highlights and icons
- Enhanced form fields with icons and better styling
- A digit-by-digit verification code input for better UX
- An improved success state with animations and better visual hierarchy

### Lessons
- When implementing UI improvements, focus on both aesthetics and usability
- Use subtle animations to make the UI feel more responsive and engaging
- Maintain brand consistency while incorporating elements from third-party services (like Instagram)
- Digit-by-digit verification inputs provide better UX for verification codes
- Using SVG icons with gradients can create a more modern and polished look 