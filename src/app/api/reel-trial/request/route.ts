import { NextResponse } from "next/server";
import { isValidInstagramReelUrl } from "@/lib/api";
import { 
  checkTrialExists, 
  savePendingVerification, 
  extractReelId,
  generateVerificationCode
} from "@/lib/blobStorage";
import { sendVerificationEmail } from "@/lib/email";

// Verification code expiration time (24 hours in milliseconds)
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

export async function POST(request: Request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { name, email, reelUrl } = body;
    
    console.log(`[reel-trial/request] Processing request for ${email}`);
    
    // Validate required fields
    if (!name || !email || !reelUrl) {
      console.warn(`[reel-trial/request] Missing required fields: ${!name ? 'name' : ''} ${!email ? 'email' : ''} ${!reelUrl ? 'reelUrl' : ''}`);
      return NextResponse.json(
        { message: "Nombre, email y URL del reel son obligatorios" },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.warn(`[reel-trial/request] Invalid email format: ${email}`);
      return NextResponse.json(
        { message: "Formato de email inválido" },
        { status: 400 }
      );
    }
    
    // Validate Instagram reel URL
    if (!isValidInstagramReelUrl(reelUrl)) {
      console.warn(`[reel-trial/request] Invalid Instagram reel URL: ${reelUrl}`);
      return NextResponse.json(
        { message: "URL de Instagram reel inválida" },
        { status: 400 }
      );
    }
    
    console.log(`[reel-trial/request] Checking if trial exists for email: ${email}, reel: ${reelUrl}`);
    
    // Check if this email or Instagram URL has already been used for a trial
    const trialCheck = await checkTrialExists(email, reelUrl);
    if (trialCheck.exists) {
      const reason = trialCheck.reason === 'email' 
        ? "Este email ya ha sido utilizado para una prueba gratuita."
        : "Este reel de Instagram ya ha recibido una prueba gratuita.";
      
      console.warn(`[reel-trial/request] Trial already exists: ${reason}`);
      
      return NextResponse.json(
        { message: reason },
        { status: 409 } // 409 Conflict
      );
    }
    
    // Generate verification code
    const verificationCode = generateVerificationCode();
    const now = Date.now();
    
    console.log(`[reel-trial/request] Generated verification code for ${email}`);
    
    // Create pending verification object
    const verification = {
      email,
      name,
      instagramUrl: reelUrl,
      verificationCode,
      createdAt: now,
      expiresAt: now + EXPIRATION_TIME,
      attempts: 0
    };
    
    // Save pending verification to Blob storage
    console.log(`[reel-trial/request] Saving verification to blob storage for ${email}`);
    const verificationUrl = await savePendingVerification(verification);
    
    if (!verificationUrl) {
      console.error(`[reel-trial/request] Failed to save verification for ${email}`);
      return NextResponse.json(
        { message: "Error al crear la verificación. Por favor, inténtalo de nuevo." },
        { status: 500 }
      );
    }
    
    console.log(`[reel-trial/request] Verification saved successfully at: ${verificationUrl}`);
    
    // Send verification email
    console.log(`[reel-trial/request] Sending verification email to ${email}`);
    const emailResult = await sendVerificationEmail(
      email,
      name,
      verificationCode
    );
    
    if (!emailResult.success) {
      console.error(`[reel-trial/request] Failed to send verification email to ${email}: ${emailResult.info || 'Unknown error'}`);
      return NextResponse.json(
        { message: "Error al enviar el email de verificación. Por favor, inténtalo de nuevo." },
        { status: 500 }
      );
    }
    
    console.log(`[reel-trial/request] Verification email sent successfully to ${email}`);
    
    // Return success response with preview URL if in development
    return NextResponse.json({
      message: "Hemos enviado un código de verificación a tu email.",
      email,
      previewUrl: emailResult.previewUrl
    });
    
  } catch (error) {
    console.error("[reel-trial/request] Error processing verification request:", error);
    
    // Detailed error information for debugging
    const errorDetails = {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    };
    
    console.error("[reel-trial/request] Error details:", errorDetails);
    
    return NextResponse.json(
      { message: "Error interno del servidor", details: process.env.NODE_ENV === 'development' ? errorDetails : undefined },
      { status: 500 }
    );
  }
} 