/**
 * Vercel Blob Storage utility functions
 * 
 * This module provides a simple interface for storing and retrieving JSON data
 * using Vercel's Blob Storage. It abstracts away the details of working with
 * the Blob API and provides type-safe access to our application data.
 * 
 * In development mode, it falls back to file-based storage if Blob storage fails.
 */

import { put, list, del, head } from '@vercel/blob';
import fs from 'fs';
import path from 'path';

// Key prefixes for different data types
const TRIALS_PREFIX = 'trials/';
const VERIFICATIONS_PREFIX = 'verifications/';

// Get the token from environment variables
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN || '';

// Fallback file paths for development mode
const DATA_DIR = path.join(process.cwd(), 'data');
const TRIALS_FILE = path.join(DATA_DIR, 'trials.json');
const PENDING_VERIFICATIONS_FILE = path.join(DATA_DIR, 'pendingVerifications.json');

// Flag to indicate if we're in development mode
const IS_DEV = process.env.NODE_ENV === 'development';

// Initialize file storage if in development mode
if (IS_DEV) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
      console.log('[blobStorage] Created fallback data directory');
    }
    
    if (!fs.existsSync(TRIALS_FILE)) {
      fs.writeFileSync(TRIALS_FILE, JSON.stringify({ trials: [] }, null, 2));
      console.log('[blobStorage] Created fallback trials file');
    }
    
    if (!fs.existsSync(PENDING_VERIFICATIONS_FILE)) {
      fs.writeFileSync(PENDING_VERIFICATIONS_FILE, JSON.stringify({ pendingVerifications: [] }, null, 2));
      console.log('[blobStorage] Created fallback pending verifications file');
    }
    
    console.log('[blobStorage] Fallback file storage initialized for development mode');
  } catch (error) {
    console.error('[blobStorage] Error initializing fallback file storage:', error);
  }
}

/**
 * Generic function to upload JSON data to Vercel Blob storage
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function uploadJson<T>(key: string, data: T, allowOverwrite: boolean = false): Promise<string> {
  try {
    const jsonString = JSON.stringify(data);
    const { url } = await put(key, jsonString, { 
      access: 'public',
      addRandomSuffix: false, // We want to control our key names exactly
      token: BLOB_TOKEN,
      allowOverwrite
    });
    
    return url;
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed, using file fallback for ${key}:`, error);
      return saveToFile(key, data);
    }
    throw error;
  }
}

/**
 * Generic function to get JSON data from Vercel Blob storage
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function getJson<T>(key: string): Promise<T | null> {
  try {
    const blobDetails = await head(key, { token: BLOB_TOKEN });
    
    if (!blobDetails) {
      return null;
    }
    
    // Fetch the actual content
    const response = await fetch(blobDetails.url);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob content: ${response.statusText}`);
    }
    
    const jsonString = await response.text();
    return JSON.parse(jsonString) as T;
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed, using file fallback for ${key}:`, error);
      return getFromFile<T>(key);
    }
    console.error(`[blobStorage] Error getting blob at key ${key}:`, error);
    return null;
  }
}

/**
 * Fallback function to save data to file in development mode
 */
function saveToFile<T>(key: string, data: T): string {
  try {
    if (key.startsWith(TRIALS_PREFIX)) {
      const email = key.replace(TRIALS_PREFIX, '').replace('.json', '');
      const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
      
      // Remove existing trial with same email if it exists
      trialsData.trials = trialsData.trials.filter((t: any) => t.email !== (data as any).email);
      
      // Add new trial
      trialsData.trials.push(data);
      
      // Write back to file
      fs.writeFileSync(TRIALS_FILE, JSON.stringify(trialsData, null, 2));
      
      return `file://${TRIALS_FILE}#${email}`;
    } 
    else if (key.startsWith(VERIFICATIONS_PREFIX)) {
      const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
      
      // Add new verification
      verificationsData.pendingVerifications.push(data);
      
      // Write back to file
      fs.writeFileSync(PENDING_VERIFICATIONS_FILE, JSON.stringify(verificationsData, null, 2));
      
      return `file://${PENDING_VERIFICATIONS_FILE}#${(data as any).email}`;
    }
    
    return `file://unknown-key-${key}`;
  } catch (error) {
    console.error(`[blobStorage] Error saving to file for ${key}:`, error);
    return `error://${key}`;
  }
}

/**
 * Fallback function to get data from file in development mode
 */
function getFromFile<T>(key: string): T | null {
  try {
    if (key.startsWith(TRIALS_PREFIX)) {
      const email = key.replace(TRIALS_PREFIX, '').replace('.json', '');
      const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
      
      const trial = trialsData.trials.find((t: any) => t.email === email);
      return trial as T || null;
    } 
    else if (key.startsWith(VERIFICATIONS_PREFIX)) {
      const parts = key.replace(VERIFICATIONS_PREFIX, '').split('-');
      const email = parts[0];
      const timestamp = parseInt(parts[1]?.replace('.json', '') || '0');
      
      const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
      
      // Find the verification with matching email and timestamp
      const verification = verificationsData.pendingVerifications.find(
        (v: any) => v.email === email && v.createdAt === timestamp
      );
      
      return verification as T || null;
    }
    
    return null;
  } catch (error) {
    console.error(`[blobStorage] Error reading from file for ${key}:`, error);
    return null;
  }
}

/**
 * List objects with a specific prefix from Vercel Blob storage
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function listJson(prefix: string): Promise<string[]> {
  try {
    const { blobs } = await list({ prefix, token: BLOB_TOKEN });
    return blobs.map(blob => blob.url);
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for listing ${prefix}, using file fallback:`, error);
      return listFromFile(prefix);
    }
    console.error(`[blobStorage] Error listing blobs with prefix ${prefix}:`, error);
    return [];
  }
}

/**
 * Delete a JSON object from Vercel Blob storage
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function deleteJson(key: string): Promise<boolean> {
  try {
    await del(key, { token: BLOB_TOKEN });
    return true;
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for deleting ${key}, using file fallback:`, error);
      return deleteFromFile(key);
    }
    console.error(`[blobStorage] Error deleting blob at key ${key}:`, error);
    return false;
  }
}

/**
 * Fallback function to list data from file in development mode
 */
function listFromFile(prefix: string): string[] {
  try {
    if (prefix === TRIALS_PREFIX) {
      const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
      return trialsData.trials.map((trial: any) => 
        `file://${TRIALS_FILE}#${trial.email}`
      );
    } 
    else if (prefix.startsWith(VERIFICATIONS_PREFIX)) {
      const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
      const email = prefix.replace(VERIFICATIONS_PREFIX, '').split('-')[0];
      
      const filteredVerifications = email 
        ? verificationsData.pendingVerifications.filter((v: any) => v.email === email)
        : verificationsData.pendingVerifications;
      
      return filteredVerifications.map((verification: any) => 
        `file://${PENDING_VERIFICATIONS_FILE}#${verification.email}-${verification.createdAt}`
      );
    }
    
    return [];
  } catch (error) {
    console.error(`[blobStorage] Error listing from file for prefix ${prefix}:`, error);
    return [];
  }
}

/**
 * Fallback function to delete data from file in development mode
 */
function deleteFromFile(key: string): boolean {
  try {
    if (key.startsWith(TRIALS_PREFIX)) {
      const email = key.replace(TRIALS_PREFIX, '').replace('.json', '');
      const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
      
      // Filter out the trial with the matching email
      trialsData.trials = trialsData.trials.filter((t: any) => t.email !== email);
      
      // Write back to file
      fs.writeFileSync(TRIALS_FILE, JSON.stringify(trialsData, null, 2));
      
      return true;
    } 
    else if (key.startsWith(VERIFICATIONS_PREFIX)) {
      const parts = key.replace(VERIFICATIONS_PREFIX, '').split('-');
      const email = parts[0];
      const timestamp = parseInt(parts[1]?.replace('.json', '') || '0');
      
      const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
      
      // Filter out the verification with matching email and timestamp
      if (timestamp) {
        verificationsData.pendingVerifications = verificationsData.pendingVerifications.filter(
          (v: any) => !(v.email === email && v.createdAt === timestamp)
        );
      } else {
        // If no timestamp, remove all verifications for this email
        verificationsData.pendingVerifications = verificationsData.pendingVerifications.filter(
          (v: any) => v.email !== email
        );
      }
      
      // Write back to file
      fs.writeFileSync(PENDING_VERIFICATIONS_FILE, JSON.stringify(verificationsData, null, 2));
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`[blobStorage] Error deleting from file for key ${key}:`, error);
    return false;
  }
}

// Trial-specific functions

export interface Trial {
  email: string;
  name: string;
  instagramUrl: string;
  reelId: string;
  timestamp: number;
}

/**
 * Save a completed trial to Blob storage
 */
export async function saveTrial(trial: Trial, allowOverwrite: boolean = true): Promise<string> {
  const key = `${TRIALS_PREFIX}${trial.email}.json`;
  return uploadJson<Trial>(key, trial, allowOverwrite);
}

/**
 * Check if a trial exists for a given email
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function trialExistsForEmail(email: string): Promise<boolean> {
  try {
    const key = `${TRIALS_PREFIX}${email}.json`;
    const trial = await getJson<Trial>(key);
    return trial !== null;
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for checking trial existence for ${email}, using file fallback:`, error);
      return trialExistsInFile(email);
    }
    console.error(`[blobStorage] Error checking if trial exists for ${email}:`, error);
    return false;
  }
}

/**
 * Get a trial by email
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function getTrialByEmail(email: string): Promise<Trial | null> {
  try {
    const key = `${TRIALS_PREFIX}${email}.json`;
    return getJson<Trial>(key);
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for getting trial for ${email}, using file fallback:`, error);
      return getTrialFromFile(email);
    }
    console.error(`[blobStorage] Error getting trial for ${email}:`, error);
    return null;
  }
}

/**
 * Check if a trial exists for a given Instagram reel URL or ID
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function trialExistsForInstagramReel(reelId: string): Promise<boolean> {
  try {
    // This requires listing all trials and checking each one
    // In a real production app, you might want to index by reelId somehow
    const { blobs } = await list({ prefix: TRIALS_PREFIX, token: BLOB_TOKEN });
    
    for (const blob of blobs) {
      const trial = await getJson<Trial>(blob.pathname);
      if (trial && trial.reelId === reelId) {
        return true;
      }
    }
    
    return false;
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for checking reel existence for ${reelId}, using file fallback:`, error);
      return reelExistsInFile(reelId);
    }
    console.error(`[blobStorage] Error checking if trial exists for reel ${reelId}:`, error);
    return false;
  }
}

/**
 * Fallback function to check if a trial exists in file in development mode
 */
function trialExistsInFile(email: string): boolean {
  try {
    const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
    return trialsData.trials.some((t: Trial) => t.email === email);
  } catch (error) {
    console.error(`[blobStorage] Error checking trial existence in file for ${email}:`, error);
    return false;
  }
}

/**
 * Fallback function to get a trial from file in development mode
 */
function getTrialFromFile(email: string): Trial | null {
  try {
    const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
    return trialsData.trials.find((t: Trial) => t.email === email) || null;
  } catch (error) {
    console.error(`[blobStorage] Error getting trial from file for ${email}:`, error);
    return null;
  }
}

/**
 * Fallback function to check if a reel exists in file in development mode
 */
function reelExistsInFile(reelId: string): boolean {
  try {
    const trialsData = JSON.parse(fs.readFileSync(TRIALS_FILE, 'utf8'));
    return trialsData.trials.some((t: Trial) => t.reelId === reelId);
  } catch (error) {
    console.error(`[blobStorage] Error checking reel existence in file for ${reelId}:`, error);
    return false;
  }
}

// Verification-specific functions

export interface PendingVerification {
  email: string;
  name: string;
  instagramUrl: string;
  verificationCode: string;
  createdAt: number;
  expiresAt: number;
  attempts: number;
}

/**
 * Save a pending verification to Blob storage
 */
export async function savePendingVerification(verification: PendingVerification): Promise<string> {
  // Include timestamp in key to allow multiple verification attempts
  const key = `${VERIFICATIONS_PREFIX}${verification.email}-${verification.createdAt}.json`;
  return uploadJson<PendingVerification>(key, verification, true);
}

/**
 * Get the most recent pending verification for an email
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function getLatestPendingVerification(email: string): Promise<PendingVerification | null> {
  try {
    const { blobs } = await list({ prefix: `${VERIFICATIONS_PREFIX}${email}-`, token: BLOB_TOKEN });
    
    if (blobs.length === 0) {
      return null;
    }
    
    // Sort by createdAt (newest first)
    const sortedBlobs = blobs.sort((a, b) => {
      // Extract timestamp from key
      const timestampA = parseInt(a.pathname.split('-').pop()?.split('.')[0] || '0');
      const timestampB = parseInt(b.pathname.split('-').pop()?.split('.')[0] || '0');
      return timestampB - timestampA;
    });
    
    // Get the newest verification
    return getJson<PendingVerification>(sortedBlobs[0].pathname);
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for getting latest verification for ${email}, using file fallback:`, error);
      return getLatestVerificationFromFile(email);
    }
    console.error(`[blobStorage] Error getting latest verification for ${email}:`, error);
    return null;
  }
}

/**
 * Fallback function to get the latest verification from file in development mode
 */
function getLatestVerificationFromFile(email: string): PendingVerification | null {
  try {
    const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
    
    // Filter verifications for this email
    const userVerifications = verificationsData.pendingVerifications.filter(
      (v: PendingVerification) => v.email === email
    );
    
    if (userVerifications.length === 0) {
      return null;
    }
    
    // Sort by createdAt (newest first)
    userVerifications.sort((a: PendingVerification, b: PendingVerification) => 
      b.createdAt - a.createdAt
    );
    
    // Return the newest verification
    return userVerifications[0];
  } catch (error) {
    console.error(`[blobStorage] Error getting latest verification from file for ${email}:`, error);
    return null;
  }
}

/**
 * Update a pending verification (e.g., increment attempts)
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function updatePendingVerification(
  verification: PendingVerification
): Promise<string> {
  try {
    const key = `${VERIFICATIONS_PREFIX}${verification.email}-${verification.createdAt}.json`;
    return uploadJson<PendingVerification>(key, verification, true);
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for updating verification for ${verification.email}, using file fallback:`, error);
      return updateVerificationInFile(verification);
    }
    console.error(`[blobStorage] Error updating verification for ${verification.email}:`, error);
    throw error;
  }
}

/**
 * Delete all pending verifications for an email after successful verification
 * Falls back to file storage in development mode if Blob storage fails
 */
export async function deletePendingVerifications(email: string): Promise<boolean> {
  try {
    const { blobs } = await list({ prefix: `${VERIFICATIONS_PREFIX}${email}-`, token: BLOB_TOKEN });
    
    for (const blob of blobs) {
      await del(blob.pathname, { token: BLOB_TOKEN });
    }
    
    return true;
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for deleting verifications for ${email}, using file fallback:`, error);
      return deleteVerificationsFromFile(email);
    }
    console.error(`[blobStorage] Error deleting pending verifications for ${email}:`, error);
    return false;
  }
}

/**
 * Fallback function to update a verification in file in development mode
 */
function updateVerificationInFile(verification: PendingVerification): string {
  try {
    const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
    
    // Find the index of the verification to update
    const index = verificationsData.pendingVerifications.findIndex(
      (v: PendingVerification) => 
        v.email === verification.email && v.createdAt === verification.createdAt
    );
    
    if (index !== -1) {
      // Update the verification
      verificationsData.pendingVerifications[index] = verification;
      
      // Write back to file
      fs.writeFileSync(PENDING_VERIFICATIONS_FILE, JSON.stringify(verificationsData, null, 2));
      
      return `file://${PENDING_VERIFICATIONS_FILE}#${verification.email}-${verification.createdAt}`;
    }
    
    // If not found, add as new
    verificationsData.pendingVerifications.push(verification);
    fs.writeFileSync(PENDING_VERIFICATIONS_FILE, JSON.stringify(verificationsData, null, 2));
    
    return `file://${PENDING_VERIFICATIONS_FILE}#${verification.email}-${verification.createdAt}`;
  } catch (error) {
    console.error(`[blobStorage] Error updating verification in file for ${verification.email}:`, error);
    return `error://${verification.email}`;
  }
}

/**
 * Fallback function to delete verifications from file in development mode
 */
function deleteVerificationsFromFile(email: string): boolean {
  try {
    const verificationsData = JSON.parse(fs.readFileSync(PENDING_VERIFICATIONS_FILE, 'utf8'));
    
    // Filter out verifications for this email
    verificationsData.pendingVerifications = verificationsData.pendingVerifications.filter(
      (v: PendingVerification) => v.email !== email
    );
    
    // Write back to file
    fs.writeFileSync(PENDING_VERIFICATIONS_FILE, JSON.stringify(verificationsData, null, 2));
    
    return true;
  } catch (error) {
    console.error(`[blobStorage] Error deleting verifications from file for ${email}:`, error);
    return false;
  }
}

/**
 * Clean up expired verifications
 * (This could be run periodically via a cron job)
 */
export async function cleanupExpiredVerifications(): Promise<number> {
  try {
    const { blobs } = await list({ prefix: VERIFICATIONS_PREFIX });
    const now = Date.now();
    let deletedCount = 0;
    
    for (const blob of blobs) {
      const verification = await getJson<PendingVerification>(blob.pathname);
      
      if (verification && verification.expiresAt < now) {
        await del(blob.pathname);
        deletedCount++;
      }
    }
    
    return deletedCount;
  } catch (error) {
    console.error('Error cleaning up expired verifications:', error);
    return 0;
  }
}

/**
 * Check if a trial exists for a given email or Instagram URL
 * Falls back to file storage in development mode if Blob storage fails
 * @param email User's email
 * @param instagramUrl Instagram reel URL
 * @returns Object indicating if a trial exists and the reason
 */
export async function checkTrialExists(
  email: string, 
  instagramUrl: string
): Promise<{ exists: boolean; reason?: 'email' | 'url' }> {
  try {
    // First check if the email has been used
    const emailExists = await trialExistsForEmail(email);
    if (emailExists) {
      return { exists: true, reason: 'email' };
    }
    
    // Extract the reel ID from the URL
    const reelId = extractReelId(instagramUrl);
    if (!reelId) {
      return { exists: false };
    }
    
    // Check if the reel ID has been used
    const reelExists = await trialExistsForInstagramReel(reelId);
    if (reelExists) {
      return { exists: true, reason: 'url' };
    }
    
    // No trial exists for this email or URL
    return { exists: false };
  } catch (error) {
    if (IS_DEV) {
      console.warn(`[blobStorage] Blob storage failed for checking trial existence for ${email}, using file fallback:`, error);
      return checkTrialExistsInFile(email, instagramUrl);
    }
    console.error('[blobStorage] Error checking trial existence:', error);
    return { exists: false }; // Default to not exists on error
  }
}

/**
 * Fallback function to check if a trial exists in file in development mode
 */
function checkTrialExistsInFile(email: string, instagramUrl: string): { exists: boolean; reason?: 'email' | 'url' } {
  try {
    // First check if the email has been used
    const emailExists = trialExistsInFile(email);
    if (emailExists) {
      return { exists: true, reason: 'email' };
    }
    
    // Extract the reel ID from the URL
    const reelId = extractReelId(instagramUrl);
    if (!reelId) {
      return { exists: false };
    }
    
    // Check if the reel ID has been used
    const reelExists = reelExistsInFile(reelId);
    if (reelExists) {
      return { exists: true, reason: 'url' };
    }
    
    // No trial exists for this email or URL
    return { exists: false };
  } catch (error) {
    console.error('[blobStorage] Error checking trial existence in file:', error);
    return { exists: false }; // Default to not exists on error
  }
}

/**
 * Extract the reel ID from an Instagram URL
 * @param url Instagram reel URL
 * @returns Extracted reel ID or null if not found
 */
export function extractReelId(url: string): string | null {
  const match = url.match(/\/(?:reel|p)\/([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
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