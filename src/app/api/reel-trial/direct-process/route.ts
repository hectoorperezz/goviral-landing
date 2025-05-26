import { NextRequest, NextResponse } from 'next/server';
import { processTrial } from '@/lib/processTrial';
import { createCustomer } from '@/lib/shopify';
import { checkTrialExists } from '@/lib/blobStorage';

const API_KEY = 'my-secret-api-key';
const DISCOUNT_CODE = 'PRUEBAREEL50';

export async function POST(request: NextRequest) {
  console.log('[direct-process] Processing direct trial request');
  
  try {
    // Simple API key check - in production, use a more secure method
    const providedApiKey = request.headers.get('x-api-key');
    
    if (!providedApiKey || providedApiKey !== API_KEY) {
      console.log('[direct-process] API key validation failed');
      return NextResponse.json(
        { error: 'Unauthorized - Invalid API key' },
        { status: 401 }
      );
    }
    
    // Parse the request body
    const body = await request.json();
    const { name, email, reelUrl, referralCode } = body;
    
    // Validate required fields
    if (!name || !email || !reelUrl) {
      console.log('[direct-process] Missing required fields:', { name, email, reelUrl });
      return NextResponse.json(
        { error: 'Missing required fields: name, email, reelUrl' },
        { status: 400 }
      );
    }
    
    // Check for trial existence to prevent duplicates
    console.log(`[direct-process] Checking if trial exists for email: ${email}, reel: ${reelUrl}`);
    const trialCheck = await checkTrialExists(email, reelUrl);
    
    if (trialCheck.exists) {
      console.log(`[direct-process] Trial already exists for ${email} with reel ${reelUrl}`);
      return NextResponse.json(
        { 
          error: 'Ya has solicitado un trial para este reel', 
          message: 'Ya has solicitado un trial para este reel. No puedes solicitar más de un trial para el mismo reel.' 
        },
        { status: 400 }
      );
    }

    // Process the trial (add to queue or process immediately)
    console.log(`[direct-process] Processing trial for ${email} with reel ${reelUrl}`);
    const result = await processTrial({
      name,
      email,
      reelUrl,
      referralCode,
      verificationMethod: 'direct', // Note that this was directly processed, not verified by email
    });

    if (!result.success) {
      console.error(`[direct-process] Error processing trial:`, result.error);
      return NextResponse.json(
        { error: result.error || 'Failed to process trial' },
        { status: 500 }
      );
    }

    // Create Shopify customer
    try {
      console.log(`[direct-process] Creating Shopify customer for ${email}`);
      const shopifyResult = await createCustomer({
        email,
        firstName: name.split(' ')[0],
        lastName: name.split(' ').slice(1).join(' ') || '',
      });
      
      if (shopifyResult.success) {
        console.log(`[direct-process] Shopify customer created successfully for ${email}`);
      } else {
        console.warn(`[direct-process] Failed to create Shopify customer:`, shopifyResult.error);
      }
    } catch (shopifyError) {
      // Don't fail the entire process if Shopify customer creation fails
      console.error(`[direct-process] Error creating Shopify customer:`, shopifyError);
    }

    // Return success response with discount code
    console.log(`[direct-process] Trial processed successfully for ${email}`);
    return NextResponse.json({
      success: true,
      message: 'Trial processed successfully',
      data: {
        name,
        email,
        reelUrl,
        orderId: result.order
      },
      promotion: {
        discountCode: DISCOUNT_CODE,
        description: '50% de descuento en tu próxima compra',
        validityDays: 7,
        shopUrl: 'https://goviral.es'
      }
    });
  } catch (error) {
    console.error('[direct-process] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 