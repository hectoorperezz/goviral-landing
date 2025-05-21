import { NextResponse } from "next/server";
import { isValidInstagramReelUrl } from "@/lib/api";
import { checkTrialExists } from "@/lib/fileStorage";
import { createPendingVerification } from "@/lib/verification";
import { sendVerificationEmail } from "@/lib/email";

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
    
    // Check if this email or Instagram URL has already been used for a trial
    const trialCheck = await checkTrialExists(email, reelUrl);
    if (trialCheck.exists) {
      const reason = trialCheck.reason === 'email' 
        ? "Este email ya ha sido utilizado para una prueba gratuita."
        : "Este reel de Instagram ya ha recibido una prueba gratuita.";
      
      return NextResponse.json(
        { message: reason },
        { status: 409 } // 409 Conflict
      );
    }
    
    // Create pending verification
    const verification = await createPendingVerification(name, email, reelUrl);
    
    if (!verification) {
      return NextResponse.json(
        { message: "Error al crear la verificación. Por favor, inténtalo de nuevo." },
        { status: 500 }
      );
    }
    
    // Send verification email
    const emailResult = await sendVerificationEmail(
      email,
      name,
      verification.verificationCode
    );
    
    if (!emailResult.success) {
      return NextResponse.json(
        { message: "Error al enviar el email de verificación. Por favor, inténtalo de nuevo." },
        { status: 500 }
      );
    }
    
    // Return success response with preview URL if in development
    return NextResponse.json({
      message: "Hemos enviado un código de verificación a tu email.",
      email
    });
    
  } catch (error) {
    console.error("Error processing verification request:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 