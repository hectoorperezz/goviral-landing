import fs from 'fs';
import path from 'path';

// Define the structure of a trial record
interface TrialRecord {
  email: string;
  instagramUrl: string;
  reelId: string;
  timestamp: number;
}

// Define the structure of the storage file
interface StorageData {
  trials: TrialRecord[];
}

// Path to the storage file
const DATA_DIR = path.join(process.cwd(), 'data');
const STORAGE_FILE = path.join(DATA_DIR, 'trials.json');

/**
 * Ensure the storage directory and file exist
 */
export async function ensureStorageExists(): Promise<void> {
  try {
    // Check if the data directory exists, if not create it
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    // Check if the storage file exists, if not create it with empty trials array
    if (!fs.existsSync(STORAGE_FILE)) {
      const initialData: StorageData = { trials: [] };
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(initialData, null, 2));
    }
  } catch (error) {
    console.error('Error ensuring storage exists:', error);
    throw new Error('Failed to initialize storage');
  }
}

/**
 * Get all trial records from the storage file
 * @returns Array of trial records
 */
export async function getTrials(): Promise<TrialRecord[]> {
  try {
    await ensureStorageExists();
    
    const fileContent = fs.readFileSync(STORAGE_FILE, 'utf8');
    const data: StorageData = JSON.parse(fileContent);
    return data.trials;
  } catch (error) {
    console.error('Error getting trials:', error);
    return [];
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
 * Check if a trial already exists for the given email or Instagram URL
 * @param email User's email
 * @param instagramUrl Instagram reel URL
 * @returns Object indicating if a trial exists and why
 */
export async function checkTrialExists(email: string, instagramUrl: string): Promise<{ exists: boolean; reason?: string }> {
  try {
    const trials = await getTrials();
    const reelId = extractReelId(instagramUrl);
    
    // Check if email already used
    const emailExists = trials.some(trial => trial.email.toLowerCase() === email.toLowerCase());
    if (emailExists) {
      return { exists: true, reason: 'email' };
    }
    
    // Check if Instagram URL or reel ID already used
    if (reelId) {
      const reelExists = trials.some(trial => 
        trial.reelId === reelId || 
        trial.instagramUrl.toLowerCase() === instagramUrl.toLowerCase()
      );
      
      if (reelExists) {
        return { exists: true, reason: 'instagram' };
      }
    }
    
    return { exists: false };
  } catch (error) {
    console.error('Error checking if trial exists:', error);
    // If there's an error, we'll allow the trial to proceed
    return { exists: false };
  }
}

/**
 * Add a new trial record to the storage file
 * @param email User's email
 * @param instagramUrl Instagram reel URL
 * @returns True if successful, false otherwise
 */
export async function addTrial(email: string, instagramUrl: string): Promise<boolean> {
  try {
    await ensureStorageExists();
    
    const trials = await getTrials();
    const reelId = extractReelId(instagramUrl) || '';
    
    // Create new trial record
    const newTrial: TrialRecord = {
      email,
      instagramUrl,
      reelId,
      timestamp: Date.now()
    };
    
    // Add to trials array
    trials.push(newTrial);
    
    // Write back to file
    const updatedData: StorageData = { trials };
    fs.writeFileSync(STORAGE_FILE, JSON.stringify(updatedData, null, 2));
    
    return true;
  } catch (error) {
    console.error('Error adding trial:', error);
    return false;
  }
} 