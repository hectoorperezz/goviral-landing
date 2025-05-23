import { NextResponse } from "next/server";
import { addReelViewsOrder } from "@/lib/api";
import { createCustomer, ShopifyCustomerInput } from "@/lib/shopify";
import { 
  getPendingVerification, 
  removePendingVerification 
} from "@/lib/memoryStorage";

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
    
    // Verify the code from in-memory storage
    const verification = getPendingVerification(email);
    
    if (!verification) {
      return NextResponse.json(
        { message: "No se encontró ninguna verificación pendiente para este email" },
        { status: 400 }
      );
    }
    
    // Check if verification has expired
    if (Date.now() > verification.expiresAt) {
      removePendingVerification(email);
      return NextResponse.json(
        { message: "El código de verificación ha expirado. Por favor, solicita uno nuevo." },
        { status: 400 }
      );
    }
    
    // Check if code matches
    if (verification.verificationCode !== code) {
      return NextResponse.json(
        { message: "Código de verificación incorrecto" },
        { status: 400 }
      );
    }
    
    // Code is valid, proceed with the order
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
    
    // Remove verification from pending
    removePendingVerification(email);
    
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