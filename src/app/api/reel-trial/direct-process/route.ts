import { NextResponse } from "next/server";
import { isValidInstagramReelUrl, addReelViewsOrder } from "@/lib/api";
import { createCustomer, ShopifyCustomerInput } from "@/lib/shopify";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, reelUrl } = body;
    
    // Validate required fields
    if (!name || !email || !reelUrl) {
      return NextResponse.json(
        { message: "Nombre, email y URL del reel son obligatorios" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "Formato de email inválido" },
        { status: 400 }
      );
    }
    
    // Validate Instagram reel URL
    if (!isValidInstagramReelUrl(reelUrl)) {
      return NextResponse.json(
        { message: "URL de Instagram reel inválida" },
        { status: 400 }
      );
    }

    // Call the JustAnotherPanel API to add the order
    const result = await addReelViewsOrder({ link: reelUrl });
    
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
      const nameParts = name.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      console.log("Creating Shopify customer with data:", {
        name: name,
        email: email,
        instagramUrl: reelUrl
      });
      
      // Create customer input object
      const customerInput: ShopifyCustomerInput = {
        firstName,
        lastName,
        email: email,
        emailMarketingConsent: {
          marketingState: "SUBSCRIBED",
          marketingOptInLevel: "SINGLE_OPT_IN"
        },
        tags: ["instagram-trial"],
        note: `Cliente creado a través de la prueba gratuita de Instagram. URL del reel: ${reelUrl}`
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
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 