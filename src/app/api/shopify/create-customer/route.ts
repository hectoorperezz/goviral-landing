import { NextResponse } from "next/server";
import { createCustomer, ShopifyCustomerInput } from "@/lib/shopify";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, instagramUrl } = body;
    
    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        { message: "Nombre y email son obligatorios" },
        { status: 400 }
      );
    }
    
    // Parse the name (assuming format is "First Last")
    const nameParts = name.split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.slice(1).join(" ") || "";
    
    // Create customer input
    const customerInput: ShopifyCustomerInput = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      emailMarketingConsent: {
        marketingState: "SUBSCRIBED",
        marketingOptInLevel: "SINGLE_OPT_IN"
      },
      tags: ["instagram-trial"],
      note: `Cliente creado a través de la prueba gratuita de Instagram. URL del reel: ${instagramUrl || "No proporcionado"}`
    };
    
    console.log("Creating Shopify customer with data:", {
      name,
      email,
      instagramUrl
    });
    
    // Call the createCustomer function
    const result = await createCustomer(customerInput, SHOPIFY_ADMIN_API_TOKEN);
    
    if (!result.success) {
      console.error("Error creating Shopify customer:", result.error);
      
      // Check if it's a duplicate email error
      if (result.error && result.error.includes("Email has already been taken")) {
        return NextResponse.json(
          { 
            message: "Este email ya existe en nuestra base de datos de clientes.",
            error: "duplicate_email" 
          },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { 
          message: "Error al crear el cliente en Shopify.",
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      message: "Cliente creado exitosamente en Shopify",
      customerId: result.customerId
    });
    
  } catch (error) {
    console.error("Error creating Shopify customer:", error);
    return NextResponse.json(
      { 
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 