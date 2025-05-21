import { NextResponse } from "next/server";
import { addReelViewsOrder, isValidInstagramReelUrl, storeUserInformation } from "@/lib/api";
import { checkTrialExists, addTrial } from "@/lib/fileStorage";

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
    
    // Store user information for potential follow-up
    await storeUserInformation(name, email, reelUrl);
    
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
    
    // Record the trial in our storage to prevent duplicate trials
    await addTrial(email, reelUrl);
    
    // Return success response
    return NextResponse.json({
      message: "¡Genial! Tu prueba de visualizaciones ha sido enviada.",
      orderId: result.order
    });
    
  } catch (error) {
    console.error("Error processing reel trial request:", error);
    return NextResponse.json(
      { message: "Error interno del servidor" },
      { status: 500 }
    );
  }
} 