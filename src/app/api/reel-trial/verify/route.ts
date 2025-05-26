import { NextResponse } from "next/server";
import { addReelViewsOrder } from "@/lib/api";
import { createCustomer, ShopifyCustomerInput } from "@/lib/shopify";
import { 
  getLatestPendingVerification, 
  deletePendingVerifications,
  saveTrial,
  updatePendingVerification,
  PendingVerification
} from "@/lib/blobStorage";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";
const DISCOUNT_CODE = 'PRUEBAREEL50';

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, code } = body;
    
    console.log(`[reel-trial/verify] Processing verification for ${email}`);
    
    // Validate required fields
    if (!email || !code) {
      console.warn(`[reel-trial/verify] Missing required fields: ${!email ? 'email' : ''} ${!code ? 'code' : ''}`);
      return NextResponse.json(
        { message: "Email y código de verificación son obligatorios" },
        { status: 400 }
      );
    }
    
    // Get verification from Blob storage
    console.log(`[reel-trial/verify] Getting latest verification for ${email}`);
    const verification = await getLatestPendingVerification(email);
    
    if (!verification) {
      console.warn(`[reel-trial/verify] No pending verification found for ${email}`);
      return NextResponse.json(
        { message: "No se encontró ninguna verificación pendiente para este email" },
        { status: 400 }
      );
    }
    
    // Check if verification has expired
    if (Date.now() > verification.expiresAt) {
      console.warn(`[reel-trial/verify] Verification expired for ${email}`);
      await deletePendingVerifications(email);
      return NextResponse.json(
        { message: "El código de verificación ha expirado. Por favor, solicita uno nuevo." },
        { status: 400 }
      );
    }
    
    // Increment attempts
    verification.attempts += 1;
    await updatePendingVerification(verification);
    console.log(`[reel-trial/verify] Incremented attempts to ${verification.attempts} for ${email}`);
    
    // Check if code matches
    if (verification.verificationCode !== code) {
      console.warn(`[reel-trial/verify] Invalid verification code for ${email}. Attempt ${verification.attempts}`);
      return NextResponse.json(
        { message: "Código de verificación incorrecto" },
        { status: 400 }
      );
    }
    
    console.log(`[reel-trial/verify] Verification successful for ${email}, processing order`);
    
    // Code is valid, proceed with the order
    const result = await addReelViewsOrder({ link: verification.instagramUrl });
    
    if (!result.success) {
      console.error(`[reel-trial/verify] Error adding reel views order for ${email}:`, result.error);
      return NextResponse.json(
        { 
          message: "Error al procesar la solicitud. Por favor, inténtalo de nuevo.",
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    console.log(`[reel-trial/verify] Reel views order added successfully: ${result.order}`);
    
    // Save the trial in Blob storage
    const reelId = verification.instagramUrl.match(/\/(?:reel|p)\/([a-zA-Z0-9_-]+)/)?.at(1) || '';
    console.log(`[reel-trial/verify] Saving trial for ${email} with reelId: ${reelId}`);
    
    const trialUrl = await saveTrial({
      email: verification.email,
      name: verification.name,
      instagramUrl: verification.instagramUrl,
      reelId,
      timestamp: Date.now()
    });
    
    console.log(`[reel-trial/verify] Trial saved successfully at: ${trialUrl}`);
    
    // Create customer in Shopify
    try {
      // Parse the name (assuming format is "First Last")
      const nameParts = verification.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      console.log(`[reel-trial/verify] Creating Shopify customer for ${email} (${firstName} ${lastName})`);
      
      // Create customer input object
      const customerInput: ShopifyCustomerInput = {
        firstName,
        lastName,
        email: verification.email,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN"
        },
        tags: ["instagram-trial"],
        note: `Cliente creado a través de la prueba gratuita de Instagram. URL del reel: ${verification.instagramUrl}`
      };
      
      // Use the utility function from shopify.ts
      const shopifyResult = await createCustomer(customerInput, SHOPIFY_ADMIN_API_TOKEN);
      
      if (shopifyResult.success) {
        console.log(`[reel-trial/verify] Shopify customer created successfully: ${shopifyResult.customerId}`);
      } else {
        // Check if the error is because the customer already exists
        const errorMessage = shopifyResult.error || '';
        const isEmailTakenError = errorMessage.includes('Email has already been taken');
        
        if (isEmailTakenError) {
          console.log(`[reel-trial/verify] Customer with email ${email} already exists in Shopify, skipping creation`);
        } else {
          console.error(`[reel-trial/verify] Error creating Shopify customer: ${shopifyResult.error}`);
        }
      }
    } catch (shopifyError) {
      // Log the error but don't fail the entire request
      console.error(`[reel-trial/verify] Error creating Shopify customer:`, shopifyError);
    }
    
    // Remove verification from pending
    console.log(`[reel-trial/verify] Deleting pending verifications for ${email}`);
    await deletePendingVerifications(email);
    
    // Return success response with discount code
    return NextResponse.json({
      message: "¡Genial! Tu prueba de visualizaciones ha sido enviada.",
      orderId: result.order,
      promotion: {
        discountCode: DISCOUNT_CODE,
        description: '50% de descuento en tu próxima compra',
        validityDays: 7,
        shopUrl: 'https://goviral.es'
      }
    });
    
  } catch (error) {
    console.error("[reel-trial/verify] Error processing verification:", error);
    
    // Detailed error information for debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    };
    
    console.error("[reel-trial/verify] Error details:", errorDetails);
    
    return NextResponse.json(
      { message: "Error interno del servidor", details: process.env.NODE_ENV === 'development' ? errorDetails : undefined },
      { status: 500 }
    );
  }
} 