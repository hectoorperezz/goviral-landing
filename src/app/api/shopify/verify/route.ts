import { NextResponse } from "next/server";
import { verifyShopifyConnection } from "@/lib/shopify";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

export async function GET(request: Request) {
  try {
    console.log("Verifying Shopify connection...");
    
    // Verify the Shopify connection using the updated function
    const result = await verifyShopifyConnection(SHOPIFY_ADMIN_API_TOKEN);
    
    if (!result.success) {
      console.error("Error verifying Shopify connection:", result.error);
      return NextResponse.json(
        { 
          message: "Error al verificar la conexión con Shopify",
          error: result.error 
        },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      message: "Conexión con Shopify verificada correctamente",
      success: true,
      shop: result.shop
    });
    
  } catch (error) {
    console.error("Error verifying Shopify connection:", error);
    return NextResponse.json(
      { 
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 