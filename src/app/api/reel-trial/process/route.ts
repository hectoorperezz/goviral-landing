import { NextResponse } from "next/server";
import { isValidInstagramReelUrl, addReelViewsOrder } from "@/lib/api";
import { createCustomer, ShopifyCustomerInput } from "@/lib/shopify";
import { sendVerificationEmail } from "@/lib/email";

// Shopify Admin API token (stored server-side for security)
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

// Almacenamiento en memoria (se pierde al reiniciar el servidor)
const pendingVerifications = new Map();

// Generar un código de verificación aleatorio de 6 dígitos
function generateVerificationCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

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

    // Generate verification code
    const verificationCode = generateVerificationCode();
    
    // Store verification data in memory (instead of file system)
    const verificationData = {
      name,
      email,
      instagramUrl: reelUrl,
      verificationCode,
      timestamp: Date.now(),
      expiresAt: Date.now() + 30 * 60 * 1000 // 30 minutes expiry
    };
    
    // Save to in-memory map
    pendingVerifications.set(email, verificationData);
    
    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationCode
    );
    
    if (!emailResult.success) {
      return NextResponse.json(
        { message: "Error al enviar el email de verificación. Por favor, inténtalo de nuevo." },
        { status: 500 }
      );
    }
    
    // Return success response
    return NextResponse.json({
      message: "Hemos enviado un código de verificación a tu email.",
      email
    });
    
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 