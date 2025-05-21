import { NextResponse } from "next/server";
import { verifyShopifyConnection } from "@/lib/shopify";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

export async function GET(request: Request) {
  try {
    console.log("Testing Shopify connection...");
    
    // Verify the Shopify connection
    const result = await verifyShopifyConnection(SHOPIFY_ADMIN_API_TOKEN);
    
    // Return detailed diagnostic information
    return NextResponse.json({
      success: result.success,
      message: result.success 
        ? "Conexión con Shopify establecida correctamente" 
        : "Error al conectar con Shopify",
      error: result.error,
      shop: result.shop,
      diagnostics: {
        apiVersion: "2023-10", // Should match the version in shopify.ts
        storeUrl: "goviral-4810.myshopify.com", // Should match the URL in shopify.ts
        tokenProvided: SHOPIFY_ADMIN_API_TOKEN ? "Yes" : "No" // Secure way to check if token is provided
      }
    });
    
  } catch (error) {
    console.error("Error in Shopify test endpoint:", error);
    return NextResponse.json(
      { 
        success: false,
        message: "Error interno del servidor",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 