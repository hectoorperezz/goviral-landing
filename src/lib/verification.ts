import fs from 'fs';
import path from 'path';

// Define the structure of a pending verification
export interface PendingVerification {
  email: string;
  name: string;
  instagramUrl: string;
  verificationCode: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

// Define the structure of the storage file
interface VerificationStorageData {
  pendingVerifications: PendingVerification[];
}

// Path to the storage file
const DATA_DIR = path.join(process.cwd(), 'data');
const VERIFICATION_FILE = path.join(DATA_DIR, 'verifications.json');

// Verification code expiration time (24 hours in milliseconds)
const EXPIRATION_TIME = 24 * 60 * 60 * 1000;

/**
 * Ensure the verification storage file exists
 */
export async function ensureVerificationStorageExists(): Promise<void> {
  try {
    // Check if the data directory exists, if not create it
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Check if the verification file exists, if not create it with empty array
    if (!fs.existsSync(VERIFICATION_FILE)) {
      const initialData: VerificationStorageData = { pendingVerifications: [] };
      fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring verification storage exists:', error);
    throw new Error('Failed to initialize verification storage');
  }
}

/**
 * Get all pending verifications from the storage file
 * @returns Array of pending verifications
 */
export async function getPendingVerifications(): Promise<PendingVerification[]> {
  try {
    await ensureVerificationStorageExists();
    
    const fileContent = fs.readFileSync(VERIFICATION_FILE, 'utf8');
    const data: VerificationStorageData = JSON.parse(fileContent);
    return data.pendingVerifications;
  } catch (error) {
    console.error('Error getting pending verifications:', error);
    return [];
  }
}

/**
 * Generate a random 6-digit verification code
 * @returns A 6-digit verification code
 */
export function generateVerificationCode(): string {
  // Generate a random 6-digit number
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  return code;
}

/**
 * Create a new pending verification
 * @param name User's name
 * @param email User's email
 * @param instagramUrl Instagram reel URL
 * @returns The created verification object or null if failed
 */
export async function createPendingVerification(
  name: string,
  email: string,
  instagramUrl: string
): Promise<PendingVerification | null> {
  try {
    await ensureVerificationStorageExists();
    
    // Get current verifications
    const verifications = await getPendingVerifications();
    
    // Check if there's already a pending verification for this email
    const existingIndex = verifications.findIndex(v => v.email.toLowerCase() === email.toLowerCase());
    
    // Generate verification code and expiration time
    const verificationCode = generateVerificationCode();
    const now = Date.now();
    const expiresAt = now + EXPIRATION_TIME;
    
    // Create new verification object
    const newVerification: PendingVerification = {
      email,
      name,
      instagramUrl,
      verificationCode,
      createdAt: now,
      expiresAt,
      attempts: 0
    };
    
    // If there's an existing verification, update it; otherwise add a new one
    if (existingIndex >= 0) {
      verifications[existingIndex] = newVerification;
    } else {
      verifications.push(newVerification);
    }
    
    // Write back to file
    const updatedData: VerificationStorageData = { pendingVerifications: verifications };
    fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(updatedData, null, 2));
    
    return newVerification;
  } catch (error) {
    console.error('Error creating pending verification:', error);
    return null;
  }
}

/**
 * Find a pending verification by email
 * @param email User's email
 * @returns The pending verification or null if not found
 */
export async function findPendingVerificationByEmail(email: string): Promise<PendingVerification | null> {
  try {
    const verifications = await getPendingVerifications();
    const verification = verifications.find(v => v.email.toLowerCase() === email.toLowerCase());
    
    if (!verification) {
      return null;
    }
    
    // Check if verification has expired
    if (verification.expiresAt < Date.now()) {
      return null;
    }
    
    return verification;
  } catch (error) {
    console.error('Error finding pending verification:', error);
    return null;
  }
}

/**
 * Verify a code for a given email
 * @param email User's email
 * @param code Verification code
 * @returns Object indicating if verification was successful and the verification data
 */
export async function verifyCode(
  email: string,
  code: string
): Promise<{ success: boolean; verification: PendingVerification | null; message?: string }> {
  try {
    await ensureVerificationStorageExists();
    
    // Get all verifications
    const verifications = await getPendingVerifications();
    const verificationIndex = verifications.findIndex(v => v.email.toLowerCase() === email.toLowerCase());
    
    // If no verification found
    if (verificationIndex === -1) {
      return { 
        success: false, 
        verification: null,
        message: "No se encontró ninguna verificación pendiente para este email."
      };
    }
    
    const verification = verifications[verificationIndex];
    
    // Check if verification has expired
    if (verification.expiresAt < Date.now()) {
      // Remove expired verification
      verifications.splice(verificationIndex, 1);
      const updatedData: VerificationStorageData = { pendingVerifications: verifications };
      fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(updatedData, null, 2));
      
      return { 
        success: false, 
        verification: null,
        message: "El código de verificación ha expirado. Por favor, solicita uno nuevo."
      };
    }
    
    // Increment attempts
    verification.attempts += 1;
    verifications[verificationIndex] = verification;
    
    // Save updated attempts
    const updatedData: VerificationStorageData = { pendingVerifications: verifications };
    fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(updatedData, null, 2));
    
    // Check if code matches
    if (verification.verificationCode !== code) {
      return { 
        success: false, 
        verification,
        message: "Código de verificación incorrecto. Por favor, inténtalo de nuevo."
      };
    }
    
    // Code is correct, remove from pending verifications
    verifications.splice(verificationIndex, 1);
    fs.writeFileSync(VERIFICATION_FILE, JSON.stringify({ pendingVerifications: verifications }, null, 2));
    
    return { success: true, verification };
  } catch (error) {
    console.error('Error verifying code:', error);
    return { 
      success: false, 
      verification: null,
      message: "Error al verificar el código. Por favor, inténtalo de nuevo."
    };
  }
}

/**
 * Clean up expired verifications
 * @returns Number of removed expired verifications
 */
export async function cleanupExpiredVerifications(): Promise<number> {
  try {
    await ensureVerificationStorageExists();
    
    // Get all verifications
    const verifications = await getPendingVerifications();
    const now = Date.now();
    
    // Filter out expired verifications
    const validVerifications = verifications.filter(v => v.expiresAt > now);
    const removedCount = verifications.length - validVerifications.length;
    
    // Save updated verifications
    const updatedData: VerificationStorageData = { pendingVerifications: validVerifications };
    fs.writeFileSync(VERIFICATION_FILE, JSON.stringify(updatedData, null, 2));
    
    return removedCount;
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error);
    return 0;
  }
} 