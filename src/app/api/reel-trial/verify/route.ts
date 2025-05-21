import { NextResponse } from "next/server";
import { addReelViewsOrder } from "@/lib/api";
import { addTrial } from "@/lib/fileStorage";
import { verifyCode } from "@/lib/verification";
import { createCustomer, ShopifyCustomerInput } from "@/lib/shopify";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { email, code } = body;
    
    // Validate required fields
    if (!email || !code) {
      return NextResponse.json(
        { message: "Email y código de verificación son obligatorios" },
        { status: 400 }
      );
    }
    
    // Verify the code
    const verificationResult = await verifyCode(email, code);
    
    if (!verificationResult.success || !verificationResult.verification) {
      return NextResponse.json(
        { message: verificationResult.message || "Código de verificación inválido" },
        { status: 400 }
      );
    }
    
    const { verification } = verificationResult;
    
    // Call the JustAnotherPanel API to add the order
    const result = await addReelViewsOrder({ link: verification.instagramUrl });
    
    if (!result.success) {
      console.error("Error adding reel views order:", result.error);
      return NextResponse.json(
        { 
          message: "Error al procesar la solicitud. Por favor, inténtalo de nuevo.",
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    // Record the trial to prevent duplicate trials
    await addTrial(verification.email, verification.instagramUrl);
    
    // Create customer in Shopify
    try {
      // Parse the name (assuming format is "First Last")
      const nameParts = verification.name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      console.log("Creating Shopify customer with data:", {
        name: verification.name,
        email: verification.email,
        instagramUrl: verification.instagramUrl
      });
      
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
        console.log("Shopify customer created successfully:", shopifyResult.customerId);
      } else {
        console.error("Error creating Shopify customer:", shopifyResult.error);
      }
    } catch (shopifyError) {
      // Log the error but don't fail the entire request
      console.error("Error creating Shopify customer:", shopifyError);
    }
    
    // Return success response
    return NextResponse.json({
      message: "¡Genial! Tu prueba de visualizaciones ha sido enviada.",
      orderId: result.order
    });
    
  } catch (error) {
    console.error("Error processing verification:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 