import { isValidInstagramReelUrl, addReelViewsOrder } from "@/lib/api";
import { saveTrial, extractReelId } from "@/lib/blobStorage";

interface ProcessTrialInput {
  name: string;
  email: string;
  reelUrl: string;
  referralCode?: string;
  verificationMethod: 'email' | 'direct';
}

interface ProcessTrialResult {
  success: boolean;
  order?: string;
  error?: string;
}

/**
 * Process a trial request by calling the JustAnotherPanel API and saving the trial record
 * @param input The trial input data
 * @returns A result object indicating success or failure
 */
export async function processTrial(input: ProcessTrialInput): Promise<ProcessTrialResult> {
  try {
    const { name, email, reelUrl, verificationMethod } = input;

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return {
        success: false,
        error: "Formato de email inválido",
      };
    }

    // Validate Instagram reel URL
    if (!isValidInstagramReelUrl(reelUrl)) {
      return {
        success: false,
        error: "URL de Instagram reel inválida",
      };
    }

    // Call the JustAnotherPanel API to add the order
    console.log(`[processTrial] Adding reel views order for ${reelUrl}`);
    const result = await addReelViewsOrder({ link: reelUrl });

    if (!result.success) {
      console.error("[processTrial] Error adding reel views order:", result.error);
      return {
        success: false,
        error: result.error || "Error al procesar la solicitud. Por favor, inténtalo de nuevo.",
      };
    }

    // Save the trial record to prevent duplicates
    const reelId = extractReelId(reelUrl) || reelUrl;
    
    // Add metadata about verification method in the name field
    const fullName = `${name} (${verificationMethod})`;
    
    await saveTrial({
      email,
      name: fullName,
      instagramUrl: reelUrl,
      reelId,
      timestamp: Date.now(),
    });

    return {
      success: true,
      order: result.order ? result.order.toString() : undefined,
    };
  } catch (error) {
    console.error("[processTrial] Error processing trial:", error);
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    
    return {
      success: false,
      error: `Error al procesar la solicitud: ${errorMessage}`,
    };
  }
} 